/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SearchInput } from '../components/SearchInput';
import { HomeAssistRule } from '../types';
import { motion } from 'motion/react';

interface HomePageProps {
  onSearch: (query: string) => void;
  onSelectCategory: (id: string) => void;
  onSelectRule: (rule: HomeAssistRule) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch, onSelectCategory, onSelectRule }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      {/* Hero Section */}
      <section className="text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            흩어진 살림을 <br />
            <span className="text-blue-600">한곳에 ZIP</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto mb-12 font-medium">
            자취 맞춤형 AI, 무엇이든 물어보세요
          </p>
        </motion.div>

        <SearchInput onSearch={onSearch} />
      </section>
    </div>
  );
};
