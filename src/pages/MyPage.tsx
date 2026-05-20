/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark as BookmarkIcon, LogOut, User as UserIcon, ChevronRight } from 'lucide-react';
import { Bookmark, UserProfile } from '../types';
import { auth } from '../firebase';
import { User } from 'firebase/auth';
import { useTutorial } from '../contexts/TutorialContext';

interface MyPageProps {
  user: User;
  userProfile: UserProfile | null;
  bookmarks: Bookmark[];
  onSelectBookmark: (bookmark: Bookmark) => void;
  onLogout: () => void;
}

export const MyPage: React.FC<MyPageProps> = ({ 
  user, 
  userProfile, 
  bookmarks, 
  onSelectBookmark, 
  onLogout 
}) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const { currentStep, nextStep } = useTutorial();

  return (
    <div className="space-y-12 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">마이페이지</h1>
        <p className="text-gray-500 text-lg">내 정보와 북마크를 확인하세요.</p>
      </div>

      {/* Account Info */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center space-x-4">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-16 h-16 rounded-full shadow-sm" />
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-gray-900 truncate">{user.displayName || '사용자'}</h1>
            <p className="text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-gray-50 border border-gray-200 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>로그아웃</span>
        </button>
      </section>

      {/* Bookmarks */}
      <section className={`${currentStep === 'mypage_bookmark' ? 'ring-4 ring-blue-500 ring-offset-4 rounded-3xl animate-pulse relative z-50 bg-white p-4' : ''}`}>
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookmarkIcon className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">저장한 답변</h3>
        </div>
        
        {bookmarks && bookmarks.length > 0 ? (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => onSelectBookmark(bookmark)}
                className="w-full text-left bg-white border border-gray-100 p-4 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-2 w-full">
                  <p className="text-sm font-bold text-gray-900 line-clamp-2 flex-1 pr-4">
                    {bookmark.question}
                  </p>
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-xs text-gray-400">
                    {new Date(bookmark.timestamp).toLocaleDateString()}
                  </p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                    {bookmark.answer.intent}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-3xl text-center">
            <BookmarkIcon className="h-8 w-8 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-400">저장한 답변이 없습니다</p>
          </div>
        )}

        {currentStep === 'mypage_bookmark' && (
          <button
            onClick={() => nextStep()}
            className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl animate-bounce"
          >
            다음 단계로 👉
          </button>
        )}
      </section>
    </div>
  );
};
