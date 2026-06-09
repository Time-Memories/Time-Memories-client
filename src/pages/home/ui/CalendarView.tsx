import { Lock, Users } from 'lucide-react';
import { useState } from 'react';

import type { CalendarDiaryEntry } from '../model/types';
import { MiniCalendar } from './MiniCalendar';

const today = new Date();

const makeDate = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() - daysAgo);
  return d;
};

const MOCK_DIARY_ENTRIES: CalendarDiaryEntry[] = [
  {
    id: '1',
    title: '제주도 여행 첫날',
    roomName: '제주도 여행 🌴',
    isPrivate: false,
    date: makeDate(2),
  },
  {
    id: '2',
    title: '한강에서 산책',
    roomName: '나의 일기장',
    isPrivate: true,
    date: makeDate(6),
  },
];

const MARKED_DATES = MOCK_DIARY_ENTRIES.map((e) => e.date);

const formatDate = (date: Date) => {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}.${d}`;
};

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const visibleEntries = selectedDate
    ? MOCK_DIARY_ENTRIES.filter(
        (e) =>
          e.date.getFullYear() === selectedDate.getFullYear() &&
          e.date.getMonth() === selectedDate.getMonth() &&
          e.date.getDate() === selectedDate.getDate(),
      )
    : MOCK_DIARY_ENTRIES;

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <MiniCalendar
        markedDates={MARKED_DATES}
        selectedDate={selectedDate}
        onDateSelect={(date) =>
          setSelectedDate((prev) => (prev?.toDateString() === date.toDateString() ? null : date))
        }
      />

      <div className="border-t border-[#eceef2] mt-[10px]">
        <div className="px-[16px] pt-[29px] pb-[6px]">
          <span className="text-[#4b5563] text-[11.4px] font-medium">이번 달 일기</span>
        </div>

        <div className="flex flex-col divide-y divide-[#eceef2]">
          {visibleEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between px-[16px] pb-[8px] pt-[9px]"
            >
              <div className="flex flex-col gap-[4px]">
                <span className="text-[#1c2333] text-[13.3px] font-bold">{entry.title}</span>
                <div className="flex items-center gap-[2px]">
                  {entry.isPrivate ? (
                    <Lock size={11} color="#9ca3af" strokeWidth={1.5} />
                  ) : (
                    <Users size={11} color="#9ca3af" strokeWidth={1.5} />
                  )}
                  <span className="text-[#9ca3af] text-[11px]"> {entry.roomName}</span>
                </div>
              </div>
              <span className="text-[#9ca3af] text-[11px] font-mono">{formatDate(entry.date)}</span>
            </div>
          ))}

          {visibleEntries.length === 0 && (
            <div className="px-[16px] py-[24px] text-center text-[#9ca3af] text-[13px]">
              이 날의 일기가 없어요
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
