import { useState } from 'react';

export interface JoinRoomModalProps {
  onClose: () => void;
  onJoin: (code: string) => void;
}

export const JoinRoomModal = ({ onClose, onJoin }: JoinRoomModalProps) => {
  const [code, setCode] = useState('');

  const handleJoin = () => {
    if (code.trim()) onJoin(code.trim());
  };

  return (
    <div
      className="absolute inset-0 bg-[rgba(15,20,30,0.45)] flex items-end justify-center z-10"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-tl-[22px] rounded-tr-[22px] px-5 pt-5 pb-8 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-1">
          <div className="bg-[#e0e3e8] h-1 rounded-sm w-9" />
        </div>

        <span className="text-[#1c2333] font-bold text-[17px]">방 참여하기</span>

        <p className="text-[#4b5563] text-[12.3px] leading-[19.5px] -mt-2">
          친구에게 방 코드를 공유받으세요!
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          placeholder="방 코드를 입력하세요"
          maxLength={10}
          className="bg-[#f5f6f8] border border-[#e5e7eb] rounded-xl px-4 py-3.25 text-[14px] text-[#1c2333] placeholder:text-[#9ca3af] outline-none tracking-widest font-mono text-center"
          autoFocus
        />

        <button
          onClick={handleJoin}
          disabled={!code.trim()}
          className="bg-[#1c2333] text-white text-[14px] font-semibold rounded-[14px] h-12 disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          참여하기
        </button>
      </div>
    </div>
  );
};
