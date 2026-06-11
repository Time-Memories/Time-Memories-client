export interface DiaryEntryCardProps {
  title: string;
  author: string;
  date: string;
  thumbnailColor: string;
  onClick?: () => void;
}

export const DiaryEntryCard = ({
  title,
  author,
  date,
  thumbnailColor,
  onClick,
}: DiaryEntryCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-[#eceef2] rounded-[14px] flex items-center gap-3 p-[13px] w-full text-left hover:bg-[#fafbfc] transition-colors shrink-0"
    >
      <div
        className="rounded-[10px] shrink-0 size-16 border border-[#eceef2]"
        style={{ backgroundColor: thumbnailColor }}
      />
      <div className="flex flex-col gap-[6px] min-w-0">
        <span className="text-[#1c2333] font-bold text-[14.3px] leading-[19.5px] truncate">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[#4b5563] text-xs font-medium">{author}</span>
          <span className="text-[#9ca3af] text-[11.4px]">· {date}</span>
        </div>
      </div>
    </button>
  );
};
