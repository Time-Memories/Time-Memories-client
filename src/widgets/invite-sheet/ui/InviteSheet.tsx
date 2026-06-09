import { Copy, Share2 } from 'lucide-react';

export interface InviteSheetProps {
  roomCode: string;
  memberCount: number;
  memberColors: string[];
  onClose: () => void;
  onCopy: () => void;
  onShare: () => void;
}

export const InviteSheet = ({
  roomCode,
  memberCount,
  memberColors,
  onClose,
  onCopy,
  onShare,
}: InviteSheetProps) => {
  return (
    <div
      className="absolute inset-0 bg-[rgba(15,20,30,0.45)] flex items-end justify-center z-10"
      onClick={onClose}
    >
      <div
        className="bg-white flex flex-col gap-[14px] items-start w-full pb-6 pt-[22px] px-5 rounded-tl-[22px] rounded-tr-[22px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center w-full pb-1">
          <div className="bg-[#e0e3e8] h-1 rounded-sm w-9" />
        </div>

        <span className="text-[#1c2333] font-bold text-[17px]">친구 초대하기</span>

        <p className="text-[#4b5563] text-[12.3px] font-normal leading-[19.5px] -mt-2">
          아래 코드를 친구에게 공유하면
          <br />
          같은 방에 참여할 수 있어요.
        </p>

        <div className="bg-[#f5f6f8] flex flex-col gap-1.5 items-center px-4 py-[22px] rounded-[16px] w-full">
          <span className="text-[#9ca3af] text-[11px] font-medium tracking-[0.5px] uppercase">
            방 코드
          </span>
          <span className="text-[#1c2333] font-bold text-[30px] tracking-[6px] font-mono">
            {roomCode}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            onClick={onCopy}
            className="bg-white border border-[#e5e7eb] rounded-[14px] flex items-center justify-center gap-2 h-12 hover:bg-[#f9fafb] transition-colors"
          >
            <Copy size={16} color="#1c2333" strokeWidth={1.5} />
            <span className="text-[#1c2333] text-sm font-semibold">복사</span>
          </button>
          <button
            onClick={onShare}
            className="bg-[#1c2333] border border-[#1c2333] rounded-[14px] flex items-center justify-center gap-2 h-12 hover:opacity-90 transition-opacity"
          >
            <Share2 size={16} color="white" strokeWidth={1.5} />
            <span className="text-white text-sm font-semibold">공유</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 pt-1 w-full">
          <div className="bg-[#e5e7eb] h-px w-[30px]" />
          <span className="text-[#9ca3af] text-xs">참여 중 {memberCount}명</span>
          <div className="bg-[#e5e7eb] h-px w-[30px]" />
        </div>

        <div className="flex justify-center w-full">
          <div className="flex items-center">
            {memberColors.map((color, index) => (
              <div
                key={index}
                className="size-[22px] rounded-full border-2 border-white"
                style={{
                  backgroundColor: color,
                  marginLeft: index > 0 ? '-6px' : '0',
                  zIndex: memberColors.length - index,
                  position: 'relative',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
