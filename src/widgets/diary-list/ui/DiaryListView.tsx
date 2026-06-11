import { MessageCircle, Pencil, UserPlus } from 'lucide-react';

import { DiaryEntryCard } from '@entities/diary';
import { useSuspenseDiaries } from '@entities/diary';
import { formatMonthDay } from '@shared/lib';

export interface DiaryListViewProps {
  roomId: number;
  onChatOpen: () => void;
  onAddDiary: () => void;
  onDiaryClick: (id: string) => void;
  onInvite: () => void;
}

export const DiaryListView = ({
  roomId,
  onChatOpen,
  onAddDiary,
  onDiaryClick,
  onInvite,
}: DiaryListViewProps) => {
  const { data } = useSuspenseDiaries(roomId);

  const diaries = data.content;

  return (
    <div className="relative flex-1 min-h-0">
      <div className="bg-[#f5f6f8] flex flex-col gap-2 h-full overflow-auto pt-[14px] px-[14px] pb-[80px]">
        {diaries.map((diary) => (
          <DiaryEntryCard
            key={diary.diaryId}
            title={diary.title}
            author={diary.authorName}
            date={formatMonthDay(new Date(diary.createdAt))}
            thumbnailColor="#e5e7eb"
            thumbnailUrl={diary.thumbnailUrl}
            onClick={() => onDiaryClick(String(diary.diaryId))}
          />
        ))}
      </div>

      <div className="absolute bottom-[80px] right-4 flex flex-col gap-2">
        <button
          onClick={onInvite}
          className="bg-white border border-[#e5e7eb] rounded-[18px] flex items-center justify-center size-[52px] shadow-[0px_4px_10px_-2px_rgba(20,30,50,0.15)] hover:bg-[#f9fafb] transition-colors"
        >
          <UserPlus size={20} color="#1c2333" strokeWidth={1.5} />
        </button>
        <button
          onClick={onChatOpen}
          className="bg-white border border-[#e5e7eb] rounded-[18px] flex items-center justify-center size-[52px] shadow-[0px_4px_10px_-2px_rgba(20,30,50,0.15)] hover:bg-[#f9fafb] transition-colors"
        >
          <MessageCircle size={22} color="#1c2333" strokeWidth={1.5} />
        </button>
      </div>

      <button
        onClick={onAddDiary}
        className="absolute bottom-[18px] right-4 bg-[#1c2333] rounded-[18px] flex items-center justify-center size-[52px] shadow-[0px_8px_18px_-4px_rgba(20,30,50,0.35)] hover:opacity-90 transition-opacity"
      >
        <Pencil size={20} color="white" strokeWidth={1.8} />
      </button>
    </div>
  );
};
