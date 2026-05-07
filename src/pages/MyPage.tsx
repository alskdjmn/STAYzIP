/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RULES } from '../data/mockData';
import { RecentQuestionsList } from '../components/RecentQuestionsList';
import { HomeAssistRule } from '../types';
import { Bookmark, History, Settings } from 'lucide-react';

interface MyPageProps {
  onSelectRule: (rule: HomeAssistRule) => void;
}

export const MyPage: React.FC<MyPageProps> = ({ onSelectRule }) => {
  return (
    <div className="space-y-12">
      <div className="flex items-center space-x-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <span className="text-3xl font-black">S</span>
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">STAYZIP 사용자</h1>
          <p className="text-gray-500 font-medium">자취 1년차 • 서울</p>
        </div>
        <button className="ml-auto p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Settings size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <History className="text-blue-600" size={20} />
            <h2 className="text-xl font-black text-gray-900 tracking-tight">최근 본 질문</h2>
          </div>
          <RecentQuestionsList questions={RULES.slice(0, 2)} onSelect={onSelectRule} />
        </section>

        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Bookmark className="text-blue-600" size={20} />
            <h2 className="text-xl font-black text-gray-900 tracking-tight">북마크한 답변</h2>
          </div>
          <RecentQuestionsList questions={RULES.slice(2, 4)} onSelect={onSelectRule} />
        </section>
      </div>
    </div>
  );
};
