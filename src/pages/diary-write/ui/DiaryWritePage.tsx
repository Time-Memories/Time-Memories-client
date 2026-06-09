import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Image, Plus } from 'lucide-react';

import { formatKoreanDate } from '@shared/lib';

export default function DiaryWritePage() {
  const navigate = useNavigate();
  const [date] = useState(new Date());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photoColors] = useState(['#fde2dc', '#dde7f6']);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = () => {
    // TODO: API 연동 후 저장 처리
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-svh bg-white">
      {/* 헤더 */}
      <div className="shrink-0 flex items-center justify-between px-4 pt-3.5 pb-3.75 border-b border-[#eceef2]">
        <button onClick={handleCancel} className="text-[#4b5563] text-[14px] min-w-10">
          취소
        </button>
        <span className="text-[#1c2333] text-[15px] font-bold">새 일기</span>
        <button
          onClick={handleSave}
          className="text-[#1c2333] text-[14px] font-bold min-w-10 text-right"
        >
          저장
        </button>
      </div>

      {/* 폼 */}
      <div className="flex-1 overflow-auto min-h-0 px-4.5 py-4 flex flex-col gap-3.5">
        {/* 일자 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#4b5563] text-[11.3px] font-medium">일자</label>
          <div className="bg-white border border-[#e5e7eb] rounded-xl px-3.75 py-3.25 flex items-center justify-between">
            <span className="text-[#1c2333] text-[14px]">{formatKoreanDate(date)}</span>
            <Calendar size={16} color="#9ca3af" />
          </div>
        </div>

        {/* 제목 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#4b5563] text-[11.3px] font-medium">제목</label>
          <div className="bg-white border border-[#e5e7eb] rounded-xl px-3.75 py-3.25">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full text-[13.3px] text-[#1c2333] placeholder:text-[#9ca3af] outline-none bg-transparent"
            />
          </div>
        </div>

        {/* 사진 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#4b5563] text-[11.3px] font-medium">사진</label>
          <div className="flex gap-2 items-start flex-wrap">
            {photoColors.map((color, i) => (
              <div
                key={i}
                className="size-15 rounded-[10px] shrink-0"
                style={{ backgroundColor: color }}
              />
            ))}
            <button className="size-15 rounded-[10px] bg-[#f5f6f8] border border-dashed border-[#e5e7eb] flex items-center justify-center shrink-0">
              <Plus size={20} color="#9ca3af" />
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#4b5563] text-[11.3px] font-medium">내용</label>
          <div className="bg-white border border-[#e5e7eb] rounded-xl px-3.75 py-3.5 min-h-40">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘의 이야기를 기록해보세요..."
              className="w-full text-[13.3px] text-[#1c2333] placeholder:text-[#9ca3af] outline-none bg-transparent resize-none leading-[22.4px] min-h-32.5"
            />
          </div>
        </div>
      </div>

      {/* 하단 툴바 */}
      <div className="shrink-0 bg-[#f5f6f8] border-t border-[#eceef2] flex items-center gap-1.5 px-4 py-2.5">
        <button className="bg-white border border-[#eceef2] rounded-[14px] flex items-center gap-1.25 px-2.75 py-1.75">
          <Image size={12} color="#4b5563" />
          <span className="text-[#4b5563] text-[12px]">사진</span>
        </button>
        <button className="bg-white border border-[#eceef2] rounded-[14px] flex items-center px-2.75 py-1.75">
          <span className="text-[#4b5563] text-[11.8px]">😊 기분</span>
        </button>
        <button className="bg-white border border-[#eceef2] rounded-[14px] flex items-center px-2.75 py-1.75">
          <span className="text-[#4b5563] text-[12px]">📍 위치</span>
        </button>
      </div>
    </div>
  );
}
