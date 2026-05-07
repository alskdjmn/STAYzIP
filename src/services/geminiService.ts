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

    return {
      intent: 'freeform',
      normalized_query: question,
      user_answer: '서버에서 응답을 처리하는 중 문제가 발생했습니다.',
      answer_summary: '서비스 오류',
      tags: ['오류'],
      reusable: false,
      confidence: 0
    };
  }
};
