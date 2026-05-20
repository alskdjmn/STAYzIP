/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HomeAssistAnswer } from '../types';
import { SectionTitle } from './Common';
import { Info, Lightbulb, Bookmark as BookmarkIcon, Tag, Target, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useTutorial } from '../contexts/TutorialContext';

interface ResultCardProps {
  question: string;
  answer: HomeAssistAnswer;
  onBack: () => void;
  onSearch: (query: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  question, 
  answer, 
  onBack, 
  onSearch,
  isBookmarked = false,
  onToggleBookmark
}) => {
  const { currentStep } = useTutorial();

  const getIntentLabel = (intent: string) => {
    const labels: Record<string, string> = {
      faq: '자주 묻는 질문',
      recommendation: '추천 및 조언',
      plan: '계획 및 일정',
      summary: '내용 요약',
      search: '검색 결과',
      calculation: '계산 결과',
      freeform: '일반 답변'
    };
    return labels[intent] || intent;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        {/* Bookmark Toggle */}
        {onToggleBookmark && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className={`absolute top-6 right-6 p-3 rounded-2xl transition-all z-20 flex items-center space-x-2 ${
              isBookmarked 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            } ${currentStep === 'result_bookmark' ? 'ring-4 ring-blue-500 ring-offset-2 animate-pulse' : ''}`}
          >
            <BookmarkIcon size={20} fill={isBookmarked ? "currentColor" : "none"} />
            <span className="text-xs font-black uppercase tracking-widest">
              {isBookmarked ? '저장됨' : '저장'}
            </span>
          </button>
        )}

        {/* 1. Header with Intent & Summary */}
        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                {getIntentLabel(answer?.intent || 'freeform')}
              </span>
              {(answer?.confidence ?? 0) > 0.8 && (
                <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  <ShieldCheck size={12} />
                  <span>높은 신뢰도</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">
              {answer?.answer_summary || '답변'}
            </h1>
          </div>
        </div>

        {/* 2. Main Answer */}
        <div className="p-8 space-y-8">
          <div className="prose prose-blue max-w-none">
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-xl mt-1">
                <Target size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {answer?.user_answer || '답변을 생성할 수 없습니다.'}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {Array.isArray(answer?.tags) && answer.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
              {answer.tags.map((tag, i) => (
                <span key={i} className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-default">
                  <Tag size={12} />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. Metadata Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <div className="flex items-center space-x-1">
              <Info size={12} />
              <span>신뢰도: {typeof answer?.confidence === 'number' ? (answer.confidence * 100).toFixed(0) : 0}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lightbulb size={12} />
              <span>{answer?.reusable ? '재사용 가능 정보' : '일회성 정보'}</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
            ID: {answer?.normalized_query || 'unknown'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
