import { Lock, Plus, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useRooms } from '@entities/room';
import { MemberAvatars } from './MemberAvatars';

interface RoomListViewProps {
  onJoinRoom: () => void;
}

export const RoomListView = ({ onJoinRoom }: RoomListViewProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useRooms();

  const rooms = data?.pages.flatMap((p) => p.content) ?? [];

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
        <span className="text-[#9ca3af] text-[12px] font-medium">{rooms.length}</span>
      </div>

      {isLoading && (
        <div className="text-[#9ca3af] text-[13px] text-center py-4">불러오는 중...</div>
      )}

      {rooms.map((room) => (
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
        <span className="text-[#9ca3af] text-[12px] font-medium">
          {rooms.filter((r) => r.type === 'PRIVATE').length}
        </span>
      </div>

      {rooms
        .filter((r) => r.type === 'PRIVATE')
        .map((room) => (
          <button
            key={room.roomId}
            onClick={() => navigate(`/rooms/${room.roomId}`)}
            className="bg-white border border-[#eceef2] rounded-xl flex items-center justify-between px-4.25 py-3.75 shrink-0 text-left hover:bg-[#fafbfc] transition-colors"
          >
            <span className="text-[#1c2333] text-[14.6px] font-medium">{room.title}</span>
          </button>
        ))}
    </div>
  );
};
