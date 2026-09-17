/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CATEGORIES, RULES } from '../data/mockData';
import { CategoryCard } from '../components/CategoryCard';
import { RecentQuestionsList } from '../components/RecentQuestionsList';
import { CategoryArticleView } from '../components/CategoryArticleView';
import { HomeAssistRule } from '../types';
import { SearchInput } from '../components/SearchInput';
import { useTutorial } from '../contexts/TutorialContext';
import { Search, ChevronRight, FileText, ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  onSelectRule?: (rule: HomeAssistRule) => void;
  initialCategoryId?: string | null;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ onSelectRule, initialCategoryId }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<HomeAssistRule | null>(null);
  const { currentStep, nextStep } = useTutorial();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const articleId = params.get('article');
      const catId = params.get('id');

      if (articleId) {
        const article = RULES.find(r => r.id === articleId);
        setSelectedArticle(article || null);
      } else {
        setSelectedArticle(null);
      }

      if (catId) {
        setSelectedCategoryId(catId);
      } else if (!initialCategoryId) {
        setSelectedCategoryId(null);
      }
    };

    handleHashChange(); // Parse on mount

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [initialCategoryId]);

  const handleSelectCategory = (id: string) => {
    const newId = selectedCategoryId === id ? null : id;
    if (newId) {
      window.location.hash = `category?id=${newId}`;
      if (currentStep === 'category_tab') nextStep();
    } else {
      window.location.hash = `category`;
    }
  };

  const handleSelectArticle = (rule: HomeAssistRule) => {
    window.location.hash = `category?id=${selectedCategoryId}&article=${rule.id}`;
    if (currentStep === 'category_article') nextStep();
  };

  const filteredRules = RULES.filter(rule => {
    // 카테고리가 선택되지 않았을 때는 아무 항목도 표시하지 않음
    if (!selectedCategoryId) return false;
    
    const matchesCategory = rule.category === selectedCategoryId;
    const matchesSearch = rule.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rule.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (selectedArticle) {
    return <CategoryArticleView article={selectedArticle} onBack={() => window.history.back()} />;
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">카테고리별 질문</h1>
        <p className="text-gray-500 text-lg">생활 분야별로 궁금한 점을 찾아보세요.</p>
      </div>

      <div className={`relative grid grid-cols-2 md:grid-cols-3 gap-4 ${currentStep === 'category_tab' ? 'ring-4 ring-blue-500 ring-offset-4 rounded-3xl animate-gentle-bounce z-50 p-2 bg-white' : ''}`}>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className={selectedCategoryId === cat.id ? 'ring-2 ring-blue-500 rounded-2xl' : ''}>
            <CategoryCard 
              category={cat} 
              onClick={handleSelectCategory} 
            />
          </div>
        ))}
      </div>

      <div className="pt-12 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <h2 className="text-2xl font-black text-gray-900">
            {selectedCategoryId ? CATEGORIES.find(c => c.id === selectedCategoryId)?.name : ''}
          </h2>
          <div className="w-full md:w-64">
            {selectedCategoryId && (
              <SearchInput 
                onSearch={(query) => setSearchQuery(query)}
                placeholder="검색..." 
                initialValue={searchQuery}
              />
            )}
          </div>
        </div>

        {!selectedCategoryId ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👆</span>
            </div>
            <p className="text-gray-400 font-bold text-lg">궁금한 카테고리를 먼저 선택해주세요.</p>
          </div>
        ) : filteredRules.length > 0 ? (
          <div className={`relative ${currentStep === 'category_article' ? 'ring-4 ring-blue-500 ring-offset-4 rounded-3xl animate-gentle-bounce z-50 p-2 bg-white' : ''}`}>
            <RecentQuestionsList 
              questions={filteredRules} 
              onSelect={handleSelectArticle} 
            />
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
