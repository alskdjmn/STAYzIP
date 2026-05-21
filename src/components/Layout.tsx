/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Search, HelpCircle, User, Menu, FileText, MessageSquare } from 'lucide-react';
import { useTutorial } from '../contexts/TutorialContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onToggleUtility: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate, onToggleUtility }) => {
  const { currentStep } = useTutorial();
  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'category', label: '카테고리', icon: Search },
    { id: 'zip', label: 'ZIP', icon: FileText },
    { id: 'mypage', label: '마이페이지', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 max-w-lg mx-auto shadow-2xl relative overflow-x-hidden border-x border-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between w-full">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <img src="/logo.png" alt="STAYZIP Logo" className="w-8 h-8 rounded-lg object-cover" />
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
      <main className="flex-1 w-full pb-24 px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-lg mx-auto bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center space-y-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'fill-blue-50' : ''}`} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer is removed to maintain strict mobile aspect ratio */}
    </div>
  );
};
