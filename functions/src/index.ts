import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini with the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const DEFAULT_MODEL = "gemini-1.5-flash";

const SYSTEM_INSTRUCTION = `1인가구 생활비서 AI. JSON만 반환. 마크다운·부연설명 금지.

[규칙]
- 이미지: 보이는 것만 설명. 불확실하면 보수적 판단
- 안전(전자레인지/화학물질/가스/식품): 확신 없으면 절대 안전하다 하지 말 것
- 인벤토리 제공 시 1순위 활용. 없으면 언급 금지
- 판단순서: 사진에서 확실한 것 → 인벤토리 → 현실적 대안

[답변 형식 - user_answer]
결론: (짧고 직관적으로)
방법: 1. 2. 3.(선택)
내 사물함 기준: (인벤토리 활용 가능할 때만)

[스키마]
intent: faq|recommendation|plan|summary|search|calculation|freeform
normalized_query: 질문 단순화 텍스트
user_answer: 위 형식 준수
answer_summary: 한줄요약
tags: 2~5개 키워드 배열
reusable: bool
confidence: 0.0~1.0`;

export const generateAnswer = onCall({ cors: true, region: "asia-northeast3" }, async (request) => {
  // Authentication check (optional but recommended)
  // if (!request.auth) {
  //   throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
  // }

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
            normalized_query: { type: Type.STRING },
            user_answer: { type: Type.STRING },
            answer_summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            reusable: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
          },
          required: ['intent', 'normalized_query', 'user_answer', 'answer_summary', 'tags', 'reusable', 'confidence']
        },
      },
    });

    const text = response.text || "{}";
    const cleanJson = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    logger.error("Gemini API Error:", error);
    const isQuotaError = error?.message?.includes("429") || error?.status === "RESOURCE_EXHAUSTED";
    
    return {
      intent: 'freeform',
      normalized_query: question,
      user_answer: isQuotaError
        ? '현재 이용자가 많아 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.'
        : '죄송합니다. 서버에서 답변 생성 중 문제가 발생했습니다.',
      answer_summary: '서비스 오류',
      tags: ['오류'],
      reusable: false,
      confidence: 0
    };
  }
});
