/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, FAQItem, HomeAssistRule } from '../types';
import { CATEGORY_FAQS } from './categoryFaqs';

export const CATEGORIES: Category[] = [
  { id: 'cooking', name: '조리/주방', icon: 'Utensils', description: '안전한 요리와 주방 관리' },
  { id: 'cleaning', name: '청소/위생', icon: 'Sparkles', description: '깨끗하고 건강한 생활 공간' },
  { id: 'laundry', name: '세탁/의류관리', icon: 'Shirt', description: '옷감 손상 없는 세탁법' },
  { id: 'safety', name: '안전/주의', icon: 'ShieldAlert', description: '사고 예방을 위한 필수 지식' },
  { id: 'food', name: '음식 보관', icon: 'Refrigerator', description: '신선함을 오래 유지하는 법' },
  { id: 'pests', name: '해충/주거 문제', icon: 'Bug', description: '쾌적한 주거 환경 만들기' },
];

export const RULES: HomeAssistRule[] = CATEGORY_FAQS.map(faq => ({
  ...faq,
  keywords: faq.answer.tags || []
}));

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'cooking',
    question: '에어프라이어 종이호일 사용 시 주의할 점은?',
    answer: {
      intent: 'faq',
      normalized_query: '에어프라이어 종이호일 주의사항',
      user_answer: '종이호일이 열선에 직접 닿으면 화재가 발생할 수 있으므로, 반드시 음식물로 완전히 눌러서 고정해야 합니다. 바닥면만 가리는 적당한 크기를 사용하고, 가벼운 음식물만 올릴 때는 특히 주의하세요. 실리콘 용기를 사용하면 더 안전하게 조리할 수 있습니다.',
      answer_summary: '종이호일이 열선에 닿지 않도록 음식물로 잘 고정하여 사용해야 합니다.',
      tags: ['에어프라이어', '종이호일', '화재주의', '주방꿀팁'],
      reusable: true,
      confidence: 1.0
    }
  },
  ...CATEGORY_FAQS
];

export const QUICK_QUESTIONS = [
  '원팬 토마토 파스타 초간단 레시피',
  '바닥 끈적임 제거법',
  '세탁기 냄새 제거법',
  '전자레인지에 넣으면 안되는 그릇들',
  '벌레 유입 차단 방법'
];
