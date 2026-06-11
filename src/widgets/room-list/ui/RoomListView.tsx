import { Lock, Plus, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { PrivateDiary, Room } from '../model/types';
import { MemberAvatars } from './MemberAvatars';

interface RoomListViewProps {
  onJoinRoom: () => void;
}

const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    name: '제주도 여행 🌴',
    memberColors: ['#fde2dc', '#dde7f6', '#e5e7eb'],
  },
  {
    id: '2',
    name: '카페 탐방대 ☕',
    memberColors: ['#dde7f6', '#fde2dc'],
  },
];

const MOCK_PRIVATE_DIARIES: PrivateDiary[] = [
  {
    id: '1',
    name: '나의 일기장',
    count: 47,
  },
];

export const RoomListView = ({ onJoinRoom }: RoomListViewProps) => {
  const navigate = useNavigate();

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
        <span className="text-[#9ca3af] text-[12px] font-medium">{MOCK_ROOMS.length}</span>
      </div>

      {MOCK_ROOMS.map((room) => (
        <button
          key={room.id}
          onClick={() => navigate(`/rooms/${room.id}`)}
          className="bg-white border border-[#eceef2] rounded-xl flex items-center justify-between px-[17px] py-3.75 shrink-0 text-left hover:bg-[#fafbfc] transition-colors"
        >
          <span className="text-[#1c2333] text-[14.6px] font-medium">{room.name}</span>
          <MemberAvatars colors={room.memberColors} />
        </button>
      ))}

      <div className="flex items-center gap-2 pt-2.5 shrink-0">
        <Lock size={16} color="#4b5563" strokeWidth={1.5} />
        <span className="text-[#4b5563] text-[13px] font-normal">개인 일기</span>
        <span className="text-[#9ca3af] text-[12px] font-medium">
          {MOCK_PRIVATE_DIARIES.length}
        </span>
      </div>

      {MOCK_PRIVATE_DIARIES.map((diary) => (
        <button
          key={diary.id}
          className="bg-white border border-[#eceef2] rounded-xl flex items-center justify-between px-[17px] py-3.75 shrink-0 text-left hover:bg-[#fafbfc] transition-colors"
        >
          <span className="text-[#1c2333] text-[14.6px] font-medium">{diary.name}</span>
          <span className="text-[#9ca3af] text-[12px] font-normal">{diary.count}</span>
        </button>
      ))}
    </div>
  );
};
