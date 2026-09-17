/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HomeAssistAnswer, InventoryItem, ChatMessage } from "../types";
import { generateAnswer } from "./geminiService";

/**
 * FINAL PIPELINE — Gemini API를 통해 답변을 생성합니다.
 */
export const getAnswer = async (question: string, inventory: InventoryItem[], history: ChatMessage[], image?: string): Promise<HomeAssistAnswer> => {
  console.log(`[Gemini Call] Question: ${question}${image ? ' [with Image attached]' : ''}`);
  return await generateAnswer(question, inventory, history, image);
};
