/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, FAQItem, HomeAssistRule } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'cooking', name: '조리/주방', icon: 'Utensils', description: '안전한 요리와 주방 관리' },
  { id: 'cleaning', name: '청소/위생', icon: 'Sparkles', description: '깨끗하고 건강한 생활 공간' },
  { id: 'laundry', name: '세탁/의류관리', icon: 'Shirt', description: '옷감 손상 없는 세탁법' },
  { id: 'safety', name: '안전/주의', icon: 'ShieldAlert', description: '사고 예방을 위한 필수 지식' },
  { id: 'food', name: '음식 보관', icon: 'Refrigerator', description: '신선함을 오래 유지하는 법' },
  { id: 'pests', name: '해충/주거 문제', icon: 'Bug', description: '쾌적한 주거 환경 만들기' },
];

export const RULES: HomeAssistRule[] = [
  {
    id: 'microwave-metal',
    keywords: ['전자레인지', '금속', '안전'],
    question: '전자레인지에 금속 그릇을 넣어도 될까?',
    category: 'cooking',
    answer: {
      intent: 'faq',
      normalized_query: '전자레인지 금속 용기 사용 가능 여부',
      user_answer: '전자레인지에 금속 그릇을 넣는 것은 절대 금지입니다. 금속은 마이크로파를 반사하여 스파크를 일으키고, 화재나 기기 고장의 원인이 됩니다. 보유하신 도자기나 내열 유리 용기를 사용하세요. 전용 용기가 없다면 종이컵이나 전자레인지용 종이 접시를 활용할 수 있습니다.',
      answer_summary: '전자레인지 금속 용기 사용은 화재 위험으로 절대 금지입니다.',
      tags: ['전자레인지', '금속', '화재예방', '주방안전'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'laundry-dosage',
    keywords: ['빨래', '세제', '적정량'],
    question: '빨래 세제 적정량은 얼마야?',
    category: 'laundry',
    answer: {
      intent: 'recommendation',
      normalized_query: '세탁 세제 적정 사용량',
      user_answer: '세탁물 5kg 기준 액체세제 약 30ml(밥숟가락 2스푼 정도)가 적당합니다. 일반적인 1인 가구 세탁량(3~5kg) 기준으로는 세제 뚜껑의 1/3 정도가 적정량입니다. 세제를 너무 많이 쓰면 피부 트러블을 유발하거나 세탁기 내부에 찌꺼기가 남을 수 있으니 주의하세요.',
      answer_summary: '세탁물 5kg당 액체세제 30ml(뚜껑 1/3) 사용을 권장합니다.',
      tags: ['세탁', '세제량', '생활꿀팁', '의류관리'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'towel-smell',
    keywords: ['수건', '냄새', '제거'],
    question: '수건 쉰내 제거 방법?',
    category: 'laundry',
    answer: {
      intent: 'recommendation',
      normalized_query: '수건 쉰내 제거 방법',
      user_answer: '수건의 쉰내를 제거하려면 마지막 헹굼 단계에서 식초 한 컵(약 180ml)을 넣거나 베이킹소다를 섞은 물에 삶아보세요. 세탁 후에는 즉시 건조기나 통풍이 잘 되는 곳에서 바짝 말리는 것이 중요합니다. 섬유유연제는 수건의 흡수력을 떨어뜨리고 냄새의 원인이 될 수 있으니 피하는 것이 좋습니다.',
      answer_summary: '헹굼 시 식초 사용 및 고온 건조로 수건 냄새를 제거할 수 있습니다.',
      tags: ['수건냄새', '식초활용', '세탁팁', '살균'],
      reusable: true,
      confidence: 1.0
    }
  }
];

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
  }
];

export const QUICK_QUESTIONS = [
  '전자레인지 금속 그릇',
  '빨래 세제 적정량',
  '수건 쉰내 제거',
  '유리 vs 플라스틱 용기',
  '락스 세제 혼합'
];
