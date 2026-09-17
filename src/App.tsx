/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { MyPage } from './pages/MyPage';
import { ZipPage } from './pages/ZipPage';

import { ResultCard } from './components/ResultCard';
import { HomeAssistRule, HomeAssistAnswer, IntentType, InventoryItem, InventoryCategory, ChatMessage, Bookmark, UserProfile, Room } from './types';
import { RULES } from './data/mockData';
import { getAnswer } from './services/answerService';
import { Loader2, MessageSquare, User as UserIcon, Bot, RotateCcw } from 'lucide-react';
import { UtilityPanel } from './components/UtilityPanel';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, query, where, getDoc } from 'firebase/firestore';
import { LoginScreen } from './components/LoginScreen';
import { SearchInput } from './components/SearchInput';
import { motion, AnimatePresence } from 'motion/react';
import { useTutorial } from './contexts/TutorialContext';

type Page = 'home' | 'category' | 'zip' | 'mypage' | 'result';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const getTabFromHash = () => {
    let hash = window.location.hash.replace('#', '');
    hash = hash.split('?')[0];
    return (['home', 'category', 'zip', 'mypage', 'result'].includes(hash) ? hash : 'home') as Page;
  };

  const [activeTab, setActiveTab] = useState<Page>(getTabFromHash());

  useEffect(() => {
    const handleHashChange = () => setActiveTab(getTabFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<HomeAssistAnswer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUtilityPanelOpen, setIsUtilityPanelOpen] = useState<boolean>(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [targetCategory, setTargetCategory] = useState<string | null>(null);

  const { currentStep, isTutorialActive, nextStep, setTutorialReady } = useTutorial();

  // Tutorial automatic navigation
  useEffect(() => {
    if (currentStep === 'zip_room') {
      window.location.hash = 'zip';
    } else if (currentStep === 'home_search') {
      window.location.hash = 'home';
    } else if (currentStep === 'mypage_bookmark') {
      window.location.hash = 'mypage';
    } else if (currentStep === 'category_tab') {
      window.location.hash = 'category';
    }
  }, [currentStep]);

  // 1. 대화 기록 로드 (Firestore)
  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'users', user.uid, 'data', 'chatHistory')).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
            const rawHistory = data.history || [];
            // 이전 북마크 버그로 인해 user 메시지에 AI 텍스트가 들어간 쓰레기 데이터 필터링
            const fixedHistory = rawHistory.filter((msg: any) => {
              if (msg.role === 'user' && msg.content && (msg.content.includes('[준비물]') || msg.content.length > 150)) {
                return false;
              }
              return true;
            });
            setConversationHistory(fixedHistory);
          } else {
            deleteDoc(docSnap.ref).catch(() => {});
            setConversationHistory([]);
          }
        }
      }).catch(console.error);
    } else {
      setConversationHistory([]);
    }
  }, [user]);

  // 2. 대화 기록 저장 (Firestore)
  useEffect(() => {
    if (user && conversationHistory.length > 0) {
      try {
        const cleanHistory = JSON.parse(JSON.stringify(conversationHistory));
        setDoc(doc(db, 'users', user.uid, 'data', 'chatHistory'), {
          timestamp: Date.now(),
          history: cleanHistory
        }).catch(console.error);
      } catch (e) {
        console.error("Firestore serialization error:", e);
      }
    }
  }, [conversationHistory, user]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false); // 유저 상태가 확인되면 즉시 로딩 해제 (Firestore 쓰기에 블로킹되지 않도록 함)
      
      if (!currentUser) {
        setInventoryItems([]);
        setUserProfile(null);
      } else {
        setTutorialReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // User Profile Listener
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    
    // Ensure document is created if missing
    setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString()
    }, { merge: true }).catch(err => console.error("Firestore user sync failed:", err));

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Inventory Real-time Listener (Depends on userProfile & room)
  useEffect(() => {
    if (!user || (!userProfile && isAuthChecking)) return;

    setInventoryItems([]); // 상태 전환 시 기존 항목 초기화 (깜빡임 방지)

    // Use Room inventory if roomId exists, otherwise use personal inventory
    const inventoryRef = userProfile?.roomId 
      ? collection(db, 'rooms', userProfile.roomId, 'inventory') 
      : collection(db, 'users', user.uid, 'inventory');
      
    const unsubscribe = onSnapshot(inventoryRef, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data() as InventoryItem);
      setInventoryItems(items);
    }, (error) => {
      console.error('Firestore Error (Inventory):', error);
    });

    return () => unsubscribe();
  }, [user, userProfile]);

  // Bookmarks Real-time Listener
  useEffect(() => {
    if (!user) return;

    const bookmarksRef = collection(db, 'users', user.uid, 'bookmarks');
    const unsubscribe = onSnapshot(bookmarksRef, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data() as Bookmark);
      setBookmarks(items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, (error) => {
      console.error('Firestore Error (Bookmarks):', error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddInventoryItem = async (name: string, category: InventoryCategory, quantity: number = 1) => {
    if (!user) return;

    const itemId = crypto.randomUUID();
    const newItem: InventoryItem = {
      id: itemId,
      name,
      category,
      quantity,
      addedAt: new Date().toISOString(),
      addedBy: user.displayName || '사용자',
    };

    try {
      const basePath = userProfile?.roomId ? 'rooms' : 'users';
      const baseId = userProfile?.roomId || user.uid;
      const itemRef = doc(db, basePath, baseId, 'inventory', itemId);
      await setDoc(itemRef, { ...newItem, userId: user.uid });
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  const handleRemoveInventoryItem = async (id: string) => {
    if (!user) return;

    try {
      const basePath = userProfile?.roomId ? 'rooms' : 'users';
      const baseId = userProfile?.roomId || user.uid;
      const itemRef = doc(db, basePath, baseId, 'inventory', id);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Error removing inventory item:', error);
    }
  };

  const handleToggleBookmark = async (question: string, answer: HomeAssistAnswer) => {
    if (!user) return;

    const existingBookmark = bookmarks.find(b => b.question === question);

    try {
      if (existingBookmark) {
        const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', existingBookmark.id);
        await deleteDoc(bookmarkRef);
      } else {
        const bookmarkId = crypto.randomUUID();
        const newBookmark: Bookmark = {
          id: bookmarkId,
          userId: user.uid,
          question,
          answer,
          timestamp: new Date().toISOString(),
        };
        const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', bookmarkId);
        await setDoc(bookmarkRef, newBookmark);
      }
      
      // Tutorial progression
      if (currentStep === 'result_bookmark') {
        nextStep();
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleSelectBookmark = (bookmark: Bookmark) => {
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: bookmark.answer.user_answer,
      answer: bookmark.answer,
      timestamp: bookmark.timestamp,
      originalQuestion: bookmark.question
    };
    
    // 저장된 답변만 보이게 하기 위해 AI 응답만 단독으로 설정 (기존 내역 초기화)
    setConversationHistory([assistantMessage]);
    setCurrentQuestion(bookmark.question);
    setCurrentAnswer(bookmark.answer);
    setActiveTab('result');
    window.location.hash = 'result';
    window.scrollTo(0, 0);

    // 튜토리얼이 '마이페이지 북마크' 단계일 때 북마크를 눌러보면 자동으로 다음(카테고리) 단계로 넘김
    if (currentStep === 'mypage_bookmark') {
      nextStep();
    }
  };

  const handleSearch = async (query: string, image?: string) => {
    if (isLoading) return; // 이미 생성 중일 경우 중복 방지 (오류 원천 차단)
    if (!query.trim() && !image) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };
    if (image) {
      userMessage.image = image;
    }

    // 최신 대화가 맨 위로 오도록 배열 맨 앞에 추가
    setConversationHistory(prev => [userMessage, ...prev]);
    setCurrentQuestion(query || '사진으로 질문하기');
    setIsLoading(true);
    setActiveTab('result');
    window.location.hash = 'result';
    window.scrollTo(0, 0);

    try {
      // 배열이 역순(최신이 맨앞)이므로, API 전송 시에는 다시 정방향으로 뒤집어서(reverse) 맥락을 전달
      const answer = await getAnswer(query, inventoryItems, [...conversationHistory].reverse(), image);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: answer.user_answer,
        answer: answer,
        timestamp: new Date().toISOString()
      };
      // 방금 맨 앞에 추가된 userMessage 바로 다음(인덱스 1)에 답변을 삽입
      setConversationHistory(prev => {
        const newArr = [...prev];
        newArr.splice(1, 0, assistantMessage);
        return newArr;
      });
      setCurrentAnswer(answer);
      
      // If tutorial is at home_ask step, progress to result_bookmark after answer arrives
      if (currentStep === 'home_ask') {
        nextStep(); // progresses to result_bookmark
      }
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRule = (rule: HomeAssistRule) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content: rule.question,
      timestamp: new Date().toISOString()
    };

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: rule.answer.user_answer,
      answer: rule.answer,
      timestamp: new Date().toISOString()
    };
    // 최신 대화가 맨 위로 오도록 앞에 추가
    setConversationHistory(prev => [userMessage, assistantMessage, ...prev]);
    setCurrentQuestion(rule.question);
    setCurrentAnswer(rule.answer);
    setActiveTab('result');
    window.location.hash = 'result';
    window.scrollTo(0, 0);
  };

  const handleResetConversation = async () => {
    setConversationHistory([]);
    setCurrentQuestion('');
    setCurrentAnswer(null);
    window.location.hash = 'home';
    window.scrollTo(0, 0);

    // 명시적으로 Firestore에서도 삭제하여 완전 리셋
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'data', 'chatHistory'));
      } catch (e) {
        console.error('Failed to reset chat history in firestore', e);
      }
    }

    // Progress tutorial if on result_reset step
    if (currentStep === 'result_reset') {
      nextStep();
    }
  };

  const handleNavigate = (tab: string) => {
    window.location.hash = tab;
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onSearch={handleSearch} 
            onSelectCategory={(id) => {
              setTargetCategory(id);
              window.location.hash = `category?id=${id}`;
            }} 
            onSelectRule={handleSelectRule}
            isLoading={isLoading}
          />
        );
      case 'category':
        return <CategoryPage onSelectRule={handleSelectRule} initialCategoryId={targetCategory} />;
      case 'zip':
        if (!userProfile) return (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        );
        return <ZipPage 
          user={user} 
          userProfile={userProfile} 
          inventoryItems={inventoryItems} 
          onAddInventoryItem={handleAddInventoryItem} 
          onRemoveInventoryItem={handleRemoveInventoryItem} 
        />;
      case 'mypage':
        if (!userProfile) return (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        );
        return <MyPage 
          user={user} 
          userProfile={userProfile} 
          bookmarks={bookmarks} 
          onSelectBookmark={handleSelectBookmark} 
          onDeleteBookmark={async (bookmark) => {
            if (!user) return;
            try {
              const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', bookmark.id);
              await deleteDoc(bookmarkRef);
            } catch (e) {
              console.error('Failed to delete bookmark:', e);
            }
          }}
          onLogout={() => { handleNavigate('home'); }} 
        />;

      case 'result':
        return (
          <div className="space-y-12 pb-32">
            {/* Header with Reset Button */}
            <div className="flex justify-between items-center px-4 w-full">
              <h2 className="text-xl font-black text-gray-900">대화 내용</h2>
              <button 
                onClick={handleResetConversation}
                className={`relative flex items-center space-x-2 px-4 py-2 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full border border-gray-200 hover:border-red-200 transition-all font-bold text-sm shadow-sm ${currentStep === 'result_reset' ? 'ring-4 ring-blue-500 ring-offset-2 animate-bounce z-50' : ''}`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>대화 리셋</span>
              </button>
            </div>

            <AnimatePresence mode="popLayout">
              {conversationHistory && conversationHistory.length > 0 && conversationHistory.map((msg, idx) => (
                <div key={`${msg.timestamp}-${msg.role}-${idx}`} className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {msg.role === 'user' ? (
                      <div className="flex items-start space-x-4 w-full px-4 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="bg-white p-6 rounded-3xl rounded-tl-none border border-gray-100 shadow-sm flex-1">
                          {msg.image && (
                            <div className="mb-4">
                              <img src={msg.image} alt="User attached" className="max-w-xs rounded-2xl shadow-sm border border-gray-200" />
                            </div>
                          )}
                          {msg.content && <p className="text-xl font-black text-gray-900 leading-tight">“{msg.content}”</p>}
                        </div>
                      </div>
                    ) : (
                      (() => {
                        const prevMsg = idx > 0 ? conversationHistory[idx - 1] : null;
                        const questionText = msg.originalQuestion || (prevMsg?.role === 'user' ? (prevMsg.content || '') : '');
                        
                        return (
                          <div className="flex items-start space-x-4 w-full px-4 mb-12">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {msg.answer ? (
                                <ResultCard 
                                  question={questionText} 
                                  answer={msg.answer} 
                                  onBack={handleResetConversation} 
                                  onSearch={handleSearch}
                                  isBookmarked={bookmarks.some(b => b.question === questionText)}
                                  onToggleBookmark={() => msg.answer && handleToggleBookmark(questionText, msg.answer)}
                                />
                              ) : (
                                <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-sm border border-gray-100 inline-block">
                                  <p className="text-gray-900 text-lg">{msg.content}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </motion.div>

                  {/* 방금 추가된 최신 질문(idx === 0) 바로 아래에 로딩 애니메이션 표시 */}
                  {isLoading && idx === 0 && msg.role === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center justify-center py-12 mb-12"
                    >
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                      <p className="text-gray-500 font-bold">답변 생성 중...</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </AnimatePresence>

            {/* Follow-up Input */}
            {!isLoading && !isTutorialActive && (
              <div className="fixed bottom-24 w-full max-w-lg mx-auto px-4 z-40 pointer-events-none left-0 right-0">
                <div className="w-full pointer-events-auto">
                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/20">
                    <SearchInput onSearch={handleSearch} placeholder="궁금한 점을 물어보세요..." isLoading={isLoading} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <HomePage onSearch={handleSearch} onSelectCategory={() => { window.location.hash = 'category'; }} onSelectRule={handleSelectRule} />;
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Layout 
      activeTab={activeTab === 'result' ? 'home' : activeTab} 
      onNavigate={handleNavigate}
      onToggleUtility={() => setIsUtilityPanelOpen(true)}
    >
      {renderPage()}
      <UtilityPanel
        isOpen={isUtilityPanelOpen}
        onClose={() => setIsUtilityPanelOpen(false)}
        user={user}
        inventoryItems={inventoryItems}
        bookmarks={bookmarks}
        onAddInventoryItem={handleAddInventoryItem}
        onRemoveInventoryItem={handleRemoveInventoryItem}
        onSelectCategory={(id) => {
          setTargetCategory(id);
          window.location.hash = `category?id=${id}`;
          setIsUtilityPanelOpen(false);
        }}
        onSelectRule={handleSelectRule}
        onSelectBookmark={handleSelectBookmark}
        onDeleteBookmark={async (bookmark) => {
          if (!user) return;
          try {
            const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', bookmark.id);
            await deleteDoc(bookmarkRef);
          } catch (e) {
            console.error('Failed to delete bookmark:', e);
          }
        }}
        userProfile={userProfile}
      />
    </Layout>
  );
}
