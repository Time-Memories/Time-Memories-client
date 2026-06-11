import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { RoomMember } from '@entities/room';
import { useRoom, useRoomMembers } from '@entities/room';
import { ChatView } from '@features/chat';
import { InviteSheet } from '@widgets/invite-sheet';
import { MemberListSheet } from '@widgets/member-list-sheet';
import { DiaryListView } from '@widgets/diary-list';
import { RoomHeader } from '@widgets/room-header';

import type { RoomView } from '../model/types';

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState<RoomView>('diary');
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [showMemberSheet, setShowMemberSheet] = useState(false);

  const roomIdNum = Number(roomId);
  const { data: room } = useRoom(roomIdNum);
  const { data: membersData } = useRoomMembers(roomIdNum);

  const members: RoomMember[] = (membersData?.content ?? []).map((m) => ({
    id: String(m.userId),
    name: m.name,
    color: '#e5e7eb',
    isMe: m.role === 'OWNER',
  }));

  const handleBack = () => {
    if (view === 'chat') {
      setView('diary');
    } else {
      navigate('/');
    }
  };

  const handleCopy = () => {
    if (room?.roomCode) {
      navigator.clipboard.writeText(room.roomCode).catch(() => {});
    }
  };

  const handleShare = () => {
    if (room?.roomCode && navigator.share) {
      navigator.share({ text: room.roomCode }).catch(() => {});
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#f5f6f8] relative">
      <RoomHeader
        roomName={room?.title ?? ''}
        variant={view}
        memberCount={members.length}
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
        <ChatView roomId={roomIdNum} />
      )}

      {showMemberSheet && (
        <MemberListSheet members={members} onClose={() => setShowMemberSheet(false)} />
      )}

      {showInviteSheet && room && (
        <InviteSheet
          roomCode={room.roomCode}
          memberCount={members.length}
          memberColors={members.map((m) => m.color)}
          onClose={() => setShowInviteSheet(false)}
          onCopy={handleCopy}
          onShare={handleShare}
        />
      )}
    </div>
  );
}
