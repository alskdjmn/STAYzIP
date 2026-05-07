import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, User as UserIcon } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { UserProfile, RoomMessage } from '../types';

interface ChatPageProps {
  user: User;
  userProfile: UserProfile;
  onBack: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ user, userProfile, onBack }) => {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const roomId = userProfile.roomId;

  useEffect(() => {
    if (!roomId) return;

    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    // 최근 100개의 메시지만 가져오도록 desc 정렬 후 클라이언트에서 뒤집음 (비용 최적화 및 버그 수정)
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RoomMessage[];
      setMessages(fetchedMessages.reverse());
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId || isSending) return;

    // 도배 방지 (1초 쿨다운)
    const now = Date.now();
    if (now - lastSentTime < 1000) {
      alert("메시지를 너무 빨리 보낼 수 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsSending(true);
    setLastSentTime(now);
    try {
      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        userId: user.uid,
        userName: userProfile.displayName || user.displayName || '사용자',
        userPhotoURL: userProfile.photoURL || user.photoURL || null,
        createdAt: new Date().toISOString()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const isMessageFromMe = (msgUserId: string) => msgUserId === user.uid;

  if (!roomId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 font-bold mb-4">참여 중인 방이 없습니다.</p>
        <button onClick={onBack} className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold">돌아가기</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto bg-gray-50/50 relative">
      {/* Header */}
      <div className="flex items-center px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-2 mr-4 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">우리들의 채팅방</h2>
          <p className="text-xs font-bold text-gray-500">방 멤버들과 소통하세요</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 font-bold text-sm">첫 메시지를 남겨보세요!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const me = isMessageFromMe(msg.userId);
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end space-x-2 ${me ? 'justify-end' : 'justify-start'}`}
              >
                {!me && (
                  <div className="flex-shrink-0">
                    {msg.userPhotoURL ? (
                      <img src={msg.userPhotoURL} alt={msg.userName} className="w-8 h-8 rounded-full shadow-sm" />
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                )}
                <div className={`flex flex-col ${me ? 'items-end' : 'items-start'}`}>
                  {!me && <span className="text-xs text-gray-500 font-bold mb-1 ml-1">{msg.userName}</span>}
                  <div 
                    className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-sm ${
                      me 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 font-bold">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              maxLength={23}
              className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-14"
            />
            <span className={`absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold ${newMessage.length >= 23 ? 'text-red-400' : 'text-gray-400'}`}>
              {newMessage.length}/23
            </span>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};
