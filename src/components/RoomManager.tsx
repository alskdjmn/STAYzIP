import React, { useState, useEffect } from 'react';
import { Users, Plus, LogIn, LogOut, Copy, Check, X } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { UserProfile, Room } from '../types';
import { useTutorial } from '../contexts/TutorialContext';

interface RoomManagerProps {
  user: User;
  userProfile: UserProfile | null;
}

const withTimeout = <T,>(promise: Promise<T>, ms = 5000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('네트워크 응답 시간 초과 (데이터베이스 설정을 확인해주세요).')), ms))
  ]);
};

export const RoomManager: React.FC<RoomManagerProps> = ({ user, userProfile }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentStep, nextStep } = useTutorial();

  useEffect(() => {
    const fetchCurrentRoom = async () => {
      if (userProfile?.roomId) {
        try {
          const roomDoc = await withTimeout(getDoc(doc(db, 'rooms', userProfile.roomId)));
          if (roomDoc.exists()) {
            setCurrentRoom({ id: roomDoc.id, ...roomDoc.data() } as Room);
          }
        } catch(e) {
          console.error("Room fetch error:", e);
        }
      } else {
        setCurrentRoom(null);
      }
    };
    fetchCurrentRoom();
  }, [userProfile?.roomId]);

  const generateSecureCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const array = new Uint8Array(6);
    crypto.getRandomValues(array);
    return Array.from(array).map(v => chars[v % chars.length]).join('');
  };

  const generateUniqueInviteCode = async (): Promise<string> => {
    const MAX_ATTEMPTS = 10;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const code = generateSecureCode();
      const q = query(collection(db, 'rooms'), where('code', '==', code));
      const snapshot = await withTimeout(getDocs(q));
      if (snapshot.empty) return code; // 충돌 없으면 사용
    }
    throw new Error('고유 초대코드 생성에 실패했습니다. 다시 시도해주세요.');
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      const code = await generateUniqueInviteCode();
      const newRoom = {
        name: roomName,
        code,
        createdBy: user.uid,
        members: [user.uid],
        createdAt: new Date().toISOString()
      };

      const docRef = await withTimeout(addDoc(collection(db, 'rooms'), newRoom));
      
      await withTimeout(setDoc(doc(db, 'users', user.uid), {
        roomId: docRef.id
      }, { merge: true }));

      setIsCreating(false);
      setRoomName('');
      if (currentStep === 'zip_room') nextStep();
    } catch (err: any) {
      console.error("Create Room Error:", err);
      // Determine if it's a permissions error
      const errorMsg = err.message || '';
      if (errorMsg.includes('Missing or insufficient permissions')) {
        setError('방 생성 실패: Firebase Rules 권한 설정이 필요합니다.');
      } else {
        setError(`방 생성에 실패했습니다: ${errorMsg}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || inviteCode.length !== 6 || isSubmitting) {
      setError('6자리 초대코드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const q = query(collection(db, 'rooms'), where('code', '==', inviteCode.toUpperCase()));
      const querySnapshot = await withTimeout(getDocs(q));

      if (querySnapshot.empty) {
        setError('해당 초대코드로 된 방을 찾을 수 없습니다.');
        setIsSubmitting(false);
        return;
      }

      const roomDoc = querySnapshot.docs[0];
      
      await withTimeout(updateDoc(doc(db, 'rooms', roomDoc.id), {
        members: arrayUnion(user.uid)
      }));

      await withTimeout(setDoc(doc(db, 'users', user.uid), {
        roomId: roomDoc.id
      }, { merge: true }));

      setIsJoining(false);
      setInviteCode('');
    } catch (err: any) {
      console.error("Join Room Error:", err);
      setError(`방 참여에 실패했습니다: ${err.message || '알 수 없는 오류'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!userProfile?.roomId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (currentRoom && currentRoom.members.length === 1 && currentRoom.members[0] === user.uid) {
        await withTimeout(deleteDoc(doc(db, 'rooms', userProfile.roomId)));
      } else {
        await withTimeout(updateDoc(doc(db, 'rooms', userProfile.roomId), {
          members: arrayRemove(user.uid)
        }));
      }

      await withTimeout(setDoc(doc(db, 'users', user.uid), {
        roomId: null
      }, { merge: true }));
    } catch (err) {
      console.error('Failed to leave room', err);
      alert('방 나가기에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (currentRoom?.code) {
      navigator.clipboard.writeText(currentRoom.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (userProfile?.roomId && currentRoom) {
    return (
      <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-black text-gray-900">{currentRoom.name}</h3>
              <p className="text-xs font-bold text-gray-500">{currentRoom.members.length}명 참여중</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">

            <button 
              onClick={handleLeaveRoom}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors tooltip"
              title="방 나가기"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-blue-100">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-blue-500 tracking-wider">초대 코드</span>
            <span className="text-lg font-black text-gray-900 tracking-widest">{currentRoom.code}</span>
          </div>
          <button 
            onClick={copyToClipboard}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-bold text-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '복사됨' : '복사'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-black text-gray-900 leading-tight">공유 방</h3>
          <p className="text-xs text-gray-500 font-bold">사물함을 가족/룸메이트와 공유하세요</p>
        </div>
      </div>

      {error && <p className="text-xs font-bold text-red-500 text-center bg-red-50 p-2 rounded-lg">{error}</p>}

      {!isCreating && !isJoining ? (
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              setIsCreating(true);
            }}
            className={`flex-1 flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group ${currentStep === 'zip_room' ? 'ring-4 ring-blue-500 ring-offset-2 animate-bounce relative z-50' : ''}`}
          >
            <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
            <span className="text-sm font-bold text-gray-700">방 만들기</span>
          </button>
          <button 
            onClick={() => setIsJoining(true)}
            className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <LogIn className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
            <span className="text-sm font-bold text-gray-700">코드로 참여</span>
          </button>
        </div>
      ) : isCreating ? (
        <form onSubmit={handleCreateRoom} className="space-y-3 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm relative">
          <button type="button" onClick={() => setIsCreating(false)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
          <label className="block text-xs font-bold text-gray-500 mb-1">새 방 이름</label>
          <input 
            type="text" 
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${currentStep === 'zip_room' ? 'ring-4 ring-blue-500 ring-offset-2 animate-bounce relative z-50' : ''}`}
            placeholder="예: 예지네 자취방"
            maxLength={15}
            autoFocus
          />
          <button type="submit" disabled={!roomName.trim() || isSubmitting} className={`w-full py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 ${currentStep === 'zip_room' ? 'ring-4 ring-blue-500 ring-offset-2 animate-bounce relative z-50' : ''}`}>
            {isSubmitting ? '생성 중...' : '생성하기'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleJoinRoom} className="space-y-3 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm relative">
          <button type="button" onClick={() => setIsJoining(false)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
          <label className="block text-xs font-bold text-gray-500 mb-1">초대 코드 6자리</label>
          <input 
            type="text" 
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-center text-lg font-black tracking-[0.2em] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none uppercase"
            placeholder="ABCDEF"
            maxLength={6}
            autoFocus
          />
          <button type="submit" disabled={inviteCode.length !== 6 || isSubmitting} className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50">
            {isSubmitting ? '처리 중...' : '입장하기'}
          </button>
        </form>
      )}
    </div>
  );
};
