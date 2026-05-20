import { FAQItem } from '../types';

export const CATEGORY_FAQS: FAQItem[] = [
  // ==========================================
  // 1. 조리/주방
  // ==========================================
  {
    id: 'faq-cook-1',
    category: 'cooking',
    question: '원팬 토마토 파스타 초간단 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '원팬 토마토 파스타',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 면 1인분, 시판 토마토 소스, 물 2컵, 올리브유, 다진마늘 | 1. 팬에 올리브유, 마늘 볶기\n2. 물, 소스, 면을 한 번에 넣고 끓이기\n3. 10~12분간 국물이 졸아들 때까지 끓이면 완성 |`,
      answer_summary: '프라이팬 하나로 완성하는 원팬 파스타 레시피입니다.',
      tags: ['파스타', '원팬', '초간단레시피'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-2',
    category: 'cooking',
    question: '간장계란밥 초간단 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '간장계란밥',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 밥 1공기, 계란 1~2개, 간장 1스푼, 참기름 1스푼, 통깨 | 1. 프라이팬에 반숙 계란 프라이 만들기\n2. 따뜻한 밥 위에 계란 올리기\n3. 간장, 참기름을 넣고 비벼 먹기 |`,
      answer_summary: '가장 기본적인 자취생 필수 요리, 간장계란밥입니다.',
      tags: ['간장계란밥', '자취요리'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-3',
    category: 'cooking',
    question: '초간단 브리또 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 브리또',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 또띠아 1장, 밥 반공기, 캔참치/닭가슴살, 치즈, 케찹 | 1. 또띠아를 전자레인지에 15초 데우기\n2. 중앙에 밥, 참치, 치즈, 케찹 올리기\n3. 양옆을 접고 돌돌 말아 팬에 살짝 굽기 |`,
      answer_summary: '남은 재료를 활용한 초간단 브리또 레시피입니다.',
      tags: ['브리또', '남은음식활용'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-4',
    category: 'cooking',
    question: '초간단 오므라이스 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 오므라이스',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 밥 1공기, 햄/양파 볶음, 케찹, 계란 2개 | 1. 다진 햄과 양파를 볶다가 밥, 케찹 2스푼 넣고 볶기\n2. 계란을 풀어 넓게 지단 부치기\n3. 볶음밥을 덮어 모양 잡기 |`,
      answer_summary: '간단하게 즐기는 기본 오므라이스 레시피입니다.',
      tags: ['오므라이스', '계란요리'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-5',
    category: 'cooking',
    question: '냉동만두 전골',
    answer: {
      intent: 'faq',
      normalized_query: '냉동만두 전골',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 냉동만두 5개, 알배기배추, 버섯, 사골육수(팩) | 1. 냄비에 배추, 버섯, 만두를 예쁘게 담기\n2. 시판 사골육수를 붓고 끓이기\n3. 취향에 따라 파, 고추, 후추 추가 |`,
      answer_summary: '시판 사골육수와 만두로 만드는 초간단 전골입니다.',
      tags: ['만두전골', '국물요리'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-6',
    category: 'cooking',
    question: '초간단 김치볶음밥 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 김치볶음밥',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 밥 1공기, 신김치, 참치/스팸, 설탕 0.5스푼, 참기름 | 1. 기름을 두르고 다진 김치와 스팸 볶기 (설탕 추가)\n2. 밥을 넣고 골고루 볶아주기\n3. 불을 끄고 참기름을 살짝 둘러 완성 |`,
      answer_summary: '실패 없는 기본 김치볶음밥 레시피입니다.',
      tags: ['김치볶음밥', '볶음밥'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-7',
    category: 'cooking',
    question: '초간단 두부조림 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 두부조림',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 두부 1모, 간장 3, 고춧가루 1, 설탕 1, 다진마늘 0.5 | 1. 두부를 두툼하게 썰어 팬에 노릇하게 굽기\n2. 물 3스푼과 양념장을 섞어 붓기\n3. 약불에서 양념이 배어들게 졸이기 |`,
      answer_summary: '전자레인지나 팬으로 쉽게 만드는 밥도둑 두부조림입니다.',
      tags: ['두부조림', '반찬'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-8',
    category: 'cooking',
    question: '남은 치킨 볶음밥 초간단 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '남은 치킨 볶음밥',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 남은 치킨, 밥 1공기, 굴소스 1스푼, 파, 계란 | 1. 남은 치킨 살을 잘게 찢기\n2. 파기름을 낸 뒤 치킨과 밥, 굴소스를 넣고 볶기\n3. 계란 스크램블을 곁들여 완성 |`,
      answer_summary: '남은 배달 치킨을 활용한 굴소스 치킨마요 볶음밥입니다.',
      tags: ['치킨볶음밥', '남은음식활용'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-9',
    category: 'cooking',
    question: '초간단 비빔국수 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 비빔국수',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 소면, 고추장 1, 간장 1, 식초 1, 설탕 1, 참기름 | 1. 소면을 삶아 찬물에 헹궈 물기 짜기\n2. 양념장(고추장, 간장, 식초, 설탕 1:1:1:1 비율) 만들기\n3. 면과 양념장을 비비고 참기름 마무리 |`,
      answer_summary: '황금비율 양념장으로 만드는 초간단 비빔국수입니다.',
      tags: ['비빔국수', '면요리'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-10',
    category: 'cooking',
    question: '초간단 김치찌개 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 김치찌개',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 신김치, 돼지고기/참치, 다진마늘, 고춧가루, 간장 | 1. 냄비에 참기름을 두르고 고기와 김치 볶기\n2. 물을 붓고 다진마늘, 고춧가루 추가\n3. 15분 이상 푹 끓이고 간장/액젓으로 간 맞추기 |`,
      answer_summary: '기본 재료로 깊은 맛을 내는 김치찌개 레시피입니다.',
      tags: ['김치찌개', '국물요리'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-11',
    category: 'cooking',
    question: '초간단 된장찌개 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 된장찌개',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 시판 된장 2스푼, 애호박, 양파, 두부, 고춧가루 약간 | 1. 쌀뜨물이나 맹물에 된장을 풀고 끓이기\n2. 단단한 채소(애호박, 양파)부터 넣고 끓이기\n3. 마지막에 두부와 파를 넣고 2분 더 끓이기 |`,
      answer_summary: '시판 된장으로 끓이는 기본 된장찌개 레시피입니다.',
      tags: ['된장찌개', '국물요리'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-12',
    category: 'cooking',
    question: '초간단 카레 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 카레 냉동야채',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 고형/가루 카레, 냉동 볶음밥용 야채, 돼지고기(선택) | 1. 냄비에 기름을 두르고 냉동 야채와 고기를 볶기\n2. 물을 붓고 재료가 익을 때까지 끓이기\n3. 불을 끄고 카레를 풀어준 뒤, 약불로 걸쭉하게 졸이기 |`,
      answer_summary: '야채 손질 시간을 줄여주는 냉동 야채 활용 카레 레시피입니다.',
      tags: ['카레', '냉동야채'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-13',
    category: 'cooking',
    question: '초간단 양파볶음 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 양파볶음',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 양파 1개, 간장 1스푼, 올리고당 0.5스푼, 참기름 | 1. 양파를 채 썰어 팬에 기름을 두르고 볶기\n2. 양파가 투명해지면 간장과 올리고당 넣기\n3. 갈색빛이 돌 때까지 볶고 통깨/참기름 마무리 |`,
      answer_summary: '가성비 최고, 달큰한 양파 간장 볶음입니다.',
      tags: ['양파볶음', '반찬'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-14',
    category: 'cooking',
    question: '초간단 토스트 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 토스트',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 식빵 2장, 계란 1개, 슬라이스 치즈, 딸기잼/케찹 | 1. 팬에 버터나 기름을 두르고 식빵 굽기\n2. 계란 프라이를 만들고 식빵 한 쪽에 잼 바르기\n3. 빵 사이에 계란과 치즈를 끼워 완성 |`,
      answer_summary: '바쁜 아침 5분 만에 완성하는 길거리 토스트 스타일입니다.',
      tags: ['토스트', '아침메뉴'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-cook-15',
    category: 'cooking',
    question: '초간단 브라우니 레시피',
    answer: {
      intent: 'faq',
      normalized_query: '초간단 브라우니',
      user_answer: `| 재료 | 조리법 |\n|---|---|\n| 시판 브라우니 믹스, 우유 또는 물 | 1. 믹스 가루에 우유(물)를 정량 넣고 섞기\n2. 전자레인지용 용기에 붓고 평평하게 펴주기\n3. 전자레인지에 3~4분 돌리고 식혀서 꾸덕하게 먹기 |`,
      answer_summary: '오븐 없이 전자레인지로 만드는 초간단 브라우니입니다.',
      tags: ['브라우니', '홈베이킹'],
      reusable: true,
      confidence: 1.0
    }
  },

  // ==========================================
  // 2. 청소 / 위생
  // ==========================================
  {
    id: 'faq-clean-1',
    category: 'cleaning',
    question: '화장실 물 때 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '화장실 물때 제거',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 구연산, 물, 분무기, 스펀지 | 1. 구연산수(물 1L + 구연산 2스푼)를 만들어 물때에 뿌리기\n2. 10분 방치 후 스펀지로 부드럽게 문지르기\n3. 따뜻한 물로 헹구고 마른 수건으로 닦기 |`,
      answer_summary: '구연산수를 활용해 화장실 물때를 지우는 방법입니다.',
      tags: ['청소', '화장실', '물때'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-2',
    category: 'cleaning',
    question: '배수구 냄새 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '배수구 냄새 제거',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 베이킹소다 1컵, 식초 1컵, 뜨거운 물 | 1. 배수구에 베이킹소다를 붓기\n2. 그 위에 식초를 부어 거품 발생시키기\n3. 30분 뒤 펄펄 끓는 물을 부어 씻어내기 |`,
      answer_summary: '베이킹소다와 식초 반응으로 배수구 냄새를 뚫고 제거합니다.',
      tags: ['배수구', '냄새제거'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-3',
    category: 'cleaning',
    question: '변기 세정법',
    answer: {
      intent: 'faq',
      normalized_query: '변기 청소',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 남은 김빠진 콜라 또는 전용 세제 | 1. 자기 전 변기 안쪽에 콜라나 세제를 둥글게 뿌리기\n2. 다음날 아침 변기솔로 가볍게 문지르기\n3. 물을 내려 헹구기 |`,
      answer_summary: '콜라나 세제를 방치하여 힘 안 들이고 변기를 세정하는 법입니다.',
      tags: ['변기청소', '콜라활용'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-4',
    category: 'cleaning',
    question: '싱크대 기름때 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '싱크대 기름때 제거',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 주방세제, 베이킹소다, 따뜻한 물 | 1. 베이킹소다와 주방세제를 1:1로 섞어 페이스트 만들기\n2. 기름때에 바르고 수세미로 문지르기\n3. 따뜻한 물로 헹궈내기 |`,
      answer_summary: '세제와 베이킹소다 혼합물로 기름때를 쉽게 제거합니다.',
      tags: ['싱크대', '기름때'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-5',
    category: 'cleaning',
    question: '창문틀 먼지 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '창틀 먼지 제거',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 굵은소금 또는 젖은 신문지, 나무젓가락 | 1. 창틀에 젖은 신문지를 덮거나 소금을 뿌리기\n2. 소금은 빗자루로 쓸고, 신문지는 밀면서 먼지 흡착하기\n3. 구석은 물티슈를 끼운 나무젓가락으로 닦기 |`,
      answer_summary: '신문지나 굵은소금을 활용해 창틀 먼지를 날리지 않고 청소합니다.',
      tags: ['창틀청소', '먼지제거'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-6',
    category: 'cleaning',
    question: '전자레인지 내부 청소법',
    answer: {
      intent: 'faq',
      normalized_query: '전자레인지 청소',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 물 1컵, 식초 2스푼, 전자레인지용 그릇 | 1. 그릇에 물과 식초를 섞어 넣기\n2. 전자레인지에 3~5분 돌려 수증기 발생시키기\n3. 문을 열지 않고 5분 뜸들인 후, 내부를 행주로 닦기 |`,
      answer_summary: '수증기로 찌든 때를 불려 쉽게 닦아내는 전자레인지 청소법입니다.',
      tags: ['전자레인지', '청소팁'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-7',
    category: 'cleaning',
    question: '거울 김서림 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '거울 김서림 방지',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 린스 또는 샴푸, 마른 수건 | 1. 마른 수건에 린스를 소량 묻히기\n2. 화장실 거울 전체에 얇게 펴 바르며 코팅하기\n3. 샤워 시 김서림이 방지됨 |`,
      answer_summary: '린스의 계면활성제를 이용한 화장실 거울 김서림 방지 코팅법입니다.',
      tags: ['거울', '김서림'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-8',
    category: 'cleaning',
    question: '벽지 곰팡이 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '벽지 곰팡이 제거',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 락스+물(1:1) 또는 전용 곰팡이 제거제, 분무기, 환기 필수 | 1. 창문을 열고 환기 상태 유지하기\n2. 곰팡이에 제거제를 뿌리고 마를 때까지 방치 (문지르지 않음)\n3. 완전히 건조 후 마른 천으로 가볍게 닦기 |`,
      answer_summary: '벽지 손상을 막기 위해 뿌리고 건조시키는 곰팡이 제거법입니다.',
      tags: ['곰팡이', '벽지청소'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-9',
    category: 'cleaning',
    question: '가스레인지 후드 청소법',
    answer: {
      intent: 'faq',
      normalized_query: '가스레인지 후드 청소',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 과탄산소다, 주방세제, 뜨거운 물, 큰 비닐봉지 | 1. 비닐봉지에 후드 필터를 넣기\n2. 과탄산소다 반 컵, 주방세제 약간을 뿌리기\n3. 뜨거운 물을 붓고 비닐을 묶어 30분 불린 후 헹구기 |`,
      answer_summary: '과탄산소다의 끓는 반응을 이용한 기름때 완벽 분해 청소법입니다.',
      tags: ['후드필터', '주방청소'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-10',
    category: 'cleaning',
    question: '바닥 끈적임 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '바닥 끈적임 제거',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 소주(먹다 남은 것) 또는 식초 희석액 | 1. 끈적이는 바닥에 소주나 식초 물을 분무기로 뿌리기\n2. 마른걸레나 물티슈로 닦아내기\n3. 알코올이 기름기를 녹여 뽀송해짐 |`,
      answer_summary: '소주의 알코올 성분으로 여름철 바닥 끈적임을 쉽게 지웁니다.',
      tags: ['바닥청소', '소주활용'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-11',
    category: 'cleaning',
    question: '침대 진드기 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '침대 진드기',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 계피 끓인 물(또는 계피 스프레이), 청소기 | 1. 매트리스에 계피 스프레이를 고루 뿌리기\n2. 2시간 정도 방치하여 진드기를 사멸시킴\n3. 진공청소기로 죽은 진드기와 먼지 흡입하기 |`,
      answer_summary: '계피 향을 활용한 천연 진드기 퇴치법입니다.',
      tags: ['매트리스', '진드기'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-12',
    category: 'cleaning',
    question: '수전 광택 방법',
    answer: {
      intent: 'faq',
      normalized_query: '수전 광택',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 다 쓴 치약 또는 구연산수 | 1. 수전(수도꼭지)에 치약을 묻히기\n2. 안 쓰는 칫솔이나 수세미로 문지르기\n3. 물로 헹구고 마른 천으로 닦아 광내기 |`,
      answer_summary: '치약의 연마 성분으로 수도꼭지 물때를 지우고 광을 냅니다.',
      tags: ['수전', '치약활용'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-13',
    category: 'cleaning',
    question: '냉장고 냄새 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '냉장고 냄새 제거',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 소주, 식빵 테두리, 또는 베이킹소다 | 1. 청소 시 소주를 행주에 묻혀 내부 닦기\n2. 남은 소주 병뚜껑을 열어두거나, 태운 식빵을 넣어두기\n3. 베이킹소다를 종이컵에 담아 비치하기 |`,
      answer_summary: '주변에서 흔히 구하는 재료로 냉장고 탈취제를 대체하는 방법입니다.',
      tags: ['냉장고냄새', '탈취'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-14',
    category: 'cleaning',
    question: '운동화 세탁 방법',
    answer: {
      intent: 'faq',
      normalized_query: '운동화 세탁',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 큰 비닐봉지, 세탁세제, 따뜻한 물 | 1. 비닐봉지에 운동화, 세제 1스푼, 따뜻한 물 넣기\n2. 입구를 묶고 20분간 불리며 흔들어주기\n3. 솔로 가볍게 문지르고 깨끗이 헹궈 말리기 |`,
      answer_summary: '비닐봉지 하나로 끝내는 초간단 운동화 불림 세탁법입니다.',
      tags: ['운동화', '비닐세탁'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-clean-15',
    category: 'cleaning',
    question: '쓰레기통 냄새 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '쓰레기통 냄새',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 락스 약간 또는 커피 찌꺼기 | 1. 쓰레기통 바닥에 커피 찌꺼기나 베이킹소다 깔기\n2. 세척 시 락스 한 방울을 섞은 물로 닦기\n3. 햇볕에 바짝 말려 살균하기 |`,
      answer_summary: '냄새 원인균을 잡고 커피 찌꺼기로 악취를 흡수하는 방법입니다.',
      tags: ['쓰레기통', '악취제거'],
      reusable: true,
      confidence: 1.0
    }
  },

  // ==========================================
  // 3. 세탁 / 의류
  // ==========================================
  {
    id: 'faq-laundry-1',
    category: 'laundry',
    question: '흰 옷 황변 대처법',
    answer: {
      intent: 'faq',
      normalized_query: '흰옷 누런때 황변',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 과탄산소다, 주방세제, 뜨거운 물 | 1. 뜨거운 물에 과탄산소다 반 컵과 주방세제를 풀어 녹이기\n2. 누렇게 변한 흰 옷을 넣고 20~30분 불리기\n3. 가볍게 비벼 빤 뒤 세탁기에 돌리기 |`,
      answer_summary: '과탄산소다 표백 작용으로 땀으로 누렇게 변한 흰 옷을 복원합니다.',
      tags: ['흰옷세탁', '과탄산소다'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-2',
    category: 'laundry',
    question: '옷에 묻은 볼펜 세탁법',
    answer: {
      intent: 'faq',
      normalized_query: '옷에 볼펜 지우기',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 물파스 또는 소독용 에탄올 | 1. 볼펜 묻은 부위 아래에 키친타월 깔기\n2. 물파스로 얼룩 부위를 톡톡 두드려 잉크 녹이기\n3. 번진 잉크를 닦아내고 주방세제로 부분 세탁하기 |`,
      answer_summary: '물파스의 휘발 성분으로 볼펜 잉크를 녹여 지우는 방법입니다.',
      tags: ['볼펜얼룩', '얼룩제거'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-3',
    category: 'laundry',
    question: '세탁기 냄새 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '세탁기 통세척 냄새',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 세탁조 클리너 또는 과탄산소다 | 1. 세탁조에 과탄산소다 2컵 넣기\n2. 온수로 가득 채우고 '통세척' 또는 '불림' 코스 실행\n3. 끝난 후 도어를 활짝 열어 내부 건조하기 |`,
      answer_summary: '세탁조 곰팡이를 제거하고 도어를 열어두어 냄새를 방지합니다.',
      tags: ['세탁기청소', '통세척'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-4',
    category: 'laundry',
    question: '니트 늘어남 대처법',
    answer: {
      intent: 'faq',
      normalized_query: '니트 늘어났을때 복구',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 헤어 린스, 따뜻한 물 | 1. 따뜻한 물에 린스를 소량 풀기\n2. 늘어난 니트를 10분간 담가두기\n3. 물기를 짜지 않고 수건으로 눌러 뺀 후, 모양을 잡아 평지에 뉘어 말리기 |`,
      answer_summary: '린스가 섬유를 유연하게 만들어 늘어난 니트의 모양을 복원합니다.',
      tags: ['니트관리', '의류복원'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-5',
    category: 'laundry',
    question: '청바지 세탁법',
    answer: {
      intent: 'faq',
      normalized_query: '청바지 세탁 물빠짐 방지',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 중성세제(울샴푸), 소금물 | 1. 처음 세탁 시 소금물(물10:소금1)에 30분 담그기 (물빠짐 방지)\n2. 지퍼를 채우고 옷을 뒤집어 찬물로 단독 세탁\n3. 그늘에서 거꾸로 매달아 건조 |`,
      answer_summary: '뒤집기, 찬물세탁, 소금물 활용으로 청바지 변형과 물빠짐을 최소화합니다.',
      tags: ['청바지', '소금세탁'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-6',
    category: 'laundry',
    question: '와이셔츠 목 때 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '와이셔츠 깃 찌든때',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 샴푸 또는 베이킹소다+식초 | 1. 목 찌든 때 부위에 샴푸를 바르고 칫솔로 문지르기\n2. 5분 대기 후 따뜻한 물로 비벼 빨기\n3. 일반 세탁으로 마무리 |`,
      answer_summary: '머릿기름을 지우는 샴푸를 활용해 와이셔츠 목때를 제거합니다.',
      tags: ['와이셔츠', '찌든때'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-7',
    category: 'laundry',
    question: '빨래 덜 마른 냄새 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '빨래 쉰내 덜마른 냄새',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 식초, 다리미/전자레인지 | 1. 세탁기 헹굼 단계에서 식초 소량 넣기\n2. 냄새나는 부위만 다리미 열로 다려 살균하기\n3. 면 소재 소형 의류는 비닐에 넣고 전자레인지 1분 가열 |`,
      answer_summary: '살균과 열건조를 통해 섬유 속 모락셀라균(냄새 원인균)을 죽입니다.',
      tags: ['쉰내', '빨래냄새'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-8',
    category: 'laundry',
    question: '수건 거칠어짐 예방법',
    answer: {
      intent: 'faq',
      normalized_query: '수건 뻣뻣해짐 방지 섬유유연제',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 섬유유연제 금지, 털어서 널기 | 1. 수건 세탁 시 섬유유연제를 쓰지 않기 (흡수력 저하, 잔여물)\n2. 세탁기에서 꺼낸 직후 탁탁 강하게 털어서 결 살리기\n3. 건조기 사용 권장 |`,
      answer_summary: '섬유유연제 사용을 멈추고 털어 너는 것만으로도 수건이 부드러워집니다.',
      tags: ['수건관리', '세탁상식'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-9',
    category: 'laundry',
    question: '옷에 붙은 껌 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '옷 껌 제거',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 얼음 또는 식용유 | 1. 얼음을 비닐에 싸서 껌 위에 올려 딱딱하게 굳히기\n2. 굳은 껌을 떼어내기\n3. 남은 잔여물은 식용유나 마요네즈로 문질러 녹인 후 주방세제로 세탁 |`,
      answer_summary: '온도를 낮춰 껌을 굳게 한 뒤 떼어내는 가장 안전한 방법입니다.',
      tags: ['껌떼기', '얼음활용'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-10',
    category: 'laundry',
    question: '패딩 볼륨 살리는 법',
    answer: {
      intent: 'faq',
      normalized_query: '패딩 숨 살리기',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 빈 페트병, 옷걸이 | 1. 세탁 후 뉘어서 80% 정도 건조하기\n2. 패딩을 평평한 곳에 눕히고 빈 페트병으로 전체를 골고루 두드리기\n3. 공기층이 살아나면 마저 건조하기 |`,
      answer_summary: '페트병으로 충전재를 두드려 공기층(볼륨)을 다시 살려줍니다.',
      tags: ['패딩관리', '겨울옷'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-11',
    category: 'laundry',
    question: '검은 옷 물빠짐 예방법',
    answer: {
      intent: 'faq',
      normalized_query: '검은옷 물빠짐 방지 맥주',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 남은 맥주, 찬물 | 1. 세탁 전 남은 맥주를 섞은 찬물에 옷을 10~20분 담그기\n2. 헹군 뒤 단독 세탁하기\n3. 평소 세탁 시 뒤집어서 찬물 사용하기 |`,
      answer_summary: '맥주의 홉 성분이 색상을 선명하게 하고, 찬물/뒤집기가 물빠짐을 막습니다.',
      tags: ['검은옷', '맥주세탁'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-12',
    category: 'laundry',
    question: '정전기 방지법',
    answer: {
      intent: 'faq',
      normalized_query: '옷 정전기 방지 클립',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 섬유유연제, 옷핀/클립 | 1. 세탁 시 섬유유연제 사용하기\n2. 외출 시 옷단 안쪽에 금속 옷핀이나 클립 끼워두기 (전류 방출)\n3. 건조할 때 분무기로 물 살짝 뿌리기 |`,
      answer_summary: '습도 조절과 금속을 통한 전하 방출로 정전기를 막습니다.',
      tags: ['정전기', '겨울꿀팁'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-13',
    category: 'laundry',
    question: '티 안 줄어들게 세탁하는 방법',
    answer: {
      intent: 'faq',
      normalized_query: '면티 줄어듦 방지 세탁망',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 세탁망, 중성세제 | 1. 세탁망에 옷을 접어서 꽉 차게 넣기\n2. 찬물 코스와 약한 탈수(섬세/울 코스) 사용하기\n3. 건조기 대신 자연 건조(그늘) 하기 |`,
      answer_summary: '수축의 원인인 뜨거운 물과 강한 마찰(건조기)을 피하는 것이 핵심입니다.',
      tags: ['면세탁', '수축방지'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-14',
    category: 'laundry',
    question: '양말 바닥 때 제거법',
    answer: {
      intent: 'faq',
      normalized_query: '흰양말 찌든때',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 과탄산소다, 빈 페트병 | 1. 페트병에 양말과 과탄산소다, 따뜻한 물 넣기\n2. 뚜껑을 닫고 1분간 강하게 흔들기\n3. 30분 불린 후 꺼내어 세탁 |`,
      answer_summary: '페트병의 마찰력과 과탄산소다의 표백 효과를 동시에 활용합니다.',
      tags: ['양말때', '페트병세탁'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-laundry-15',
    category: 'laundry',
    question: '다리미가 없을 때 구겨진 옷 피는 방법',
    answer: {
      intent: 'faq',
      normalized_query: '다리미 없이 다림질',
      user_answer: `| 준비물 | 방법 |\n|---|---|\n| 분무기, 헤어드라이어 | 1. 구겨진 부위에 분무기로 물을 충분히 뿌리기\n2. 옷을 양옆으로 팽팽하게 당기기\n3. 그 상태에서 헤어드라이어로 뜨거운 바람 쐬어주기 |`,
      answer_summary: '수분과 드라이어의 열풍으로 다림질과 유사한 효과를 냅니다.',
      tags: ['다림질', '드라이어활용'],
      reusable: true,
      confidence: 1.0
    }
  },

  // ==========================================
  // 4. 안전 / 주의
  // ==========================================
  {
    id: 'faq-safety-1',
    category: 'safety',
    question: '전자레인지에 넣으면 안되는 그릇들',
    answer: {
      intent: 'faq',
      normalized_query: '전자레인지 금지 그릇',
      user_answer: `| 금지 용기 | 위험성 |\n|---|---|\n| 스테인리스/알루미늄 호일 | 마이크로파 반사로 인한 스파크 및 화재 |\n| 플라스틱 (PP제외), 배달용기 | 고열로 인한 환경호르몬 배출 및 녹아내림 |\n| 금속 장식/테두리 있는 도자기 | 금속 부위 스파크 발생 |\n| 컵라면 용기(스티로폼) | 유해물질 발생 및 녹음 |`,
      answer_summary: '금속과 내열성이 없는 플라스틱은 화재와 환경호르몬 위험이 있습니다.',
      tags: ['전자레인지', '주방안전'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-safety-2',
    category: 'safety',
    question: '전자레인지에 넣으면 안되는 재료',
    answer: {
      intent: 'faq',
      normalized_query: '전자레인지 금지 음식 계란',
      user_answer: `| 금지 음식 | 위험성 |\n|---|---|\n| 껍질째 계란/밤/소시지 | 내부 압력 상승으로 인한 대형 폭발 |\n| 포도 등 표면이 매끄러운 과일 | 불꽃 발생 위험 |\n| 마른 오징어, 아무것도 안 넣은 상태 | 수분이 없어 기기 고장 유발 |\n| 밀봉된 통조림, 파우치 | 압력으로 터질 위험 |`,
      answer_summary: '수분이 없거나 껍질이 갇힌 식재료는 내부 폭발을 일으킬 수 있습니다.',
      tags: ['전자레인지', '폭발주의'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-safety-3',
    category: 'safety',
    question: '겨울철 동파 예방법',
    answer: {
      intent: 'faq',
      normalized_query: '수도관 보일러 동파 예방',
      user_answer: `| 장소 | 예방 및 대처법 |\n|---|---|\n| 수도계량기 | 헌 옷, 뽁뽁이로 감싸 보온 |\n| 수도꼭지 | 영하 5도 이하 시 밤새 온수를 아주 얇게 똑똑 떨어지게 틀어두기 |\n| 보일러 | 외출 시 전원을 끄지 말고 '외출 모드' 유지 |\n| 얼었을 때 대처 | 헤어드라이어 미지근한 바람이나 따뜻한 물수건으로 서서히 녹이기 (끓는 물 금지) |`,
      answer_summary: '물을 조금씩 틀어놓고 보일러 외출 모드를 유지하는 것이 핵심입니다.',
      tags: ['동파예방', '겨울철'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-safety-4',
    category: 'safety',
    question: '전기장판 쓰면 안되는 매트리스 소개',
    answer: {
      intent: 'faq',
      normalized_query: '메모리폼 전기장판 화재',
      user_answer: `| 매트리스 종류 | 전기장판 사용 가능 여부 |\n|---|---|\n| 라텍스 / 메모리폼 | **절대 금지**. 열 축적률이 높아 화재 위험이 높고 소재가 녹아내림 |\n| 스프링 매트리스 | 사용 가능. 단, 두꺼운 이불을 깔고 사용 권장 |\n| 대처법 | 라텍스 위에 온수매트나 전기장판을 써야 한다면 아주 두꺼운 요를 여러 겹 깔아야 함 |`,
      answer_summary: '라텍스와 메모리폼은 열을 축적하여 화재 발생률이 매우 높습니다.',
      tags: ['전기장판', '화재위험', '라텍스'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-safety-5',
    category: 'safety',
    question: '약 폐기법',
    answer: {
      intent: 'faq',
      normalized_query: '남은 약 버리는법 폐기',
      user_answer: `| 약 종류 | 올바른 폐기 방법 |\n|---|---|\n| 알약 | 포장지를 뜯고 알약만 모아 비닐봉지에 밀봉 |\n| 가루약 | 포장지 그대로 모으기 |\n| 시럽/물약 | 한 병에 모두 모으기 |\n| 최종 배출 | 쓰레기통, 하수구에 절대 금지. 모아서 보건소나 약국의 **폐의약품 수거함**에 배출 |`,
      answer_summary: '생태계 교란을 막기 위해 반드시 약국/보건소 전용 수거함에 버려야 합니다.',
      tags: ['약버리기', '폐의약품'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-safety-6',
    category: 'safety',
    question: '락스 청소할 때 주의할 점',
    answer: {
      intent: 'faq',
      normalized_query: '락스 청소 주의사항 산성세제',
      user_answer: `| 주의사항 | 이유 및 대처 |\n|---|---|\n| 찬물 사용 | 뜨거운 물 사용 시 염소 가스(독성)가 빠르게 증발해 호흡기 손상 |\n| 타 세제와 혼합 금지 | 산성 세제, 구연산, 식초 등과 섞으면 치명적인 염소가스 발생 |\n| 충분한 환기 | 창문과 환풍기를 켜고 청소 후에도 1시간 이상 환기 |\n| 희석 비율 엄수 | 원액 그대로 사용 금지. 물에 수백 배 희석하여 사용 |`,
      answer_summary: '락스는 무조건 찬물로 단독 사용해야 하며 환기가 생명입니다.',
      tags: ['락스청소', '염소가스', '안전'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-safety-7',
    category: 'safety',
    question: '주방 도구 구매 시 주의할 점',
    answer: {
      intent: 'faq',
      normalized_query: '스테인리스 연마제 제거',
      user_answer: `| 소재 | 주의 및 관리법 |\n|---|---|\n| 스테인리스 (냄비, 텀블러) | 구매 직후 키친타월에 식용유를 묻혀 까만 찌꺼기(연마제)가 안 나올 때까지 닦아내고 세척 |\n| 무쇠 (코팅 안된 팬) | 세제 사용 금지. 시즈닝(기름칠 후 가열) 필수 |\n| 코팅 프라이팬 | 철수세미 사용 금지. 기스가 나면 유해물질이 나오므로 즉시 교체 |`,
      answer_summary: '새 스테인리스 제품은 발암물질인 연마제 제거 작업(기름 닦기)이 필수입니다.',
      tags: ['연마제제거', '주방도구'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-safety-8',
    category: 'safety',
    question: '누수에 관하여',
    answer: {
      intent: 'faq',
      normalized_query: '누수 전조증상 대처법',
      user_answer: `| 증상 및 대처 | 설명 |\n|---|---|\n| 초기 증상 | 천장/벽지 변색(곰팡이), 장판 밑 축축함, 수도세 비정상적 급증, 보일러 물보충 에러코드 잦음 |\n| 자가 진단 | 집안 모든 수도꼭지를 잠그고 계량기 별침이 돌아가는지 확인. 돌아가면 누수 확정 |\n| 대처법 | 발견 즉시 계량기를 잠그고 사진/영상 증거 수집. 세입자라면 집주인에게 즉각 통보 후 누수 탐지 업체 호출 |`,
      answer_summary: '수도세 급증과 계량기 회전으로 확인 후 즉시 집주인과 소통해야 합니다.',
      tags: ['누수', '수도비', '자취상식'],
      reusable: true,
      confidence: 1.0
    }
  },

  // ==========================================
  // 5. 음식 보관
  // ==========================================
  {
    id: 'faq-food-1',
    category: 'food',
    question: '채소 및 과일 유통기한 및 보관법',
    answer: {
      intent: 'faq',
      normalized_query: '채소 과일 보관법',
      user_answer: `| 종류 | 보관 방법 | 권장 보관기간 |\n|---|---|---|\n| 잎채소(상추 등) | 씻지 않고 키친타월로 감싸 밀폐용기 보관 | 3~5일 |\n| 파류(대파) | 용도별로 썰어서 냉동 보관 (밀폐용기) | 냉장 1주 / 냉동 1개월 이상 |\n| 사과 | 에틸렌 가스가 나오므로 개별 랩 포장하여 냉장 | 3~4주 |\n| 바나나 | 옷걸이에 걸거나 꼭지를 랩으로 감싸 실온 보관 | 3~5일 |`,
      answer_summary: '수분 유지(키친타월)와 에틸렌 가스 차단(개별포장)이 핵심입니다.',
      tags: ['식재료보관', '채소과일'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-food-2',
    category: 'food',
    question: '육류 및 해산물 유통기한 및 보관법',
    answer: {
      intent: 'faq',
      normalized_query: '고기 해산물 냉동 보관법',
      user_answer: `| 종류 | 보관 방법 | 권장 보관기간 |\n|---|---|---|\n| 육류 (돼지, 소) | 표면 기름기를 닦고 1회분씩 소분하여 랩 밀봉 후 냉동 | 냉장 2~3일 / 냉동 2~4개월 |\n| 다진 고기 | 공기와 닿는 면적이 넓어 상하기 쉬우므로 즉시 냉동 | 냉장 1일 / 냉동 1개월 |\n| 생선/해산물 | 내장 제거 후 씻고 소금 뿌려 개별 밀봉 냉동 | 냉장 1~2일 / 냉동 2~3개월 |`,
      answer_summary: '산소 접촉을 최소화(랩 밀착)하여 1회분씩 소분 냉동하는 것이 필수입니다.',
      tags: ['고기보관', '해산물'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-food-3',
    category: 'food',
    question: '빵류 유통기한 및 보관법',
    answer: {
      intent: 'faq',
      normalized_query: '식빵 남은빵 보관법',
      user_answer: `| 종류 | 보관 방법 | 해동 팁 |\n|---|---|---|\n| 식빵/바게트 | 절대 냉장 보관 금지(수분 증발). 지퍼백 밀봉 후 냉동 보관 | 실온 30분 자연해동 또는 토스터기 직행 |\n| 크림/크림치즈 빵 | 구입 즉시 냉장 보관하고 2일 내 섭취 권장 | 가열 금지 |\n| 권장 소비기한 | 냉동 시 약 1개월 내 소비 권장 | - |`,
      answer_summary: '빵은 냉장고에 넣으면 노화가 빨라지므로 무조건 냉동 보관해야 합니다.',
      tags: ['식빵보관', '냉동보관'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-food-4',
    category: 'food',
    question: '약 종류별 유통기한 및 보관법',
    answer: {
      intent: 'faq',
      normalized_query: '처방약 안약 유통기한 보관',
      user_answer: `| 약 종류 | 보관법 | 실질 유통기한 |\n|---|---|---|\n| 처방 조제약 | 직사광선을 피해 서늘한 실온 보관 | 조제일로부터 최대 6개월 |\n| 개봉한 안약 | 오염 방지를 위해 뚜껑을 닫아 서늘한 곳 보관 | 개봉 후 1개월 (이후 폐기) |\n| 연고류 | 뚜껑 꽉 닫아 실온 보관 | 개봉 후 6개월 |\n| 시럽/액상 | 냉장 지시가 없으면 실온 보관 | 개봉 후 1개월 |`,
      answer_summary: '대부분의 약은 서늘한 실온 보관이며, 안약은 개봉 1개월 후 무조건 버려야 합니다.',
      tags: ['약유통기한', '약보관'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-food-5',
    category: 'food',
    question: '유제품 유통기한 및 보관법',
    answer: {
      intent: 'faq',
      normalized_query: '우유 계란 유통기한 확인법',
      user_answer: `| 품목 | 보관법 및 상했는지 확인법 |\n|---|---|\n| 우유 | 냉장 보관. 물에 우유를 한 방울 떨어뜨렸을 때 형태를 유지하며 가라앉으면 정상, 퍼지면 상한 것 |\n| 계란 | 뾰족한 부분이 아래로 향하게 냉장. 소금물에 띄웠을 때 바닥에 누우면 신선, 수면 위로 떠오르면 상한 것 |\n| 치즈 | 공기 차단 밀봉 냉장. 푸른/검은 곰팡이가 피었거나 쉰내가 나면 즉시 폐기 |`,
      answer_summary: '우유는 냉수 테스트, 계란은 소금물 부력 테스트로 신선도를 확인할 수 있습니다.',
      tags: ['계란상했는지', '우유보관'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-food-6',
    category: 'food',
    question: '가공식품 및 냉동식품 유통기한 및 보관법',
    answer: {
      intent: 'faq',
      normalized_query: '냉동식품 통조림 유통기한',
      user_answer: `| 품목 | 보관 방법 | 특징 |\n|---|---|---|\n| 통조림 | 개봉 전 실온 보관. 개봉 후 남은 내용물은 유리/플라스틱 용기에 옮겨 냉장 | 개봉 전 유통기한 3~5년 |\n| 냉동 만두/너겟 | 밀봉 클립이나 지퍼백으로 공기를 빼고 영하 18도 이하 냉동 | 성에가 심하게 꼈다면 수분 증발로 맛이 떨어짐 |\n| 라면 | 습기와 직사광선을 피한 찬장 보관 | 기름 쩐내가 나면 유통기한 만료 |`,
      answer_summary: '남은 통조림은 캔 그대로 보관하면 부식/독성이 생기니 반드시 통을 옮겨야 합니다.',
      tags: ['통조림보관', '냉동식품'],
      reusable: true,
      confidence: 1.0
    }
  },

  // ==========================================
  // 6. 해충 & 주거
  // ==========================================
  {
    id: 'faq-pests-1',
    category: 'pests',
    question: '벌레 유입 차단 방법',
    answer: {
      intent: 'faq',
      normalized_query: '벌레 차단 트랩 방충망',
      user_answer: `| 유입 경로 | 차단 및 예방 방법 |\n|---|---|\n| **창문 / 베란다** | 1. 찢어진 방충망 보수 테이프 부착<br>2. 창틀 물구멍 전용 미세망 스티커 부착<br>3. 창문 틈새 막이 시공 |\n| **하수구 / 배수구** | 1. 화장실 바닥 하수구 트랩 설치<br>2. 싱크대 배수구 덮개 씌우기<br>3. 2주 1회 뜨거운 물이나 베이킹소다+식초 붓기 |\n| **현관문** | 1. 문 틈새 문풍지 발라 밀폐력 높이기<br>2. 도어클로저 조절하여 꽉 닫히게 설정 |\n| **실내 환경** | 1. 택배 박스 즉시 폐기 (바퀴벌레 알 유입 경로)<br>2. 음식물 쓰레기 지퍼백 보관 또는 바로 버리기 |`,
      answer_summary: '물구멍 스티커 부착, 배수구 트랩 설치, 택배 상자 즉시 폐기가 벌레 차단의 핵심 3원칙입니다.',
      tags: ['벌레차단', '하수구트랩', '방충망'],
      reusable: true,
      confidence: 1.0
    }
  },
  {
    id: 'faq-pests-2',
    category: 'pests',
    question: '벌레가 들어왔을 때 대처법',
    answer: {
      intent: 'faq',
      normalized_query: '초파리 바퀴벌레 퇴치법 대처법',
      user_answer: `| 벌레 종류 | 대처법 및 퇴치 요령 |\n|---|---|\n| **초파리** | 1. 식초, 주방세제, 설탕을 1:1:1로 섞은 초파리 트랩 설치<br>2. 과일 껍질은 밀봉하여 냉동 보관 후 배출 |\n| **바퀴벌레** | 1. 눈에 띄면 살충제 분사. 눌러 죽일 경우 알이 퍼질 수 있으니 휴지로 감싸서 처리<br>2. 싱크대 밑, 냉장고 뒤 등 어두운 곳에 겔 타입 독먹이(맥스포스 등) 소량씩 도포 |\n| **모기** | 1. 방충망 물구멍 테이프 점검<br>2. 훈증기 매트 켜기 (취침 1시간 전)<br>3. 선풍기 미풍 틀어두기 (모기가 날아오지 못함) |\n| **초파리 / 파리 (날벌레)** | 1. 배수구에 팔펄 끓는 물 주기적으로 부어 알/유충 사멸<br>2. 주방 찌든 때 및 쓰레기통 세척 |`,
      answer_summary: '초파리는 함정 트랩으로, 바퀴벌레는 독먹이 연쇄살충으로 뿌리 뽑는 것이 효과적입니다.',
      tags: ['바퀴벌레', '초파리트랩', '벌레퇴치'],
      reusable: true,
      confidence: 1.0
    }
  }
];
