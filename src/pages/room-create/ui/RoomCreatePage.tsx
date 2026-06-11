import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

import { useCreateRoom } from '@entities/room';

const MEMBER_COUNTS = Array.from({ length: 11 }, (_, i) => i + 2);

export default function RoomCreatePage() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [memberCount, setMemberCount] = useState<number>(2);
  const [errorMessage, setErrorMessage] = useState('');
  const createRoomMutation = useCreateRoom();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCreate = () => {
    if (!roomName.trim()) return;
    setErrorMessage('');

    createRoomMutation.mutate(
      { title: roomName.trim(), type: memberCount === 1 ? 'PRIVATE' : 'GROUP' },
      {
        onSuccess: (data) => {
          if (typeof data?.roomId === 'number') {
            navigate(`/rooms/${data.roomId}`);
            return;
          }

          navigate('/');
        },
        onError: (error) => {
          setErrorMessage(
            error instanceof Error ? error.message : '방을 만드는 중 오류가 발생했습니다.',
          );
        },
      },
    );
  };

  const isValid = roomName.trim().length > 0 && !createRoomMutation.isPending;

  return (
    <div className="flex flex-col h-svh bg-white">
      <div className="shrink-0 flex items-center justify-between px-4 pt-[14px] pb-[15px] border-b border-[#eceef2]">
        <button onClick={handleCancel} className="text-[#4b5563] text-[14px] min-w-[40px]">
          취소
        </button>
        <span className="text-[#1c2333] text-[15px] font-bold">방 만들기</span>
        <button
          onClick={handleCreate}
          disabled={!isValid}
          className="text-[14px] font-bold min-w-[40px] text-right disabled:text-[#9ca3af] text-[#1c2333]"
        >
          {createRoomMutation.isPending ? '생성 중' : '만들기'}
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0 px-[18px] py-[16px] flex flex-col gap-[14px]">
        {errorMessage && (
          <div className="rounded-[10px] bg-[#fff5f5] px-3.5 py-2.5 text-[12.5px] text-[#ef4444]">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-[6px]">
          <label className="text-[#4b5563] text-[11.3px] font-medium">방 이름</label>
          <div className="bg-white border border-[#e5e7eb] rounded-[12px] px-[15px] py-[13px]">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="방 이름을 입력하세요"
              className="w-full text-[13.3px] text-[#1c2333] placeholder:text-[#9ca3af] outline-none bg-transparent"
              maxLength={20}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[#4b5563] text-[11.3px] font-medium">최대 인원</label>
          <div className="bg-white border border-[#e5e7eb] rounded-[12px] px-[15px] py-[13px] flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <Users size={16} color="#9ca3af" />
              <span className="text-[#1c2333] text-[14px]">{memberCount}명</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <button
                onClick={() => setMemberCount((prev) => Math.max(2, prev - 1))}
                disabled={memberCount === 2}
                className="size-[28px] rounded-full bg-[#f5f6f8] flex items-center justify-center disabled:opacity-30"
              >
                <span className="text-[#4b5563] text-[16px] leading-none">−</span>
              </button>
              <span className="text-[#1c2333] text-[14px] font-medium w-[20px] text-center">
                {memberCount}
              </span>
              <button
                onClick={() => setMemberCount((prev) => Math.min(12, prev + 1))}
                disabled={memberCount === 12}
                className="size-[28px] rounded-full bg-[#f5f6f8] flex items-center justify-center disabled:opacity-30"
              >
                <span className="text-[#4b5563] text-[16px] leading-none">+</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-[8px] mt-[4px]">
            {MEMBER_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => setMemberCount(count)}
                className={`px-[14px] py-[7px] rounded-full text-[12.5px] font-medium border transition-colors ${
                  memberCount === count
                    ? 'bg-[#1c2333] text-white border-[#1c2333]'
                    : 'bg-white text-[#4b5563] border-[#e5e7eb]'
                }`}
              >
                {count}명
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
