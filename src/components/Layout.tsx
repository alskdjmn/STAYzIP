/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Search, HelpCircle, User, Menu, FileText, MessageSquare } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onToggleUtility: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate, onToggleUtility }) => {
  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'category', label: '카테고리', icon: Search },
    { id: 'zip', label: 'ZIP', icon: FileText },
    { id: 'chat', label: '채팅', icon: MessageSquare },
    { id: 'mypage', label: '마이페이지', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Home className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-black text-blue-600 tracking-tight">STAYZIP</span>
        </div>
        <button 
          onClick={onToggleUtility}
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors hidden md:block"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full pb-24 md:pb-12 px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center md:hidden z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'fill-blue-50' : ''}`} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer (Desktop) */}
      <footer className="hidden md:block bg-white border-t border-gray-100 py-12 px-4 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Home className="text-white h-4 w-4" />
            </div>
            <span className="text-lg font-black text-blue-600 tracking-tight">STAYZIP</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 STAYZIP. 1인 가구를 위한 생활 도우미.</p>
        </div>
      </footer>
    </div>
  );
};
