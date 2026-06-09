import { MessageCircle, Pencil } from 'lucide-react';

import type { DiaryEntry } from '../model/types';
import { DiaryEntryCard } from './DiaryEntryCard';

const MOCK_DIARIES: DiaryEntry[] = [
  { id: '1', title: '제주도 여행 첫날', author: '지원', date: '05.15', thumbnailColor: '#fde2dc' },
  { id: '2', title: '함덕 해변에서', author: '민호', date: '05.16', thumbnailColor: '#dde7f6' },
  { id: '3', title: '흑돼지 맛집 후기', author: '수아', date: '05.16', thumbnailColor: '#fff1cc' },
  { id: '4', title: '한라산 등반 성공!', author: '나', date: '05.17', thumbnailColor: '#e5e7eb' },
];

export interface DiaryListViewProps {
  onChatOpen: () => void;
  onAddDiary: () => void;
}

export const DiaryListView = ({ onChatOpen, onAddDiary }: DiaryListViewProps) => {
  return (
    <div className="relative flex-1 min-h-0">
      <div className="bg-[#f5f6f8] flex flex-col gap-2 h-full overflow-auto pt-[14px] px-[14px] pb-[80px]">
        {MOCK_DIARIES.map((diary) => (
          <DiaryEntryCard
            key={diary.id}
            title={diary.title}
            author={diary.author}
            date={diary.date}
            thumbnailColor={diary.thumbnailColor}
          />
        ))}
      </div>

      <div className="absolute bottom-[80px] right-4 flex flex-col gap-2">
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
