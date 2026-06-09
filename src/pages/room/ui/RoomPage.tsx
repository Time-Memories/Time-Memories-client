import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { RoomInfo } from '@entities/room';
import { ChatView } from '@features/chat';
import { InviteSheet } from '@widgets/invite-sheet';
import { MemberListSheet } from '@widgets/member-list-sheet';
import type { RoomMember } from '@widgets/member-list-sheet';
import { DiaryListView } from '@widgets/diary-list';
import { RoomHeader } from '@widgets/room-header';

import type { RoomView } from '../model/types';

const MOCK_ROOM: RoomInfo = {
  id: '1',
  name: '제주도 여행 🌴',
  code: 'JEJU24',
  memberCount: 3,
  memberColors: ['#fde2dc', '#dde7f6', '#e5e7eb'],
};

const MOCK_MEMBERS: RoomMember[] = [
  { id: '1', name: '나', color: '#dde7f6', isMe: true },
  { id: '2', name: '민호', color: '#fde2dc' },
  { id: '3', name: '수아', color: '#e5e7eb' },
];

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState<RoomView>('diary');
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [showMemberSheet, setShowMemberSheet] = useState(false);

  const handleBack = () => {
    if (view === 'chat') {
      setView('diary');
    } else {
      navigate('/');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_ROOM.code).catch(() => {});
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: MOCK_ROOM.code }).catch(() => {});
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#f5f6f8] relative">
      <RoomHeader
        roomName={MOCK_ROOM.name}
        variant={view}
        memberCount={MOCK_ROOM.memberCount}
        onBack={handleBack}
        onMore={() => (view === 'chat' ? setShowMemberSheet(true) : navigate('/settings'))}
      />

      {view === 'diary' ? (
        <DiaryListView
          onChatOpen={() => setView('chat')}
          onAddDiary={() => navigate(`/rooms/${roomId}/diaries/new`)}
          onDiaryClick={(id) => navigate(`/rooms/${roomId}/diaries/${id}`)}
          onInvite={() => setShowInviteSheet(true)}
        />
      ) : (
        <ChatView />
      )}

      {showMemberSheet && (
        <MemberListSheet members={MOCK_MEMBERS} onClose={() => setShowMemberSheet(false)} />
      )}

      {showInviteSheet && (
        <InviteSheet
          roomCode={MOCK_ROOM.code}
          memberCount={MOCK_ROOM.memberCount}
          memberColors={MOCK_ROOM.memberColors}
          onClose={() => setShowInviteSheet(false)}
          onCopy={handleCopy}
          onShare={handleShare}
        />
      )}
    </div>
  );
}
