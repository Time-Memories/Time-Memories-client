import { useState } from 'react';

import { isSameDay } from '@shared/lib';

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

export interface MiniCalendarProps {
  markedDates?: Date[];
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
}

export const MiniCalendar = ({
  markedDates = [],
  selectedDate,
  onDateSelect,
}: MiniCalendarProps) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) => isSameDay(new Date(year, month, day), today);

  const isFuture = (day: number) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date(today);
    t.setHours(0, 0, 0, 0);
    return d > t;
  };

  const isMarked = (day: number) =>
    markedDates.some((d) => isSameDay(d, new Date(year, month, day)));

  const isSelected = (day: number) =>
    selectedDate ? isSameDay(selectedDate, new Date(year, month, day)) : false;

  return (
    <div className="px-3.5 pt-2.5">
      <div className="flex items-center justify-between pb-2.5 pt-1.5 px-1">
        <span className="text-[#1c2333] text-[15px] font-bold">
          {year}년 {month + 1}월
        </span>
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="text-[#4b5563] text-[14px] leading-none px-1"
          >
            ‹
          </button>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="text-[#4b5563] text-[14px] leading-none px-1"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1.5">
        {WEEKDAYS.map((day) => (
          <div key={day} className="flex justify-center">
            <span className="text-[#9ca3af] text-[11px]">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, index) => {
          if (day === null) return <div key={index} />;

          const marked = isMarked(day);
          const todayDay = isToday(day);
          const future = isFuture(day);
          const selected = isSelected(day);

          const highlighted = marked || selected;

          return (
            <button
              key={index}
              onClick={() => onDateSelect?.(new Date(year, month, day))}
              className={`relative flex flex-col items-center justify-center py-[10.5px] rounded-lg ${
                highlighted ? 'bg-[#1c2333]' : todayDay ? 'bg-[#f5f6f8]' : ''
              }`}
            >
              <span
                className={`text-[13px] ${
                  highlighted
                    ? 'text-white font-bold'
                    : todayDay
                      ? 'text-[#1c2333] font-bold'
                      : future
                        ? 'text-[#cbd0d8] font-medium'
                        : 'text-[#1c2333] font-medium'
                }`}
              >
                {day}
              </span>
              {highlighted && (
                <div className="absolute bottom-[5px] size-[3px] rounded-[1.5px] bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
