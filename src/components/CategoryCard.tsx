/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Category } from '../types';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onClick: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const Icon = (Icons as any)[category.icon] || Icons.HelpCircle;

  return (
    <button
      onClick={() => onClick(category.id)}
      className="w-full h-full flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
        <Icon className="h-7 w-7 text-blue-600" />
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-1">{category.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 leading-tight">{category.description}</p>
    </button>
  );
};
