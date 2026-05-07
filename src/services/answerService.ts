/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HomeAssistAnswer, InventoryItem, ChatMessage } from "../types";
import { RULES, FAQ_ITEMS } from "../data/mockData";
import { generateAnswer } from "./geminiService";

/**
 * Normalizes a string for comparison
 */
const normalize = (str: string) => str.toLowerCase().replace(/\s/g, '');

/**
 * Simple Local Matcher
 */
const findLocalMatch = (question: string): HomeAssistAnswer | null => {
  const query = normalize(question);
  
  // 1. Check RULES
  const ruleMatch = RULES.find(rule => 
    normalize(rule.question).includes(query) || query.includes(normalize(rule.question)) ||
    rule.keywords.some(k => query.includes(normalize(k)))
  );
  if (ruleMatch) return ruleMatch.answer;

  // 2. Check FAQ_ITEMS
  const faqMatch = FAQ_ITEMS.find(faq => 
    normalize(faq.question).includes(query) || query.includes(normalize(faq.question))
  );
  if (faqMatch) return faqMatch.answer;

  return null;
};

/**
 * FINAL PIPELINE
 */
export const getAnswer = async (question: string, inventory: InventoryItem[], history: ChatMessage[], image?: string): Promise<HomeAssistAnswer> => {
  // 1. Try Local Match FIRST (only if there's no image)
  if (!image) {
    const localAnswer = findLocalMatch(question);
    if (localAnswer) {
      console.log(`[Local Match] Question: ${question}`);
      return { ...localAnswer };
    }
  }

  // 2. LLM Fallback
  console.log(`[Gemini Call] Question: ${question}${image ? ' [with Image attached]' : ''}`);
  const aiAnswer = await generateAnswer(question, inventory, history, image);
  
  return aiAnswer;
};
