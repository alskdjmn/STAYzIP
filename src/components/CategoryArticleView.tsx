/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HomeAssistRule } from '../types';
import { ArrowLeft, Tag, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useTutorial } from '../contexts/TutorialContext';

interface CategoryArticleViewProps {
  article: HomeAssistRule;
  onBack: () => void;
}

export const CategoryArticleView: React.FC<CategoryArticleViewProps> = ({ article, onBack }) => {
  const { answer } = article;
  const { currentStep, nextStep } = useTutorial();

  // 마크다운 표 형태의 텍스트를 블로그/카드 스타일로 예쁘게 변환하는 파서
  const renderBlogStyle = (text: string) => {
    if (!text.trim().startsWith('|')) {
      return <div className="text-lg text-gray-700 leading-loose whitespace-pre-wrap">{text}</div>;
    }

    let cleaned = text.trim();
    if (cleaned.startsWith('|')) cleaned = cleaned.substring(1);
    if (cleaned.endsWith('|')) cleaned = cleaned.substring(0, cleaned.length - 1);
    
    const rowsRaw = cleaned.split(/\|\s*\n\s*\|/);
    if (rowsRaw.length < 3) return <div className="text-lg text-gray-700 leading-loose whitespace-pre-wrap">{text}</div>;
    
    const headers = rowsRaw[0].split('|').map(s => s.trim());
    const dataRows = rowsRaw.slice(2).map(rowStr => rowStr.split('|').map(s => s.trim()));

    return (
      <div className="space-y-6 mt-8">
        {dataRows.map((row, rowIdx) => (
          <div key={rowIdx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-8">
            {headers.map((header, colIdx) => {
              const content = row[colIdx];
              if (!content) return null;
              
              // 내용이 1. 2. 3. 처럼 숫자 리스트로 되어있는 경우 줄바꿈 처리
              // 추가로 마크다운의 <br>을 줄바꿈으로, **를 빈 문자열로 치환
              const formattedContent = content
                .replace(/(\d+\.)/g, '\n$1')
                .replace(/<br>/gi, '\n')
                .replace(/\*\*/g, '')
                .trim();

              return (
                <div key={colIdx} className="relative">
                  <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-blue-600 border border-blue-100">
                      {colIdx + 1}
                    </span>
                    {header}
                  </h3>
                  <div className="text-lg text-gray-800 leading-loose font-medium whitespace-pre-wrap pl-11">
                    {formattedContent}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto pb-24"
    >
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-400 hover:text-blue-600 transition-colors mb-8 group"
      >
        <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
          <ArrowLeft size={20} />
        </div>
        <span className="font-bold tracking-tight">목록으로 돌아가기</span>
      </button>

      {/* Article Header */}
      <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-sm">
              {article.category === 'cooking' ? '조리/주방' : 
               article.category === 'cleaning' ? '청소/위생' : 
               article.category === 'laundry' ? '세탁/의류' : 
               article.category === 'safety' ? '안전/주의' : 
               article.category === 'food' ? '음식 보관' : '해충/주거'}
            </span>
            <span className="flex items-center space-x-1 text-gray-400 text-xs font-bold">
              <ShieldCheck size={14} />
              <span>검증된 정보</span>
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
            {article.question}
          </h1>
          
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            {answer.answer_summary}
          </p>
        </div>
      </div>

      {/* Article Body */}
      <div className="px-2 md:px-6">
        {renderBlogStyle(answer.user_answer)}
      </div>

      {/* Tags Footer */}
      {answer.tags && answer.tags.length > 0 && (
        <div className="mt-12 px-6 flex flex-wrap gap-2">
          {answer.tags.map((tag, i) => (
            <span key={i} className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-200 text-gray-500 text-sm font-bold rounded-2xl cursor-default">
              <Tag size={14} />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      {currentStep === 'category_article_view' && (
        <div className="mt-12 px-6">
          <button
            onClick={() => nextStep()}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl animate-bounce"
          >
            튜토리얼 완료하기 🎉
          </button>
        </div>
      )}
    </motion.div>
  );
};
