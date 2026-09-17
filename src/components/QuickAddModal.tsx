import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { InventoryCategory, InventoryItem } from '../types';

interface QuickAddItem {
  name: string;
  emoji: string;
}

const QUICK_ADD_DATA: Record<InventoryCategory, QuickAddItem[]> = {
  '냉장고': [
    { name: '김치', emoji: '🥬' },
    { name: '계란', emoji: '🥚' },
    { name: '우유', emoji: '🥛' },
    { name: '두부', emoji: '🧊' },
    { name: '소시지', emoji: '🌭' },
    { name: '치즈', emoji: '🧀' },
    { name: '요거트', emoji: '🥣' },
    { name: '당근', emoji: '🥕' },
    { name: '양파', emoji: '🧅' },
    { name: '대파', emoji: '🌱' },
    { name: '버터', emoji: '🧈' },
    { name: '간장', emoji: '🫗' },
    { name: '고추장', emoji: '🌶️' },
    { name: '된장', emoji: '🫙' },
    { name: '참기름', emoji: '🫒' },
  ],
  '청소용품': [
    { name: '세탁세제', emoji: '🧴' },
    { name: '섬유유연제', emoji: '🧺' },
    { name: '주방세제', emoji: '🫧' },
    { name: '욕실세제', emoji: '🚿' },
    { name: '락스', emoji: '🪣' },
    { name: '청소포', emoji: '🧹' },
    { name: '쓰레기봉투', emoji: '🗑️' },
    { name: '핸드워시', emoji: '🧼' },
  ],
  '기타': [
    { name: '라면', emoji: '🍜' },
    { name: '즉석밥', emoji: '🍚' },
    { name: '통조림', emoji: '🥫' },
    { name: '샴푸', emoji: '🧴' },
    { name: '치약', emoji: '🪥' },
    { name: '화장지', emoji: '🧻' },
    { name: '건전지', emoji: '🔋' },
    { name: '비타민', emoji: '💊' },
  ],
};

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (name: string, category: InventoryCategory) => void;
  existingItems: InventoryItem[];
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onAddItem, existingItems }) => {
  const [activeCategory, setActiveCategory] = useState<InventoryCategory>('냉장고');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const categories: InventoryCategory[] = ['냉장고', '청소용품', '기타'];
  const existingNames = new Set(existingItems.map(i => i.name));

  const toggleItem = (name: string, category: InventoryCategory) => {
    if (existingNames.has(name)) return;
    const key = `${category}__${name}`;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleConfirm = () => {
    selected.forEach(key => {
      const sepIdx = key.indexOf('__');
      const category = key.substring(0, sepIdx) as InventoryCategory;
      const name = key.substring(sepIdx + 2);
      onAddItem(name, category);
    });
    setSelected(new Set());
    onClose();
  };

  const handleClose = () => {
    setSelected(new Set());
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="quick-add-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />

          {/* Bottom Sheet */}
          <motion.div
            key="quick-add-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white rounded-t-3xl z-[210] shadow-2xl flex flex-col"
            style={{ maxHeight: '88vh' }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 flex-shrink-0">
              <div>
                <h3 className="text-xl font-black text-gray-900">빠른 등록</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  아이콘을 터치해 선택 후 한번에 등록하세요
                  {selected.size > 0 && (
                    <span className="ml-1 text-blue-500 font-bold">({selected.size}개 선택됨)</span>
                  )}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex px-5 gap-2 pb-3 flex-shrink-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Item Grid */}
            <div className="overflow-y-auto flex-1 px-5 pb-2">
              <div className="grid grid-cols-4 gap-3 pb-2">
                {QUICK_ADD_DATA[activeCategory].map(item => {
                  const key = `${activeCategory}__${item.name}`;
                  const isSelected = selected.has(key);
                  const isExisting = existingNames.has(item.name);

                  return (
                    <motion.button
                      key={item.name}
                      whileTap={!isExisting ? { scale: 0.85 } : {}}
                      onClick={() => toggleItem(item.name, activeCategory)}
                      disabled={isExisting}
                      className={`relative flex flex-col items-center justify-center py-3 px-1 rounded-2xl border-2 transition-all ${
                        isExisting
                          ? 'bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-50 border-blue-500 shadow-lg shadow-blue-100'
                          : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md'
                      }`}
                    >
                      {(isSelected || isExisting) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center ${
                            isExisting ? 'bg-gray-400' : 'bg-blue-500'
                          }`}
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                      <span className="text-3xl mb-1.5 leading-none">{item.emoji}</span>
                      <span className="text-[10px] font-bold text-gray-700 text-center leading-tight break-keep">
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="px-5 py-4 flex-shrink-0 border-t border-gray-50">
              <motion.button
                whileTap={selected.size > 0 ? { scale: 0.97 } : {}}
                onClick={handleConfirm}
                disabled={selected.size === 0}
                className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
                  selected.size > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selected.size > 0 ? `✓ ${selected.size}개 등록하기` : '아이콘을 선택해주세요'}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
