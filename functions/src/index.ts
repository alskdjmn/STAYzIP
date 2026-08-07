import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GoogleGenAI, Type } from "@google/genai";
import * as admin from "firebase-admin";

// Firebase Admin 초기화
admin.initializeApp();
const db = admin.firestore();

// Initialize Gemini with the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1beta' } }) : null;

const DEFAULT_MODEL = "gemini-2.5-flash";

// ─── Rate Limit 설정 ───────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1분
const MAX_REQUESTS_PER_MINUTE = 5;       // 유저당 분당 최대 5회
const MAX_REQUESTS_PER_DAY = 50;         // 유저당 하루 최대 50회
// ──────────────────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `1인가구 생활비서 AI. JSON만 반환. 마크다운·부연설명 금지.


[규칙]
- 이미지: 보이는 것만 설명. 불확실하면 보수적 판단
- 안전: 위험 상황 시에만 경고할 것. 단, 질문과 전혀 무관한 아이템에 대해 굳이 끌어와서 안전 경고를 하지 마세요.
- 인벤토리 활용: 질문과 관련된 카테고리의 아이템만 활용하세요. 요리 레시피 질문에는 '냉장고' 카테고리만 참고하고, '청소용품'이나 '기타' 카테고리에 있는 화학물질/세제 등은 아예 없는 취급하세요. "락스는 음식에 넣지 마세요" 같은 불필요하고 당연한 경고는 절대 금지합니다.
- 판단순서: 사진에서 확실한 것 → 관련된 인벤토리 항목 → 현실적 대안

[답변 형식 - user_answer]
- 문장 중간에 불필요한 줄바꿈을 넣지 말고 텍스트가 자연스럽게 화면 끝까지 채워지도록(자동 줄바꿈되도록) 긴 문장으로 작성하세요.
- 각 절차나 문단이 끝날 때만 한 번씩 줄바꿈을 하세요.
- 칸(표, 테이블, |---| 등)은 절대 나누지 마세요. '|' 문자는 절대 사용 금지.
- 제목이나 구분이 필요할 때는 반드시 대괄호([제목])를 사용하고, 절차는 1), 2), 3) 숫자로 시작하여 문단으로 나누세요.

예시 형식:
[준비물]
면 1인분, 소스, 물, 올리브유

[조리법]
1) 팬에 올리브유를 두릅니다.
2) 물과 소스를 넣습니다.
3) 면을 넣고 끓입니다.

[내 사물함 기준] (인벤토리 활용 가능할 때만 작성)
(내용)

[스키마]
intent: faq|recommendation|plan|summary|search|calculation|freeform
user_answer: 위 형식 준수
answer_summary: 한줄요약
tags: 2~5개 키워드 배열`;

/**
 * 유저별 Rate Limit 검사 (Firestore 기반)
 * - 분당 MAX_REQUESTS_PER_MINUTE 초과 시 차단
 * - 일당 MAX_REQUESTS_PER_DAY 초과 시 차단
 */
async function checkRateLimit(uid: string): Promise<void> {
  const now = Date.now();
  const todayKey = new Date().toISOString().slice(0, 10); // "2026-05-22"
  const rateLimitRef = db.collection('rateLimits').doc(uid);

  await db.runTransaction(async (tx) => {
    const doc = await tx.get(rateLimitRef);
    const data = doc.exists ? doc.data()! : {};

    // ── 분당 제한 체크 ──
    const recentTimestamps: number[] = (data.timestamps || []).filter(
      (t: number) => now - t < RATE_LIMIT_WINDOW_MS
    );
    if (recentTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
      throw new HttpsError(
        "resource-exhausted",
        `요청이 너무 빠릅니다. 1분에 최대 ${MAX_REQUESTS_PER_MINUTE}회만 질문할 수 있습니다. 잠시 후 다시 시도해주세요.`
      );
    }

    // ── 일일 제한 체크 ──
    const dailyCount: number = data.dailyDate === todayKey ? (data.dailyCount || 0) : 0;
    if (dailyCount >= MAX_REQUESTS_PER_DAY) {
      throw new HttpsError(
        "resource-exhausted",
        `오늘 하루 질문 한도(${MAX_REQUESTS_PER_DAY}회)에 도달했습니다. 내일 다시 이용해주세요.`
      );
    }

    // ── 카운터 업데이트 ──
    tx.set(rateLimitRef, {
      timestamps: [...recentTimestamps, now],
      dailyDate: todayKey,
      dailyCount: dailyCount + 1,
      lastRequest: now,
    });
  });
}

export const generateAnswer = onCall({ cors: true, region: "asia-northeast3" }, async (request) => {
  // Authentication check (Security Fix)
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "로그인이 필요합니다. 비정상적인 접근입니다.");
  }

  const uid = request.auth.uid;

  // ── Rate Limit 검사 ──
  await checkRateLimit(uid);

  const data = request.data;
  const question = data.question;
  const inventory = data.inventory || [];
  const history = data.history || [];
  const image = data.image; // Expecting base64 string "data:image/jpeg;base64,..."

  if (!question) {
    throw new HttpsError("invalid-argument", "질문이 비어있습니다.");
  }

  if (!ai) {
    logger.error("GEMINI_API_KEY is missing in backend environment variables.");
    throw new HttpsError("internal", "서버 설정 오류: API 키가 누락되었습니다.");
  }

  const historyText = history
    .slice(-2)
    .map((h: any) => `${h.role === 'user' ? 'U' : 'A'}: ${h.content}`)
    .join('\n');

  const inventoryText = inventory.length > 0
    ? `inv: ${inventory.map((i: any) => `${i.name}(${i.category})`).join(',')}`
    : '';

  const parts: string[] = [];
  if (historyText) parts.push(`[맥락]\n${historyText}`);
  if (inventoryText) parts.push(`[인벤토리]\n${inventoryText}`);
  parts.push(`[질문] "${question}"`);
  if (image) parts.push(`[이미지 첨부됨]`);
  parts.push(`JSON으로 답변하세요.`);

  const prompt = parts.join('\n\n');

  try {
    const contentsParts: any[] = [prompt];
    if (image) {
      // Parse "data:image/jpeg;base64,..."
      const commaIndex = image.indexOf(',');
      if (commaIndex !== -1) {
        const mimeType = image.substring(image.indexOf(':') + 1, image.indexOf(';'));
        const base64Data = image.substring(commaIndex + 1);
        contentsParts.push({
          inlineData: { data: base64Data, mimeType }
        });
      }
    }

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: contentsParts,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              enum: ['faq', 'recommendation', 'plan', 'summary', 'search', 'calculation', 'freeform']
            },
            user_answer: { type: Type.STRING },
            answer_summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['intent', 'user_answer', 'answer_summary', 'tags']
        },
      },
    });

    const text = response.text || "{}";
    const cleanJson = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    // Rate limit 에러는 그대로 throw (HttpsError)
    if (error instanceof HttpsError) throw error;

    logger.error("Gemini API Error:", error);
    const isQuotaError = error?.message?.includes("429") || error?.status === "RESOURCE_EXHAUSTED";

    return {
      intent: 'freeform',
      user_answer: isQuotaError
        ? '잠시 후 다시 시도해주세요. 단기간에 너무 많은 요청이 발생했거나 일일 무료 한도가 소진되었습니다.'
        : '죄송합니다. 서버에서 답변 생성 중 문제가 발생했습니다.',
      answer_summary: '서비스 오류',
      tags: ['오류']
    };
  }
});
