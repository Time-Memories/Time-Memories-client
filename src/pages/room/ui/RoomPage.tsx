import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { RoomInfo, RoomView } from '../model/types';
import { ChatView } from './ChatView';
import { DiaryListView } from './DiaryListView';
import { RoomHeader } from './RoomHeader';

const MOCK_ROOM: RoomInfo = {
  id: '1',
  name: '제주도 여행 🌴',
  code: 'JEJU24',
  memberCount: 3,
  memberColors: ['#fde2dc', '#dde7f6', '#e5e7eb'],
};

export default function RoomPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<RoomView>('diary');

  const handleBack = () => {
    if (view === 'chat') {
      setView('diary');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#f5f6f8] relative">
      <RoomHeader
        roomName={MOCK_ROOM.name}
        variant={view}
        memberCount={MOCK_ROOM.memberCount}
        onBack={handleBack}
        onMore={() => {}}
      />

      {view === 'diary' ? (
        <DiaryListView onChatOpen={() => setView('chat')} onAddDiary={() => {}} />
      ) : (
        <ChatView />
      )}
    </div>
  );
}
