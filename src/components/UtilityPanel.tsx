import React, { useState } from 'react';
import { X, Package, LayoutGrid, LogOut, User as UserIcon, Bookmark as BookmarkIcon, ChevronRight, Trash2, Zap } from 'lucide-react';
import { Inventory } from './Inventory';
import { CategoryCard } from './CategoryCard';
import { RoomManager } from './RoomManager';
import { QuickAddModal } from './QuickAddModal';
import { CATEGORIES } from '../data/mockData';
import { InventoryItem, InventoryCategory, HomeAssistRule, Bookmark, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { User } from 'firebase/auth';

interface UtilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  userProfile: UserProfile | null;
  inventoryItems: InventoryItem[];
  bookmarks: Bookmark[];
  onAddInventoryItem: (name: string, category: InventoryCategory, quantity?: number) => void;
  onRemoveInventoryItem: (id: string) => void;
  onSelectCategory: (id: string) => void;
  onSelectRule: (rule: HomeAssistRule) => void;
  onSelectBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark?: (bookmark: Bookmark) => void;
}

export const UtilityPanel: React.FC<UtilityPanelProps> = ({
  isOpen,
  onClose,
  user,
  userProfile,
  inventoryItems,
  bookmarks,
  onAddInventoryItem,
  onRemoveInventoryItem,
  onSelectCategory,
  onSelectRule,
  onSelectBookmark,
  onDeleteBookmark,
}) => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onClose();
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">유틸리티 메뉴</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-12">
                {/* User Profile Section */}
                {user && (
                  <section className="bg-gray-50 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center space-x-4">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || ''} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-black text-gray-900 truncate">{user.displayName || '사용자'}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>로그아웃</span>
                    </button>
                  </section>
                )}

                {/* Room Manager Section */}
                {user && (
                  <section>
                    <RoomManager 
                      user={user} 
                      userProfile={userProfile} 
                    />
                  </section>
                )}

                {/* Bookmarks Section */}
                <section>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookmarkIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">저장한 답변</h3>
                  </div>
                  
                  {bookmarks && bookmarks.length > 0 ? (
                    <div className="space-y-3">
                      {bookmarks.map((bookmark) => (
                        <div
                          key={bookmark.id}
                          onClick={() => {
                            onSelectBookmark(bookmark);
                            onClose();
                          }}
                          className="w-full text-left bg-white border border-gray-100 p-4 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-bold text-gray-900 line-clamp-1 flex-1 pr-2">
                              {bookmark.question}
                            </p>
                            <div className="flex items-center space-x-1">
                              {onDeleteBookmark && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteBookmark(bookmark);
                                  }}
                                  className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                  title="삭제"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              {new Date(bookmark.timestamp).toLocaleDateString()}
                            </p>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                              {bookmark.answer.intent}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-3xl text-center">
                      <BookmarkIcon className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-400">저장한 답변이 없습니다</p>
                    </div>
                  )}
                </section>

                {/* Inventory Section */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">나의 서랍장</h3>
                    </div>
                    <button
                      onClick={() => setIsQuickAddOpen(true)}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-sm transition-all border border-blue-100"
                    >
                      <Zap className="h-4 w-4" />
                      <span>빠른 등록</span>
                    </button>
                  </div>
                  <Inventory
                    items={inventoryItems}
                    onAddItem={onAddInventoryItem}
                    onRemoveItem={onRemoveInventoryItem}
                  />
                </section>

                {/* Categories Section */}
                <section>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <LayoutGrid className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">생활 카테고리</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {CATEGORIES.map((cat) => (
                      <CategoryCard
                        key={cat.id}
                        category={cat}
                        onClick={(id) => {
                          onSelectCategory(id);
                          onClose();
                        }}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* QuickAddModal: createPortal로 렌더되므로 z-index 충돌 없음 */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddItem={onAddInventoryItem}
        existingItems={inventoryItems}
      />
    </>
  );
};
