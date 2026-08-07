/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { HomeAssistAnswer, InventoryItem, ChatMessage } from "../types";

export const generateAnswer = async (
  question: string,
  inventory: InventoryItem[],
  history: ChatMessage[],
  image?: string
): Promise<HomeAssistAnswer> => {
  try {
    const generateAnswerFn = httpsCallable(functions, 'generateAnswer');
    
    const result = await generateAnswerFn({
      question,
      inventory,
      history,
      image
    });

    return result.data as HomeAssistAnswer;
  } catch (error: any) {
    console.error(`Cloud Function Error:`, error);

    // rate limit 에러는 백엔드에서 보낸 메시지를 그대로 표시
    const isRateLimit = error?.code === 'functions/resource-exhausted';
    const userMessage = isRateLimit
      ? (error?.message || '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
      : '서버에서 응답을 처리하는 중 문제가 발생했습니다.';

    return {
      intent: 'freeform',
      normalized_query: question,
      user_answer: userMessage,
      answer_summary: isRateLimit ? '요청 한도 초과' : '서비스 오류',
      tags: [isRateLimit ? '한도초과' : '오류'],
      reusable: false,
      confidence: 0
    };
  }
};
