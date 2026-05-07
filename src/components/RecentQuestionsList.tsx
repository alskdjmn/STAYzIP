/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HomeAssistRule } from '../types';
import { RiskBadge } from './Common';
import { ChevronRight } from 'lucide-react';

interface RecentQuestionsListProps {
  questions: HomeAssistRule[];
  onSelect: (rule: HomeAssistRule) => void;
}

export const RecentQuestionsList: React.FC<RecentQuestionsListProps> = ({ questions, onSelect }) => {
  return (
    <div className="space-y-4">
      {questions.map((rule) => (
        <button
          key={rule.id}
          onClick={() => onSelect(rule)}
          className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <div className="flex-1 pr-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {rule.category === 'cooking' ? '조리/주방' : rule.category === 'cleaning' ? '청소/위생' : rule.category === 'laundry' ? '세탁/의류관리' : rule.category === 'safety' ? '안전/주의' : rule.category === 'food' ? '음식 보관' : '해충/주거 문제'}
              </span>
              {rule.answer.intent === '판단형' && rule.answer.riskLevel && (
                <RiskBadge level={rule.answer.riskLevel} />
              )}
            </div>
            <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
              {rule.question}
            </h4>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
        </button>
      ))}
    </div>
  );
};
