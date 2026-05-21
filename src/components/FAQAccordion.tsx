/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FAQItem } from '../types';
import { ChevronDown, ChevronUp, Tag, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQAccordionProps {
  items: FAQItem[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

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
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => toggle(item.id)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                {getIntentLabel(item.answer.intent)}
              </span>
              <span className="font-bold text-gray-800 text-lg pr-4">{item.question}</span>
            </div>
            {openId === item.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>
          <AnimatePresence>
            {openId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-5 pb-5 border-t border-gray-50"
              >
                <div className="pt-6 space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <ShieldCheck size={16} className="text-blue-600" />
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">답변</span>
                    </div>
                    <p className="text-gray-900 font-bold leading-relaxed whitespace-pre-wrap">
                      {item.answer.user_answer}
                    </p>
                  </div>

                  {item.answer.tags && item.answer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.answer.tags.map((tag, i) => (
                        <span key={i} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-lg">
                          <Tag size={10} />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
