/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CATEGORIES, RULES } from '../data/mockData';
import { CategoryCard } from '../components/CategoryCard';
import { RecentQuestionsList } from '../components/RecentQuestionsList';
import { HomeAssistRule } from '../types';
import { SearchInput } from '../components/SearchInput';

interface CategoryPageProps {
  onSelectRule: (rule: HomeAssistRule) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ onSelectRule }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = RULES.filter(rule => {
    const matchesCategory = selectedCategoryId ? rule.category === selectedCategoryId : true;
    const matchesSearch = rule.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rule.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">카테고리별 질문</h1>
        <p className="text-gray-500 text-lg">생활 분야별로 궁금한 점을 찾아보세요.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className={selectedCategoryId === cat.id ? 'ring-2 ring-blue-500 rounded-2xl' : ''}>
            <CategoryCard 
              category={cat} 
              onClick={(id) => setSelectedCategoryId(selectedCategoryId === id ? null : id)} 
            />
          </div>
        ))}
      </div>

      <div className="pt-12 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <h2 className="text-2xl font-black text-gray-900">
            {selectedCategoryId ? CATEGORIES.find(c => c.id === selectedCategoryId)?.name : '전체 질문'}
          </h2>
          <div className="w-full md:w-64">
            <SearchInput 
              onSearch={setSearchQuery} 
              placeholder="검색..." 
              initialValue={searchQuery}
            />
          </div>
        </div>

        {filteredRules.length > 0 ? (
          <RecentQuestionsList 
            questions={filteredRules} 
            onSelect={onSelectRule} 
          />
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
