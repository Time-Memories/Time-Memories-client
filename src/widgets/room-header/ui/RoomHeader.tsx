import { ChevronLeft, Settings } from 'lucide-react';

export interface RoomHeaderProps {
  roomName: string;
  variant: 'diary' | 'chat';
  memberCount?: number;
  onBack: () => void;
  onMore: () => void;
}

export const RoomHeader = ({ roomName, variant, memberCount, onBack, onMore }: RoomHeaderProps) => {
  return (
    <div className="bg-white border-b border-[#eceef2] flex items-center gap-2.5 pb-3.25 pt-3.5 px-4 shrink-0 w-full">
      <button onClick={onBack} className="w-6 flex items-start">
        <ChevronLeft size={20} color="#1c2333" strokeWidth={1.5} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[#1c2333] font-bold text-[15.4px] leading-none whitespace-nowrap">
            {roomName}
          </span>
          {variant === 'chat' && memberCount !== undefined && (
            <span className="text-[#9ca3af] text-[11px] font-normal pl-1">{memberCount}명</span>
          )}
        </div>
      </div>

      <button
        onClick={onMore}
        className="flex items-center justify-center rounded-[10px] size-9 shrink-0 hover:bg-[#f5f6f8] transition-colors"
      >
        <Settings size={18} color="#1c2333" strokeWidth={1.5} />
      </button>
    </div>
  );
};
