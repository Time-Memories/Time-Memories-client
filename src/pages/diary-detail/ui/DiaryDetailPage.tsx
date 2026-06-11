import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Pencil, Send, Trash2 } from 'lucide-react';

import {
  useSuspenseDiary,
  useSuspenseComments,
  useCreateComment,
  useDeleteDiary,
} from '@entities/diary';
import { useAuthStore } from '@shared/model';
import { formatKoreanDate } from '@shared/lib';
import { AsyncBoundary } from '@shared/ui';

export default function DiaryDetailPage() {
  const { roomId, diaryId } = useParams();
  const roomIdNum = Number(roomId);
  const diaryIdNum = Number(diaryId);

  if (
    !Number.isInteger(roomIdNum) ||
    roomIdNum <= 0 ||
    !Number.isInteger(diaryIdNum) ||
    diaryIdNum <= 0
  ) {
    return <Navigate to="/404" replace />;
  }

  return (
    <AsyncBoundary
      fallbackVariant="screen"
      errorVariant="screen"
      resetKeys={[roomIdNum, diaryIdNum]}
    >
      <DiaryDetailContent roomId={roomIdNum} diaryId={diaryIdNum} />
    </AsyncBoundary>
  );
}

interface DiaryDetailContentProps {
  roomId: number;
  diaryId: number;
}

function DiaryDetailContent({ roomId, diaryId }: DiaryDetailContentProps) {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const user = useAuthStore((s) => s.user);

  const { data: diary } = useSuspenseDiary(diaryId);
  const { data: commentsData } = useSuspenseComments(diaryId);
  const createCommentMutation = useCreateComment(diaryId);
  const deleteDiaryMutation = useDeleteDiary(roomId);

  const comments = commentsData?.content ?? [];

  const handleBack = () => {
    navigate(`/rooms/${roomId}`);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    createCommentMutation.mutate(commentText.trim(), {
      onSuccess: () => setCommentText(''),
    });
  };

  const handleDelete = () => {
    setShowMenu(false);
    deleteDiaryMutation.mutate(diaryId, {
      onSuccess: () => navigate(`/rooms/${roomId}`),
    });
  };

  const isMyDiary = user?.userId === diary.authorId;
  const thumbnailUrl = diary.imageUrls[0];

  return (
    <div className="flex flex-col h-svh bg-white">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="relative">
          <div
            className="w-full"
            style={
              thumbnailUrl ? undefined : { backgroundColor: '#e5e7eb', aspectRatio: '304 / 276' }
            }
          >
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={diary.title}
                className="w-full object-cover"
                style={{ aspectRatio: '304 / 276' }}
              />
            ) : null}
          </div>

          {diary.imageUrls.length > 0 && (
            <div className="absolute top-3.5 right-3.5 bg-[rgba(15,20,30,0.6)] px-2 py-0.75 rounded-[10px]">
              <span className="text-white text-[11px] font-mono">1 / {diary.imageUrls.length}</span>
            </div>
          )}

          <div className="absolute top-11.5 left-0 right-0 flex items-center justify-between px-3.5">
            <button
              onClick={handleBack}
              className="backdrop-blur-xs bg-white/85 rounded-[10px] flex items-center justify-center size-9"
            >
              <ChevronLeft size={18} color="#1c2333" strokeWidth={2} />
            </button>
            {isMyDiary && (
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
                          navigate(`/rooms/${roomId}/diaries/${diaryId}/edit`);
                        }}
                        className="flex items-center gap-2.5 px-4 py-3 w-full text-left hover:bg-[#f5f6f8] transition-colors"
                      >
                        <Pencil size={14} color="#1c2333" strokeWidth={1.5} />
                        <span className="text-[#1c2333] text-[13.5px]">수정</span>
                      </button>
                      <div className="h-px bg-[#eceef2] mx-3" />
                      <button
                        onClick={handleDelete}
                        disabled={deleteDiaryMutation.isPending}
                        className="flex items-center gap-2.5 px-4 py-3 w-full text-left hover:bg-[#fff5f5] transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} color="#ef4444" strokeWidth={1.5} />
                        <span className="text-[#ef4444] text-[13.5px]">삭제</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-4.5 pt-7.5 flex flex-col gap-0.75">
          <p className="text-[#9ca3af] text-[11.4px]">
            {formatKoreanDate(new Date(diary.diaryDate))}
          </p>

          <h1 className="text-[#1c2333] text-[20.6px] font-bold leading-[27.5px] mt-0.75">
            {diary.title}
          </h1>

          <div className="flex items-center gap-2 pt-2.75">
            <div className="size-6.5 rounded-full shrink-0 bg-[#e5e7eb]" />
            <div className="flex flex-col">
              <span className="text-[#1c2333] text-[13px] font-bold leading-[1.3]">
                {diary.authorName}
              </span>
            </div>
          </div>

          <div className="pt-2.5 flex flex-col gap-5.5">
            {diary.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#1c2333] text-[13.3px] leading-[23.1px]">
                {para}
              </p>
            ))}
          </div>

          {diary.imageUrls.length > 1 && (
            <div className="flex gap-1.5 items-start pt-2.75">
              {diary.imageUrls.slice(1, 3).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="size-15.5 rounded-[10px] shrink-0 object-cover"
                />
              ))}
              {diary.imageUrls.length > 3 && (
                <div className="size-15.5 rounded-[10px] bg-[#dde7f6] flex items-center justify-center shrink-0">
                  <span className="text-[#4b5563] text-[13px] font-bold">
                    +{diary.imageUrls.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4.75">
            <span className="text-[#1c2333] text-[14px] font-bold">댓글</span>
            <span className="text-[#9ca3af] text-[12px]">{comments.length}</span>
          </div>

          <div className="flex flex-col gap-2.25 pt-1.75 pb-4">
            {comments.map((comment) => (
              <div key={comment.commentId} className="flex gap-2.5 items-start">
                <div className="size-7 rounded-full shrink-0 mt-px bg-[#e5e7eb]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.75">
                    <span className="text-[#1c2333] text-[12px] font-bold">
                      {comment.authorNickname}
                    </span>
                    <span className="text-[#9ca3af] text-[11px]">
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-[#1c2333] text-[12.5px] leading-[18.85px]">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-2.5 pb-4 pt-2.5 bg-white border-t border-[#e5e7eb]">
        <div className="relative bg-white border border-[#e5e7eb] rounded-3xl h-13 flex items-center pl-4 pr-2.5">
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
            disabled={createCommentMutation.isPending || !commentText.trim()}
            className="bg-[#1c2333] rounded-[15.5px] h-8.5 w-7 flex items-center justify-center ml-2 shrink-0 disabled:opacity-40"
          >
            <Send size={14} color="white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
