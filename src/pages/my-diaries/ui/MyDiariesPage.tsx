import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useSuspenseInfiniteMyDiaries } from '@entities/diary';
import { useLoadMoreOnIntersect } from '@shared/lib';
import { AsyncBoundary } from '@shared/ui';

export default function MyDiariesPage() {
  return (
    <AsyncBoundary fallbackVariant="screen" errorVariant="screen">
      <MyDiariesContent />
    </AsyncBoundary>
  );
}

function MyDiariesContent() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteMyDiaries(
    year,
    month,
  );

  const diaries = data.pages.flatMap((p) => p.content);

  const loadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  useLoadMoreOnIntersect({
    enabled: Boolean(hasNextPage),
    isLoading: isFetchingNextPage,
    onLoadMore: loadMore,
    targetRef: loadMoreRef,
  });

  const goPrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <div className="flex flex-col h-svh bg-[#f5f6f8]">
      <div className="shrink-0 flex items-center justify-between px-4 pt-3.5 pb-3.75 bg-white border-b border-[#eceef2]">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center size-9">
          <ChevronLeft size={22} color="#1c2333" strokeWidth={2} />
        </button>
        <span className="text-[#1c2333] text-[15px] font-bold">나의 일기</span>
        <div className="size-9" />
      </div>

      <div className="shrink-0 flex items-center justify-between px-5 py-3 bg-white border-b border-[#eceef2]">
        <button onClick={goPrevMonth} className="p-1">
          <ChevronLeft size={18} color="#4b5563" strokeWidth={1.5} />
        </button>
        <span className="text-[#1c2333] text-[14px] font-semibold">
          {year}년 {month}월
        </span>
        <button onClick={goNextMonth} disabled={isCurrentMonth} className="p-1 disabled:opacity-30">
          <ChevronRight size={18} color="#4b5563" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0 px-4 py-3.5 flex flex-col gap-2">
        {diaries.length === 0 && !isFetchingNextPage && (
          <div className="flex flex-col items-center justify-center flex-1 py-20 gap-1.5">
            <p className="text-[#1c2333] text-[15px] font-bold">아직 일기가 없어요</p>
            <p className="text-[#9ca3af] text-[13px]">일기를 작성해보세요!</p>
          </div>
        )}

        {diaries.map((diary) => (
          <button
            key={diary.diaryId}
            onClick={() => navigate(`/rooms/${diary.room.roomId}/diaries/${diary.diaryId}`)}
            className="bg-white border border-[#eceef2] rounded-xl px-4 py-3.5 flex flex-col gap-1.5 text-left hover:bg-[#fafbfc] transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#1c2333] text-[14.5px] font-medium leading-snug flex-1 min-w-0 truncate">
                {diary.title}
              </span>
              <span className="text-[#9ca3af] text-[11.5px] shrink-0">
                {diary.writtenDate.slice(5).replace('-', '/')}
              </span>
            </div>
            <span className="text-[#9ca3af] text-[12px]">{diary.room.roomName}</span>
          </button>
        ))}

        <div ref={loadMoreRef} className="min-h-1 shrink-0">
          {isFetchingNextPage && (
            <div className="py-3 text-center text-[#9ca3af] text-[12px]">
              일기를 더 불러오는 중...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
