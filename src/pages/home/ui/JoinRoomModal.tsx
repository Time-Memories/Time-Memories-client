import { useState } from 'react';
import { X } from 'lucide-react';

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
      className="absolute inset-0 bg-[rgba(15,20,30,0.45)] flex items-center justify-center z-10 px-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] w-full px-5 pt-5 pb-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-[#1c2333] font-bold text-[16px]">방 참여하기</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-8 rounded-full hover:bg-[#f5f6f8] transition-colors"
          >
            <X size={16} color="#9ca3af" strokeWidth={1.5} />
          </button>
        </div>

        <p className="text-[#4b5563] text-[13px] leading-[20px] -mt-1">
          친구에게 방 코드를 공유받으세요!
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          placeholder="방 코드를 입력하세요"
          maxLength={10}
          className="bg-[#f5f6f8] border border-[#e5e7eb] rounded-[12px] px-4 py-[13px] text-[14px] text-[#1c2333] placeholder:text-[#9ca3af] outline-none tracking-widest font-mono text-center"
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
