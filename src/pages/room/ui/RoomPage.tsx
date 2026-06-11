import { useCallback, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { LogOut, Trash2 } from 'lucide-react';

import type { RoomMember } from '@entities/room';
import {
  useDeleteRoom,
  useLeaveRoom,
  useSuspenseInfiniteRoomMembers,
  useSuspenseRoom,
  useUpdateRoom,
} from '@entities/room';
import { ChatView } from '@features/chat';
import { InviteSheet } from '@widgets/invite-sheet';
import { MemberListSheet } from '@widgets/member-list-sheet';
import { DiaryListView } from '@widgets/diary-list';
import { RoomHeader } from '@widgets/room-header';
import { AsyncBoundary, ConfirmSheet } from '@shared/ui';
import { useAuthStore } from '@shared/model';

import type { RoomView } from '../model/types';

export default function RoomPage() {
  const { roomId } = useParams();
  const roomIdNum = Number(roomId);

  if (!Number.isInteger(roomIdNum) || roomIdNum <= 0) {
    return <Navigate to="/404" replace />;
  }

  return (
    <AsyncBoundary fallbackVariant="screen" errorVariant="screen" resetKeys={[roomIdNum]}>
      <RoomPageContent roomId={roomIdNum} />
    </AsyncBoundary>
  );
}

interface RoomPageContentProps {
  roomId: number;
}

function RoomPageContent({ roomId }: RoomPageContentProps) {
  const navigate = useNavigate();
  const [view, setView] = useState<RoomView>('diary');
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [showMemberSheet, setShowMemberSheet] = useState(false);
  const [showRoomActionSheet, setShowRoomActionSheet] = useState(false);
  const [roomDraftTitle, setRoomDraftTitle] = useState('');
  const [roomActionError, setRoomActionError] = useState('');
  const [confirmAction, setConfirmAction] = useState<'leave' | 'delete' | null>(null);

  const user = useAuthStore((s) => s.user);
  const { data: room } = useSuspenseRoom(roomId);
  const {
    data: membersData,
    fetchNextPage: fetchNextMembersPage,
    hasNextPage: hasNextMembersPage,
    isFetchingNextPage: isFetchingNextMembersPage,
  } = useSuspenseInfiniteRoomMembers(roomId);
  const updateRoomMutation = useUpdateRoom(roomId);
  const leaveRoomMutation = useLeaveRoom();
  const deleteRoomMutation = useDeleteRoom();

  const isOwner = user?.userId === room.owner.ownerId;

  const members: RoomMember[] = membersData.pages
    .flatMap((page) => page.content)
    .map((m) => ({
      id: String(m.userId),
      name: m.name,
      color: '#e5e7eb',
      isMe: user?.userId === m.userId,
    }));

  const loadMoreMembers = useCallback(() => {
    void fetchNextMembersPage();
  }, [fetchNextMembersPage]);

  const handleBack = () => {
    if (view === 'chat') {
      setView('diary');
    } else {
      navigate('/');
    }
  };

  const handleCopy = () => {
    if (room.roomCode) {
      navigator.clipboard.writeText(room.roomCode).catch(() => {});
    }
  };

  const handleShare = () => {
    if (room.roomCode && navigator.share) {
      navigator.share({ text: room.roomCode }).catch(() => {});
    }
  };

  const handleOpenRoomActions = () => {
    setRoomDraftTitle(room.title);
    setRoomActionError('');
    setShowRoomActionSheet(true);
  };

  const handleUpdateRoomTitle = () => {
    const title = roomDraftTitle.trim();
    if (!title || title === room.title) return;

    setRoomActionError('');
    updateRoomMutation.mutate(
      { title },
      {
        onSuccess: () => {
          setShowRoomActionSheet(false);
        },
        onError: (error) => {
          setRoomActionError(
            error instanceof Error ? error.message : '방 이름을 수정하지 못했습니다.',
          );
        },
      },
    );
  };

  const handleLeaveRoom = () => {
    setShowRoomActionSheet(false);
    setConfirmAction('leave');
  };

  const handleDeleteRoom = () => {
    setShowRoomActionSheet(false);
    setConfirmAction('delete');
  };

  const handleConfirmRoomAction = () => {
    setRoomActionError('');
    if (confirmAction === 'leave') {
      leaveRoomMutation.mutate(roomId, {
        onSuccess: () => navigate('/'),
        onError: (error) => {
          setConfirmAction(null);
          setRoomActionError(error instanceof Error ? error.message : '방을 나가지 못했습니다.');
          setShowRoomActionSheet(true);
        },
      });
    } else if (confirmAction === 'delete') {
      deleteRoomMutation.mutate(roomId, {
        onSuccess: () => navigate('/'),
        onError: (error) => {
          setConfirmAction(null);
          setRoomActionError(error instanceof Error ? error.message : '방을 삭제하지 못했습니다.');
          setShowRoomActionSheet(true);
        },
      });
    }
  };

  const isRoomActionPending =
    updateRoomMutation.isPending || leaveRoomMutation.isPending || deleteRoomMutation.isPending;

  return (
    <div className="flex flex-col min-h-svh bg-[#f5f6f8] relative">
      <RoomHeader
        roomName={room.title}
        variant={view}
        memberCount={members.length}
        onBack={handleBack}
        onMore={() => (view === 'chat' ? setShowMemberSheet(true) : handleOpenRoomActions())}
      />

      <AsyncBoundary fallbackVariant="section" resetKeys={[roomId, view]}>
        {view === 'diary' ? (
          <DiaryListView
            roomId={roomId}
            onChatOpen={() => setView('chat')}
            onAddDiary={() => navigate(`/rooms/${roomId}/diaries/new`)}
            onDiaryClick={(id) => navigate(`/rooms/${roomId}/diaries/${id}`)}
            onInvite={() => setShowInviteSheet(true)}
          />
        ) : (
          <ChatView roomId={roomId} />
        )}
      </AsyncBoundary>

      {showMemberSheet && (
        <MemberListSheet
          hasNextPage={Boolean(hasNextMembersPage)}
          isFetchingNextPage={isFetchingNextMembersPage}
          members={members}
          onClose={() => setShowMemberSheet(false)}
          onLoadMore={loadMoreMembers}
        />
      )}

      {showInviteSheet && (
        <InviteSheet
          roomCode={room.roomCode}
          memberCount={members.length}
          memberColors={members.map((m) => m.color)}
          onClose={() => setShowInviteSheet(false)}
          onCopy={handleCopy}
          onShare={handleShare}
        />
      )}

      {confirmAction !== null && (
        <ConfirmSheet
          title={confirmAction === 'leave' ? '방에서 나갈까요?' : '방을 삭제할까요?'}
          description={
            confirmAction === 'leave'
              ? '나가면 이 방의 일기를 더 이상 볼 수 없어요.'
              : '삭제한 방은 복구할 수 없어요.'
          }
          confirmLabel={confirmAction === 'leave' ? '나가기' : '삭제'}
          destructive
          isPending={leaveRoomMutation.isPending || deleteRoomMutation.isPending}
          onConfirm={handleConfirmRoomAction}
          onClose={() => setConfirmAction(null)}
        />
      )}

      {showRoomActionSheet && (
        <div
          className="absolute inset-0 bg-[rgba(15,20,30,0.45)] flex items-end justify-center z-10"
          onClick={() => setShowRoomActionSheet(false)}
        >
          <div
            className="bg-white w-full rounded-tl-[22px] rounded-tr-[22px] px-5 pt-5 pb-7 flex flex-col gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-center mb-1">
              <div className="bg-[#e0e3e8] h-1 rounded-sm w-9" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#1c2333] font-bold text-[17px]">방 설정</span>
              <span className="text-[#9ca3af] text-[12px]">{members.length}명</span>
            </div>

            {roomActionError && (
              <div className="rounded-[10px] bg-[#fff5f5] px-3 py-2 text-[12px] text-[#ef4444]">
                {roomActionError}
              </div>
            )}

            {isOwner && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[#4b5563] text-[11.5px] font-medium px-1">방 이름</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={roomDraftTitle}
                    onChange={(event) => setRoomDraftTitle(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && handleUpdateRoomTitle()}
                    className="min-w-0 flex-1 bg-[#f5f6f8] border border-[#e5e7eb] rounded-[12px] px-3.5 py-3 text-[13.5px] text-[#1c2333] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateRoomTitle}
                    disabled={
                      isRoomActionPending ||
                      !roomDraftTitle.trim() ||
                      roomDraftTitle.trim() === room.title
                    }
                    className="h-11 rounded-[12px] bg-[#1c2333] px-3.5 text-[12.5px] font-semibold text-white disabled:opacity-40"
                  >
                    저장
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border border-[#eceef2] rounded-[14px] overflow-hidden">
              <button
                type="button"
                onClick={handleLeaveRoom}
                disabled={isRoomActionPending}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-[#fafbfc] disabled:opacity-40"
              >
                <LogOut size={15} color="#4b5563" strokeWidth={1.5} />
                <span className="text-[#1c2333] text-[14px]">방 나가기</span>
              </button>

              {isOwner && (
                <>
                  <div className="h-px bg-[#f0f1f3] mx-4" />
                  <button
                    type="button"
                    onClick={handleDeleteRoom}
                    disabled={isRoomActionPending}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-[#fff5f5] disabled:opacity-40"
                  >
                    <Trash2 size={15} color="#ef4444" strokeWidth={1.5} />
                    <span className="text-[#ef4444] text-[14px]">방 삭제</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
