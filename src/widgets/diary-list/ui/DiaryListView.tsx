import { MessageCircle, Pencil, UserPlus } from 'lucide-react';
import { useCallback, useRef } from 'react';

import { DiaryEntryCard } from '@entities/diary';
import { useSuspenseInfiniteDiaries } from '@entities/diary';
import { formatMonthDay, useLoadMoreOnIntersect } from '@shared/lib';

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
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteDiaries(roomId);

  const diaries = data.pages.flatMap((page) => page.content);

  const loadMoreDiaries = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  useLoadMoreOnIntersect({
    enabled: Boolean(hasNextPage),
    isLoading: isFetchingNextPage,
    onLoadMore: loadMoreDiaries,
    targetRef: loadMoreRef,
  });

  return (
    <div className="relative flex-1 min-h-0">
      <div className="bg-[#f5f6f8] flex flex-col gap-2 h-full overflow-auto pt-[14px] px-[14px] pb-[80px]">
        {diaries.length === 0 && !isFetchingNextPage && (
          <div className="flex flex-col items-center justify-center flex-1 py-20 gap-1.5">
            <p className="text-[#1c2333] text-[15px] font-bold">아직 일기가 없어요</p>
            <p className="text-[#9ca3af] text-[13px]">일기를 작성해보세요!</p>
          </div>
        )}
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
        <div ref={loadMoreRef} className="min-h-1 shrink-0">
          {isFetchingNextPage && (
            <div className="py-3 text-center text-[#9ca3af] text-[12px]">
              일기를 더 불러오는 중...
            </div>
          )}
        </div>
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
