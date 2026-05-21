/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { Home, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Login Error:', error);
      alert(`로그인 오류가 발생했습니다: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-8 border border-gray-100"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Home className="text-white h-8 w-8" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            혼자 사는 삶의 <br />
            <span className="text-blue-600">똑똑한 도우미</span>
          </h1>
          <p className="text-gray-500 font-medium">
            구글로 로그인하고 <br />
            내 사물함 정보를 저장해보세요.
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-700 transition-all shadow-sm group ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-blue-100'}`}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          <span className="group-hover:text-blue-600 transition-colors">
            {isLoading ? '로그인 중...' : '구글로 시작하기'}
          </span>
        </button>
        
        <p className="text-xs text-gray-400">
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </motion.div>
    </div>
  );
};
