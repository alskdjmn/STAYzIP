/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FAQ_ITEMS, CATEGORIES } from '../data/mockData';
import { FAQAccordion } from '../components/FAQAccordion';

export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredFaqs = activeCategory === 'all' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">자주 묻는 질문</h1>
        <p className="text-gray-500 text-lg">많은 분들이 궁금해하시는 생활 팁을 모았습니다.</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            activeCategory === 'all' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
        >
          전체
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === cat.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        {filteredFaqs.length > 0 ? (
          <FAQAccordion items={filteredFaqs} />
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">해당 카테고리에 등록된 FAQ가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
