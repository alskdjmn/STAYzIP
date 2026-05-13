"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnswer = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const genai_1 = require("@google/genai");
// Initialize Gemini with the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new genai_1.GoogleGenAI({ apiKey }) : null;
const DEFAULT_MODEL = "gemini-2.5-flash";
const SYSTEM_INSTRUCTION = `1인가구 생활비서 AI. JSON만 반환. 마크다운·부연설명 금지.


[규칙]
- 이미지: 보이는 것만 설명. 불확실하면 보수적 판단
- 안전(전자레인지/화학물질/가스/식품): 확신 없으면 절대 안전하다 하지 말 것
- 인벤토리 제공 시 1순위 활용. 없으면 언급 금지
- 판단순서: 사진에서 확실한 것 → 인벤토리 → 현실적 대안

[답변 형식 - user_answer]
- 가독성을 위해 각 항목과 각 방법의 번호 사이에는 반드시 줄바꿈(\n)을 사용하여 문단을 나누세요.
결론: (짧고 직관적으로)

방법: 
1. (내용)
2. (내용)
3. (내용)

내 사물함 기준: (인벤토리 활용 가능할 때만)

[스키마]
intent: faq|recommendation|plan|summary|search|calculation|freeform
normalized_query: 질문 단순화 텍스트
user_answer: 위 형식 준수
answer_summary: 한줄요약
tags: 2~5개 키워드 배열
reusable: bool
confidence: 0.0~1.0`;
exports.generateAnswer = (0, https_1.onCall)({ cors: true, region: "asia-northeast3" }, async (request) => {
    // Authentication check (optional but recommended)
    // if (!request.auth) {
    //   throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
    // }
    var _a;
    const data = request.data;
    const question = data.question;
    const inventory = data.inventory || [];
    const history = data.history || [];
    const image = data.image; // Expecting base64 string "data:image/jpeg;base64,..."
    if (!question) {
        throw new https_1.HttpsError("invalid-argument", "질문이 비어있습니다.");
    }
    if (!ai) {
        logger.error("GEMINI_API_KEY is missing in backend environment variables.");
        throw new https_1.HttpsError("internal", "서버 설정 오류: API 키가 누락되었습니다.");
    }
    const historyText = history
        .slice(-2)
        .map((h) => `${h.role === 'user' ? 'U' : 'A'}: ${h.content}`)
        .join('\n');
    const inventoryText = inventory.length > 0
        ? `inv: ${inventory.map((i) => `${i.name}(${i.category})`).join(',')}`
        : '';
    const parts = [];
    if (historyText)
        parts.push(`[맥락]\n${historyText}`);
    if (inventoryText)
        parts.push(`[인벤토리]\n${inventoryText}`);
    parts.push(`[질문] "${question}"`);
    if (image)
        parts.push(`[이미지 첨부됨]`);
    parts.push(`JSON으로 답변하세요.`);
    const prompt = parts.join('\n\n');
    try {
        const contentsParts = [prompt];
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
                    type: genai_1.Type.OBJECT,
                    properties: {
                        intent: {
                            type: genai_1.Type.STRING,
                            enum: ['faq', 'recommendation', 'plan', 'summary', 'search', 'calculation', 'freeform']
                        },
                        normalized_query: { type: genai_1.Type.STRING },
                        user_answer: { type: genai_1.Type.STRING },
                        answer_summary: { type: genai_1.Type.STRING },
                        tags: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                        reusable: { type: genai_1.Type.BOOLEAN },
                        confidence: { type: genai_1.Type.NUMBER },
                    },
                    required: ['intent', 'normalized_query', 'user_answer', 'answer_summary', 'tags', 'reusable', 'confidence']
                },
            },
        });
        const text = response.text || "{}";
        const cleanJson = text.replace(/```json\n?|```/g, "").trim();
        return JSON.parse(cleanJson);
    }
    catch (error) {
        logger.error("Gemini API Error:", error);
        const isQuotaError = ((_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.includes("429")) || (error === null || error === void 0 ? void 0 : error.status) === "RESOURCE_EXHAUSTED";
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
//# sourceMappingURL=index.js.map