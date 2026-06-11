import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Pencil, Send, Trash2 } from 'lucide-react';

import type { DiaryDetail } from '@entities/diary';

const MOCK_DIARY: DiaryDetail = {
  id: '4',
  title: '한라산 등반 성공!',
  author: '나',
  authorColor: '#dde7f6',
  date: '05.17',
  fullDate: '2026년 5월 17일 · 일요일',
  thumbnailColor: '#fde2dc',
  roomName: '제주도 여행 🌴',
  content:
    '새벽 5시에 출발. 입구부터 안개가 자욱해서 정상까진 못 갈 줄 알았는데, 한 시간쯤 오르니까 거짓말처럼 맑아졌다.\n\n백록담 보는 순간 진짜 울 뻔. 다리는 죽을 거 같았지만 내려올 땐 진달래밭이 너무 예뻐서 사진만 백장 찍었다.',
  imageCount: 3,
  photoColors: ['#e5e7eb', '#fff1cc'],
  extraPhotoCount: 3,
  comments: [
    {
      id: '1',
      authorName: '민호',
      authorColor: '#dde7f6',
      text: '진짜 부럽다 ㅋㅋ 사진 봐도 좋다',
      timeLabel: '2시간 전',
    },
    {
      id: '2',
      authorName: '수아',
      authorColor: '#e5e7eb',
      text: '다음에 꼭 같이 가자!!',
      timeLabel: '1시간 전',
    },
  ],
};

export default function DiaryDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const diary = MOCK_DIARY;

  const handleBack = () => {
    navigate(`/rooms/${roomId}`);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    setCommentText('');
  };

  return (
    <div className="flex flex-col h-svh bg-white">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="relative">
          <div
            className="w-full"
            style={{
              backgroundColor: diary.thumbnailColor,
              aspectRatio: '304 / 276',
            }}
          />

          <div className="absolute top-[14px] right-[14px] bg-[rgba(15,20,30,0.6)] px-2 py-[3px] rounded-[10px]">
            <span className="text-white text-[11px] font-mono">1 / {diary.imageCount}</span>
          </div>

          <div className="absolute top-[46px] left-0 right-0 flex items-center justify-between px-[14px]">
            <button
              onClick={handleBack}
              className="backdrop-blur-[4px] bg-white/85 rounded-[10px] flex items-center justify-center size-9"
            >
              <ChevronLeft size={18} color="#1c2333" strokeWidth={2} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="backdrop-blur-xs bg-white/85 rounded-[10px] flex items-center justify-center size-9"
              >
                <MoreHorizontal size={18} color="#1c2333" strokeWidth={2} />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute top-10.5 right-0 bg-white rounded-xl shadow-[0px_4px_16px_-2px_rgba(20,30,50,0.18)] border border-[#eceef2] overflow-hidden z-20 min-w-30">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        navigate(`/rooms/${roomId}/diaries/${diary.id}/edit`);
                      }}
                      className="flex items-center gap-2.5 px-4 py-3 w-full text-left hover:bg-[#f5f6f8] transition-colors"
                    >
                      <Pencil size={14} color="#1c2333" strokeWidth={1.5} />
                      <span className="text-[#1c2333] text-[13.5px]">수정</span>
                    </button>
                    <div className="h-px bg-[#eceef2] mx-3" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        // TODO: 삭제 API 연동
                        navigate(`/rooms/${roomId}`);
                      }}
                      className="flex items-center gap-2.5 px-4 py-3 w-full text-left hover:bg-[#fff5f5] transition-colors"
                    >
                      <Trash2 size={14} color="#ef4444" strokeWidth={1.5} />
                      <span className="text-[#ef4444] text-[13.5px]">삭제</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="px-[18px] pt-[30px] flex flex-col gap-[3px]">
          <p className="text-[#9ca3af] text-[11.4px]">{diary.fullDate}</p>

          <h1 className="text-[#1c2333] text-[20.6px] font-bold leading-[27.5px] mt-[3px]">
            {diary.title}
          </h1>

          <div className="flex items-center gap-2 pt-[11px]">
            <div
              className="size-[26px] rounded-full shrink-0"
              style={{ backgroundColor: diary.authorColor }}
            />
            <div className="flex flex-col">
              <span className="text-[#1c2333] text-[13px] font-bold leading-[1.3]">
                {diary.author}
              </span>
              <span className="text-[#9ca3af] text-[10.8px] leading-[1.3]">{diary.roomName}</span>
            </div>
          </div>
          <div className="pt-[10px] flex flex-col gap-[22px]">
            {diary.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#1c2333] text-[13.3px] leading-[23.1px]">
                {para}
              </p>
            ))}
          </div>

          <div className="flex gap-[6px] items-start pt-[11px]">
            {diary.photoColors.map((color, i) => (
              <div
                key={i}
                className="size-[62px] rounded-[10px] shrink-0"
                style={{ backgroundColor: color }}
              />
            ))}
            {diary.extraPhotoCount > 0 && (
              <div className="size-[62px] rounded-[10px] bg-[#dde7f6] flex items-center justify-center shrink-0">
                <span className="text-[#4b5563] text-[13px] font-bold">
                  +{diary.extraPhotoCount}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-[19px]">
            <span className="text-[#1c2333] text-[14px] font-bold">댓글</span>
            <span className="text-[#9ca3af] text-[12px]">{diary.comments.length}</span>
          </div>

          <div className="flex flex-col gap-[9px] pt-[7px] pb-[16px]">
            {diary.comments.map((comment) => (
              <div key={comment.id} className="flex gap-[10px] items-start">
                <div
                  className="size-[28px] rounded-full shrink-0 mt-[1px]"
                  style={{ backgroundColor: comment.authorColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[6px] mb-[3px]">
                    <span className="text-[#1c2333] text-[12px] font-bold">
                      {comment.authorName}
                    </span>
                    <span className="text-[#9ca3af] text-[11px]">{comment.timeLabel}</span>
                  </div>
                  <p className="text-[#1c2333] text-[12.5px] leading-[18.85px]">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-[10px] pb-4 pt-[10px] bg-white border-t border-[#e5e7eb]">
        <div className="relative bg-white border border-[#e5e7eb] rounded-[24px] h-[52px] flex items-center pl-4 pr-[10px]">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            placeholder="댓글 달기..."
            className="flex-1 text-[12.3px] text-[#1c2333] placeholder:text-[#9ca3af] outline-none bg-transparent"
          />
          <button
            onClick={handleSendComment}
            className="bg-[#1c2333] rounded-[15.5px] h-[34px] w-[28px] flex items-center justify-center ml-2 shrink-0"
          >
            <Send size={14} color="white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
