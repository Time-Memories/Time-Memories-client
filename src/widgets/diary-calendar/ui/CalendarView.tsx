import { Lock, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatMonthDay, isSameDay } from '@shared/lib';
import { useCalendarCounts, useSuspenseMyDiaries } from '@entities/diary';
import { AsyncBoundary, LoadingDots } from '@shared/ui';

import { MiniCalendar } from './MiniCalendar';

export const CalendarView = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedDay = selectedDate ? selectedDate.getDate() : undefined;
  const { data: countData } = useCalendarCounts(year, month);

  const markedDates = (countData?.writtenDates ?? [])
    .filter((d) => d.count > 0)
    .map((d) => new Date(d.date));

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(null);
  };

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <MiniCalendar
        markedDates={markedDates}
        selectedDate={selectedDate}
        onDateSelect={(date) =>
          setSelectedDate((prev) => (prev && isSameDay(prev, date) ? null : date))
        }
        onMonthChange={handleMonthChange}
      />

      <div className="border-t border-[#eceef2] mt-2.5">
        <div className="px-4 pt-7.25 pb-1.5">
          <span className="text-[#4b5563] text-[11.4px] font-medium">
            {selectedDate ? `${month}월 ${selectedDate.getDate()}일 일기` : `${month}월 일기`}
          </span>
        </div>

        <AsyncBoundary
          fallback={<CalendarEntriesFallback />}
          fallbackVariant="inline"
          resetKeys={[year, month, selectedDay]}
        >
          <CalendarDiaryEntries year={year} month={month} selectedDay={selectedDay} />
        </AsyncBoundary>
      </div>
    </div>
  );
};

const CalendarEntriesFallback = () => (
  <div role="status" aria-live="polite" className="flex w-full items-center justify-center py-4">
    <LoadingDots />
    <span className="sr-only">일기를 불러오는 중...</span>
  </div>
);

interface CalendarDiaryEntriesProps {
  year: number;
  month: number;
  selectedDay?: number;
}

const CalendarDiaryEntries = ({ year, month, selectedDay }: CalendarDiaryEntriesProps) => {
  const navigate = useNavigate();
  const { data: diariesData } = useSuspenseMyDiaries(year, month, selectedDay);

  const entries = diariesData.content;

  return (
    <div className="flex flex-col divide-y divide-[#eceef2]">
      {entries.map((entry) => (
        <button
          key={entry.diaryId}
          onClick={() => navigate(`/rooms/${entry.room.roomId}/diaries/${entry.diaryId}`)}
          className="flex items-start justify-between px-4 pb-2 pt-2.25 w-full text-left hover:bg-[#fafbfc] transition-colors"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[#1c2333] text-[13.3px] font-bold">{entry.title}</span>
            <div className="flex items-center gap-0.5">
              {entry.room.roomType === 'PRIVATE' ? (
                <Lock size={11} color="#9ca3af" strokeWidth={1.5} />
              ) : (
                <Users size={11} color="#9ca3af" strokeWidth={1.5} />
              )}
              <span className="text-[#9ca3af] text-[11px]"> {entry.room.roomName}</span>
            </div>
          </div>
          <span className="text-[#9ca3af] text-[11px] font-mono">
            {formatMonthDay(new Date(entry.writtenDate))}
          </span>
        </button>
      ))}

      {entries.length === 0 && (
        <div className="px-4 py-6 text-center text-[#9ca3af] text-[13px]">
          이 날의 일기가 없어요
        </div>
      )}
    </div>
  );
};
