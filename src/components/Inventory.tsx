/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { InventoryItem, InventoryCategory } from '../types';
import { useTutorial } from '../contexts/TutorialContext';

interface InventoryProps {
  items: InventoryItem[];
  onAddItem: (name: string, category: InventoryCategory) => void;
  onRemoveItem: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onAddItem, onRemoveItem }) => {
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategory>('냉장고');
  const { currentStep, nextStep } = useTutorial();

  const categories: InventoryCategory[] = ['냉장고', '청소용품', '기타'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(newItemName.trim(), selectedCategory);
      setNewItemName('');
      if (currentStep === 'zip_inventory') nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="품목 이름을 입력하세요"
            className={`flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${currentStep === 'zip_inventory' ? 'ring-4 ring-blue-500 ring-offset-2 animate-bounce z-50 relative' : ''}`}
          />
          <button
            type="submit"
            className={`relative bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors ${currentStep === 'zip_inventory' ? 'ring-4 ring-blue-500 ring-offset-2 animate-bounce z-50' : ''}`}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex space-x-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </form>

      <div className="space-y-6">
        {categories.map((cat) => {
          const catItems = (items || []).filter((item) => item.category === cat).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
          return (
            <div key={cat} className="space-y-3">
              <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
                <Package className="h-4 w-4 text-blue-600" />
                <span>{cat}</span>
                <span className="text-gray-400 font-bold ml-2">{catItems.length}</span>
              </h3>
              {catItems.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">등록된 품목이 없습니다.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col items-center justify-between bg-white p-2 rounded-lg border border-gray-100 shadow-sm text-center gap-1"
                    >
                      <span className="text-xs font-medium text-gray-700 break-all leading-tight">
                        {item.name}
                        {item.quantity && item.quantity > 1 && (
                          <span className="text-blue-500 font-black"> {item.quantity}개</span>
                        )}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors mt-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
