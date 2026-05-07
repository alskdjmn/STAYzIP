/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { FAQPage } from './pages/FAQPage';
import { MyPage } from './pages/MyPage';
import { ChatPage } from './pages/ChatPage';
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

type Page = 'home' | 'category' | 'faq' | 'mypage' | 'result' | 'chat';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Page>('home');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<HomeAssistAnswer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUtilityPanelOpen, setIsUtilityPanelOpen] = useState<boolean>(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);

  // 1. 대화 기록 로드 및 24시간 만료 처리
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`chat_history_${user.uid}`);
      if (saved) {
        try {
          const { timestamp, history } = JSON.parse(saved);
          // 24시간(86400000ms)이 지나지 않았으면 로드, 지났으면 삭제
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            setConversationHistory(history);
          } else {
            localStorage.removeItem(`chat_history_${user.uid}`);
            setConversationHistory([]);
          }
        } catch (e) {
          setConversationHistory([]);
        }
      } else {
        setConversationHistory([]);
      }
    } else {
      setConversationHistory([]);
    }
  }, [user]);

  // 2. 대화 기록 저장
  useEffect(() => {
    if (user && conversationHistory.length > 0) {
      localStorage.setItem(`chat_history_${user.uid}`, JSON.stringify({
        timestamp: Date.now(),
        history: conversationHistory
      }));
    } else if (user && conversationHistory.length === 0) {
      localStorage.removeItem(`chat_history_${user.uid}`);
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

    // Use Room inventory if roomId exists, otherwise use personal inventory
    const inventoryRef = userProfile?.roomId 
      ? collection(db, 'rooms', userProfile.roomId, 'inventory') 
      : collection(db, 'users', user.uid, 'inventory');
      
    const unsubscribe = onSnapshot(inventoryRef, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data() as InventoryItem);
      // Sort by recency to maintain stable UI
      setInventoryItems(items.sort((a,b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()));
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

  const handleAddInventoryItem = async (name: string, category: InventoryCategory) => {
    if (!user) return;

    const itemId = Math.random().toString(36).substr(2, 9);
    const newItem: InventoryItem = {
      id: itemId,
      name,
      category,
      addedAt: new Date().toISOString(),
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
        const bookmarkId = Math.random().toString(36).substr(2, 9);
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
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleSelectBookmark = (bookmark: Bookmark) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content: bookmark.question,
      timestamp: new Date().toISOString()
    };
    
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: bookmark.answer.user_answer,
      answer: bookmark.answer,
      timestamp: bookmark.timestamp
    };
    
    // 최신 대화가 맨 위로 오도록 앞에 추가
    setConversationHistory(prev => [userMessage, assistantMessage, ...prev]);
    setCurrentQuestion(bookmark.question);
    setCurrentAnswer(bookmark.answer);
    setActiveTab('result');
    window.scrollTo(0, 0);
  };

  const handleSearch = async (query: string, image?: string) => {
    if (!query.trim() && !image) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: query,
      image,
      timestamp: new Date().toISOString()
    };

    // 최신 대화가 맨 위로 오도록 배열 맨 앞에 추가
    setConversationHistory(prev => [userMessage, ...prev]);
    setCurrentQuestion(query || '사진으로 질문하기');
    setIsLoading(true);
    setActiveTab('result');
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
    window.scrollTo(0, 0);
  };

  const handleResetConversation = () => {
    setConversationHistory([]);
    setCurrentQuestion('');
    setCurrentAnswer(null);
    setActiveTab('home');
    window.scrollTo(0, 0);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as Page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onSearch={handleSearch} 
            onSelectCategory={() => setActiveTab('category')} 
            onSelectRule={handleSelectRule}
          />
        );
      case 'category':
        return <CategoryPage onSelectRule={handleSelectRule} />;
      case 'faq':
        return <FAQPage />;
      case 'mypage':
        return <MyPage onSelectRule={handleSelectRule} />;
      case 'chat':
        return userProfile && <ChatPage user={user} userProfile={userProfile} onBack={() => handleNavigate('home')} />;
      case 'result':
        return (
          <div className="space-y-12 pb-32">
            {/* Header with Reset Button */}
            <div className="flex justify-between items-center px-4 max-w-5xl mx-auto">
              <h2 className="text-xl font-black text-gray-900">대화 내용</h2>
              <button 
                onClick={handleResetConversation}
                className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full border border-gray-200 hover:border-red-200 transition-all font-bold text-sm shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>대화 리셋</span>
              </button>
            </div>

            <AnimatePresence mode="popLayout">
              {conversationHistory && conversationHistory.length > 0 && conversationHistory.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {msg.role === 'user' ? (
                    <div className="flex items-start space-x-4 max-w-3xl mx-auto px-4">
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
                    <div className="flex items-start space-x-4 max-w-5xl mx-auto px-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {msg.answer && (
                          <ResultCard 
                            question={msg.content} 
                            answer={msg.answer} 
                            onBack={handleResetConversation} 
                            onSearch={handleSearch}
                            isBookmarked={bookmarks.some(b => b.question === msg.content)}
                            onToggleBookmark={() => msg.answer && handleToggleBookmark(msg.content, msg.answer)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-bold">잠시만 기다려주세요...</p>
              </div>
            )}

            {/* Follow-up Input */}
            {!isLoading && (
              <div className="fixed bottom-24 left-0 right-0 px-4 z-40 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/20">
                    <SearchInput onSearch={handleSearch} placeholder="추가로 궁금한 점을 물어보세요..." />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <HomePage onSearch={handleSearch} onSelectCategory={() => setActiveTab('category')} onSelectRule={handleSelectRule} />;
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
          setActiveTab('category');
          setIsUtilityPanelOpen(false);
        }}
        onSelectRule={handleSelectRule}
        onSelectBookmark={handleSelectBookmark}
        onOpenChat={() => setActiveTab('chat')}
        userProfile={userProfile}
      />
    </Layout>
  );
}
