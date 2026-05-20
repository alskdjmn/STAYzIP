/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = '안전' | '주의' | '위험';
export type IntentType = 'faq' | 'recommendation' | 'plan' | 'summary' | 'search' | 'calculation' | 'freeform';

export interface HomeAssistAnswer {
  intent: IntentType;
  normalized_query: string;
  user_answer: string;
  answer_summary: string;
  tags: string[];
  reusable: boolean;
  confidence: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  answer?: HomeAssistAnswer;
  timestamp: string;
}

export interface RoomMessage {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhotoURL: string | null;
  createdAt: string;
}

export interface HomeAssistRule {
  id: string;
  keywords: string[];
  question: string;
  answer: HomeAssistAnswer;
  category: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: HomeAssistAnswer;
  category: string;
}

export type CategoryId = 'cooking' | 'cleaning' | 'laundry' | 'safety' | 'food' | 'pests';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export type InventoryCategory = '냉장고' | '청소용품' | '기타';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  addedAt: string;
  addedBy?: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  question: string;
  answer: HomeAssistAnswer;
  timestamp: string;
  category?: string;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  members: string[];
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  roomId?: string | null;
  lastLogin: string;
}
