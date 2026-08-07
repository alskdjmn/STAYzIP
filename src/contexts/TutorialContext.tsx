/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, X } from 'lucide-react';

export type TutorialStep = 
  | 'none'
  | 'start'
  | 'zip_room'
  | 'zip_inventory'
  | 'home_search'
  | 'home_ask'
  | 'result_bookmark'
  | 'result_reset'
  | 'mypage_bookmark'
  | 'read_bookmark'
  | 'category_tab'
  | 'category_article'
  | 'category_article_view'
  | 'finished';

interface TutorialContextType {
  currentStep: TutorialStep;
  nextStep: () => void;
  skipTutorial: () => void;
  startTutorial: () => void;
  isTutorialActive: boolean;
  isTutorialFinished: boolean;
  setTutorialReady: (ready: boolean) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<TutorialStep>('none');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    const hasSeenTutorial = localStorage.getItem('stayzip_tutorial_finished');
    if (!hasSeenTutorial) {
      setCurrentStep('start');
    } else {
      setCurrentStep('none');
    }
  }, [isReady]);

  const skipTutorial = () => {
    localStorage.setItem('stayzip_tutorial_finished', 'true');
    setCurrentStep('none');
    window.location.hash = 'home';
  };

  const startTutorial = () => {
    setCurrentStep('zip_room');
  };

  const nextStep = () => {
    setCurrentStep((prev) => {
      switch (prev) {
        case 'zip_room': return 'zip_inventory';
        case 'zip_inventory': return 'home_search';
        case 'home_search': return 'home_ask';
        case 'home_ask': return 'result_bookmark'; // Will wait for result before showing
        case 'result_bookmark': return 'result_reset';
        case 'result_reset': return 'mypage_bookmark';
        case 'mypage_bookmark': return 'read_bookmark';
        case 'read_bookmark': return 'category_tab';
        case 'category_tab': return 'category_article';
        case 'category_article': return 'category_article_view';
        case 'category_article_view': 
          localStorage.setItem('stayzip_tutorial_finished', 'true');
          return 'finished';
        default: return 'none';
      }
    });
  };

  const isTutorialActive = currentStep !== 'none' && currentStep !== 'start' && currentStep !== 'finished';
  const isTutorialFinished = currentStep === 'finished';

  return (
    <TutorialContext.Provider value={{ 
      currentStep, 
      nextStep, 
      skipTutorial, 
      startTutorial,
      isTutorialActive,
      isTutorialFinished,
      setTutorialReady: setIsReady
    }}>
      {children}
      
      {/* Tutorial Start/Skip Modal */}
      <AnimatePresence>
        {currentStep === 'start' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">환영합니다! 🎉</h2>
              <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                STAYZIP의 주요 기능들을 빠르게 알아보시겠어요? 약 1분 정도 소요됩니다.
              </p>
              
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={startTutorial}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>튜토리얼 시작하기</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={skipTutorial}
                  className="w-full py-3.5 bg-gray-100 text-gray-500 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors"
                >
                  SKIP (건너뛰기)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Global Floating Message Box for Active Tutorial */}
        {isTutorialActive && (
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, y: ['zip_room', 'result_bookmark', 'result_reset'].includes(currentStep) ? 50 : -50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed ${['zip_room', 'result_bookmark', 'result_reset'].includes(currentStep) ? 'bottom-24' : 'top-24'} left-0 right-0 z-[90] flex justify-center px-4 pointer-events-none`}
          >
            <div className="bg-gray-900/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-700 pointer-events-auto">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-blue-400 mb-1 text-sm uppercase tracking-wider">튜토리얼</h3>
                  <p className="text-sm font-medium leading-snug">
                    {currentStep === 'zip_room' && '앱 하단의 ZIP 탭입니다! 여기서 방을 만들거나 코드로 참여하여 룸메이트와 사물함을 공유할 수 있습니다. 방을 먼저 추가하거나 생성해주세요!'}
                    {currentStep === 'zip_inventory' && '하단의 인벤토리 섹션에서는 냉장고, 청소용품 등 가지고 있는 아이템을 카테고리별로 채워 넣을 수 있습니다. "+" 버튼을 눌러보세요.'}
                    {currentStep === 'home_search' && '이제 홈 화면입니다. 카메라 아이콘과 사진 아이콘을 한 번씩 눌러 기능을 확인해보세요.'}
                    {currentStep === 'home_ask' && '예시 질문이 준비되었습니다! 우측의 "질문" 버튼을 눌러보세요.'}
                    {currentStep === 'result_bookmark' && '자취 비서의 답변이 완료되었습니다! 유용한 정보라면 우측 상단의 "저장" 버튼을 눌러 북마크 해보세요.'}
                    {currentStep === 'result_reset' && '다른 질문을 새롭게 시작하고 싶다면 화면 상단의 "대화 리셋" 버튼을 누르세요.'}
                    {currentStep === 'mypage_bookmark' && '마이페이지에서는 방금 전 저장한 북마크된 답변들을 모아볼 수 있습니다! 답변을 하나 클릭해서 열어보세요.'}
                    {currentStep === 'read_bookmark' && '저장했던 답변을 다시 불러왔습니다! 내용을 확인하셨다면 이제 하단의 "카테고리" 탭을 눌러보세요.'}
                    {currentStep === 'category_tab' && '하단의 카테고리 탭입니다! 여기서 다양한 주제의 유용한 정보들을 찾아볼 수 있습니다. 아무 카테고리나 하나 눌러보세요.'}
                    {currentStep === 'category_article' && '해당 카테고리의 답변(아티클) 중 하나를 선택하면 바로 자세한 내용을 볼 수 있습니다! 아무 아티클이나 클릭해보세요.'}
                    {currentStep === 'category_article_view' && '이렇게 전문가 수준의 정보와 AI의 답변을 확인할 수 있습니다! 튜토리얼을 성공적으로 마쳤습니다.'}
                  </p>
                </div>
                <button onClick={skipTutorial} className="text-gray-400 hover:text-white transition-colors ml-2" title="튜토리얼 종료">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isTutorialFinished && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">튜토리얼 완료!</h2>
              <p className="text-gray-600 font-medium mb-6">
                이제 STAYZIP을 자유롭게 사용해보세요.
              </p>
              <button 
                onClick={() => {
                  setCurrentStep('none');
                  window.location.hash = 'home';
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                시작하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TutorialContext.Provider>
  );
};
