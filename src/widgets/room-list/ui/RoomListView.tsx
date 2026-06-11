import { Lock, Plus, UserPlus, Users } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSuspenseRooms } from '@entities/room';
import { useCalendarCounts } from '@entities/diary';
import { useLoadMoreOnIntersect } from '@shared/lib';
import { MemberAvatars } from './MemberAvatars';

interface RoomListViewProps {
  onJoinRoom: () => void;
}

export const RoomListView = ({ onJoinRoom }: RoomListViewProps) => {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseRooms();

  const rooms = data.pages.flatMap((p) => p.content);
  const sharedRooms = rooms.filter((r) => r.type !== 'PRIVATE');

  const now = new Date();
  const { data: calendarData } = useCalendarCounts(now.getFullYear(), now.getMonth() + 1);
  const myDiaryCount = calendarData?.writtenDates.reduce((sum, d) => sum + d.count, 0) ?? 0;

  const loadMoreRooms = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  useLoadMoreOnIntersect({
    enabled: Boolean(hasNextPage),
    isLoading: isFetchingNextPage,
    onLoadMore: loadMoreRooms,
    targetRef: loadMoreRef,
  });

  return (
    <div className="flex flex-col gap-2 flex-1 overflow-auto px-4.5 py-3.5 bg-[#f5f6f8]">
      <div className="grid grid-cols-2 gap-2 shrink-0">
        <button
          onClick={() => navigate('/rooms/new')}
          className="bg-[#1c2333] border border-[#1c2333] rounded-[14px] flex items-center justify-center gap-2 text-white text-[14px] font-semibold h-16.5 hover:opacity-90 transition-opacity"
        >
          <Plus size={16} color="white" strokeWidth={2} />방 만들기
        </button>
        <button
          onClick={onJoinRoom}
          className="bg-white border border-[#e5e7eb] rounded-[14px] flex items-center justify-center gap-2 text-[#1c2333] text-[14px] font-semibold h-16.5 hover:bg-[#f9fafb] transition-colors"
        >
          <UserPlus size={16} color="#1c2333" strokeWidth={1.5} />방 참여하기
        </button>
      </div>

      <div className="flex items-center gap-2 pt-2.5 shrink-0">
        <Users size={16} color="#4b5563" strokeWidth={1.5} />
        <span className="text-[#4b5563] text-[13px] font-normal">내 방</span>
        <span className="text-[#9ca3af] text-[12px] font-medium">{sharedRooms.length}</span>
      </div>

      {sharedRooms.map((room) => (
        <button
          key={room.roomId}
          onClick={() => navigate(`/rooms/${room.roomId}`)}
          className="bg-white border border-[#eceef2] rounded-xl flex items-center justify-between px-4.25 py-3.75 shrink-0 text-left hover:bg-[#fafbfc] transition-colors"
        >
          <span className="text-[#1c2333] text-[14.6px] font-medium">{room.title}</span>
          <MemberAvatars colors={[]} />
        </button>
      ))}

      <div className="flex items-center gap-2 pt-2.5 shrink-0">
        <Lock size={16} color="#4b5563" strokeWidth={1.5} />
        <span className="text-[#4b5563] text-[13px] font-normal">개인 일기</span>
        <span className="text-[#9ca3af] text-[12px] font-medium">{myDiaryCount}</span>
      </div>

      <button
        onClick={() => navigate('/my-diaries')}
        className="bg-white border border-[#eceef2] rounded-xl flex items-center justify-between px-4.25 py-3.75 shrink-0 text-left hover:bg-[#fafbfc] transition-colors"
      >
        <span className="text-[#1c2333] text-[14.6px] font-medium">나의 일기</span>
        <MemberAvatars colors={[]} />
      </button>

      <div ref={loadMoreRef} className="min-h-1 shrink-0">
        {isFetchingNextPage && (
          <div className="py-3 text-center text-[#9ca3af] text-[12px]">방을 더 불러오는 중...</div>
        )}
      </div>
    </div>
  );
};
