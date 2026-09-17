/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HomeAssistAnswer } from '../types';
import { Bookmark as BookmarkIcon, Tag } from 'lucide-react';
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

  const renderBlogStyle = (rawText: string) => {
    if (!rawText) return <p className="text-[17px] font-bold text-gray-800 leading-loose">답변을 생성할 수 없습니다.</p>;

    // AI가 문자 그대로의 '\n' 또는 '/n' 기호를 출력하는 경우 실제 줄바꿈으로 치환
    const text = rawText.replace(/\\n/g, '\n').replace(/\/n/g, '\n');

    let beforeText = '';
    let sections: { header: string; content: string }[] = [];
    let afterText = '';

    // 1. 테이블 파싱 (기존 카테고리/히스토리 데이터)
    const tableStartIndex = text.indexOf('|');
    if (tableStartIndex !== -1 && text.includes('|---|')) {
      beforeText = text.substring(0, tableStartIndex).trim();
      let remaining = text.substring(tableStartIndex);
      const lastPipeIndex = remaining.lastIndexOf('|');
      
      let tableText = remaining;
      if (lastPipeIndex !== -1) {
        tableText = remaining.substring(0, lastPipeIndex + 1);
        afterText = remaining.substring(lastPipeIndex + 1).trim();
      }

      let cleaned = tableText.trim();
      if (cleaned.startsWith('|')) cleaned = cleaned.substring(1);
      if (cleaned.endsWith('|')) cleaned = cleaned.substring(0, cleaned.length - 1);
      
      const rowsRaw = cleaned.split(/\|\s*\n\s*\|/);
      if (rowsRaw.length >= 3) {
        const headers = rowsRaw[0].split('|').map(s => s.trim().replace(/\|$/, '').trim());
        const dataRows = rowsRaw.slice(2).map(rowStr => rowStr.split('|').map(s => s.trim().replace(/\|$/, '').trim()));

        // 컬럼별로 데이터 합치기 (조리법 1, 2, 3이 각기 다른 행에 있어도 하나의 섹션으로 합침)
        sections = headers.map((header, colIdx) => {
          const contents = dataRows.map(row => row[colIdx]).filter(Boolean);
          return {
            header,
            content: contents.join('\n')
          };
        });
      }
    } 
    // 2. 대괄호 [제목] 파싱 (AI 최신 포맷)
    else if (text.includes('[') && text.includes(']')) {
      const parts = text.split(/\[(.*?)\]/);
      if (parts.length > 2) {
        beforeText = parts[0].trim();
        for (let i = 1; i < parts.length; i += 2) {
          if (parts[i].trim()) {
            sections.push({
              header: parts[i].trim(),
              content: (parts[i + 1] ? parts[i + 1].trim() : '').replace(/\|/g, '')
            });
          }
        }
      }
    }

    // 파싱된 섹션이 있다면 렌더링
    if (sections.length > 0) {
      return (
        <div className="space-y-6 w-full">
          {beforeText && <div className="text-[17px] font-bold text-gray-800 leading-[1.8] whitespace-pre-wrap">{beforeText}</div>}
          
          <div className="space-y-6 w-full">
            {sections.map((sec, idx) => {
              // 사물함이나 주의사항 등은 다른 스타일
              if (sec.header.includes('사물함') || sec.header.includes('주의')) {
                return (
                  <div key={idx} className="p-4 md:p-5 bg-blue-50 rounded-2xl border border-blue-100 w-full mb-8 last:mb-0">
                    <h3 className="text-sm font-black text-blue-800 mb-2">{sec.header}</h3>
                    <div className="text-[17px] text-gray-800 font-bold leading-[1.8] whitespace-pre-wrap">{sec.content}</div>
                  </div>
                );
              }

              // 재료 따로, 조리법 따로 완전히 독립된 카드로 분리
              let formattedContent = sec.content
                .replace(/(\d+[\)\.])\s/g, '\n$1 ')
                .replace(/<br>/gi, '\n')
                .replace(/\*\*/g, '')
                .trim();
              
              return (
                <div key={idx} className="w-full mb-8 last:mb-0">
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 flex-shrink-0" />
                    {sec.header}
                  </h3>
                  <div className="text-[16px] md:text-lg text-gray-800 leading-[1.8] font-medium whitespace-pre-wrap w-full">
                    {formattedContent}
                  </div>
                </div>
              );
            })}
          </div>

          {afterText && (
            <div className="mt-6 bg-blue-50 p-5 rounded-2xl border border-blue-100">
              <div className="text-[17px] font-bold text-gray-800 leading-[1.8] whitespace-pre-wrap">{afterText}</div>
            </div>
          )}
        </div>
      );
    }

    // 3. 파싱 실패 시 일반 텍스트 — 번호 항목을 조리법 스타일 카드로 분리
    const rawClean = text.replace(/\|/g, '').trim();

    // 번호 항목 분리: "1)" 또는 "1." 패턴 기준으로 split
    const splitItems = rawClean.split(/(?=\d+[)\.]\s)/).filter(s => s.trim());

    // 첫 번째가 번호로 시작하지 않으면 인트로 텍스트
    const firstIsNumbered = /^\d+[)\.]\s/.test(splitItems[0]?.trim() ?? '');
    const introText = !firstIsNumbered ? splitItems[0] : null;
    const numberedItems = firstIsNumbered ? splitItems : splitItems.slice(1);

    if (numberedItems.length === 0) {
      return (
        <div className="text-[15px] text-gray-700 font-medium leading-[1.9] whitespace-pre-wrap w-full">
          {rawClean}
        </div>
      );
    }

    return (
      <div className="space-y-3 w-full">
        {introText && (
          <p className="text-[14px] text-gray-500 font-medium leading-[1.8] mb-1">
            {introText.trim()}
          </p>
        )}
        {numberedItems.map((item, i) => {
          const match = item.trim().match(/^(\d+)[)\.]\s*(.*)/s);
          if (!match) return null;
          const num = match[1];
          const body = match[2].trim();
          const colonIdx = body.indexOf(':');
          const hasTitle = colonIdx > 0 && colonIdx < 20;
          const title = hasTitle ? body.slice(0, colonIdx).trim() : null;
          const content = hasTitle ? body.slice(colonIdx + 1).trim() : body;
          return (
            <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex gap-3 items-start">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 text-white text-xs font-black flex items-center justify-center mt-0.5">
                {num}
              </span>
              <div className="flex-1 min-w-0">
                {title && (
                  <p className="text-[14px] font-black text-blue-700 mb-1">{title}</p>
                )}
                <p className="text-[14px] text-gray-700 font-medium leading-[1.8]">{content}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        {/* Header with Intent & Summary and Bookmark */}
        <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap items-center gap-2 pr-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">
                {getIntentLabel(answer?.intent || 'freeform')}
              </span>
            </div>

            {/* Bookmark Toggle */}
            {onToggleBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark();
                }}
                className={`relative flex-shrink-0 px-3 py-2 rounded-xl transition-all z-20 flex items-center space-x-1 ${
                  isBookmarked 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 border border-gray-200'
                } ${currentStep === 'result_bookmark' ? 'ring-4 ring-blue-500 ring-offset-2 animate-bounce' : ''}`}
              >
                <BookmarkIcon size={14} fill={isBookmarked ? "currentColor" : "none"} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isBookmarked ? '저장됨' : '저장'}
                </span>
              </button>
            )}
          </div>
          
          <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
            {answer?.answer_summary || '답변'}
          </h1>
        </div>

        {/* 2. Main Answer */}
        <div className="p-4 md:p-6 space-y-6">
          <div className="prose prose-blue max-w-none w-full">
            <div className="w-full">
              {renderBlogStyle(answer?.user_answer || '')}
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


      </div>
    </motion.div>
  );
};
