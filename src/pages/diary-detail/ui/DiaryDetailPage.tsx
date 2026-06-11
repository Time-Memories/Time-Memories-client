import { useCallback, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Pencil, Send, Trash2 } from 'lucide-react';

import {
  useSuspenseDiary,
  useSuspenseInfiniteComments,
  useCreateComment,
  useDeleteComment,
  useDeleteDiary,
  useUpdateComment,
} from '@entities/diary';
import { useAuthStore } from '@shared/model';
import { formatKoreanDate, useLoadMoreOnIntersect } from '@shared/lib';
import { AsyncBoundary, ConfirmSheet } from '@shared/ui';

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
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const loadMoreCommentsRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((s) => s.user);

  const { data: diary } = useSuspenseDiary(diaryId);
  const {
    data: commentsData,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
  } = useSuspenseInfiniteComments(diaryId);
  const createCommentMutation = useCreateComment(diaryId);
  const updateCommentMutation = useUpdateComment(diaryId);
  const deleteCommentMutation = useDeleteComment(diaryId);
  const deleteDiaryMutation = useDeleteDiary(roomId);

  const comments = commentsData.pages.flatMap((page) => page.content);

  const loadMoreComments = useCallback(() => {
    void fetchNextCommentsPage();
  }, [fetchNextCommentsPage]);

  useLoadMoreOnIntersect({
    enabled: Boolean(hasNextCommentsPage),
    isLoading: isFetchingNextCommentsPage,
    onLoadMore: loadMoreComments,
    targetRef: loadMoreCommentsRef,
  });

  const handleBack = () => {
    navigate(`/rooms/${roomId}`);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    createCommentMutation.mutate(commentText.trim(), {
      onSuccess: () => setCommentText(''),
    });
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    deleteDiaryMutation.mutate(diaryId, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate(`/rooms/${roomId}`);
      },
    });
  };

  const handleStartEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(content);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleUpdateComment = () => {
    if (!editingCommentId || !editingCommentText.trim()) return;

    updateCommentMutation.mutate(
      { commentId: editingCommentId, content: editingCommentText.trim() },
      {
        onSuccess: handleCancelEditComment,
      },
    );
  };

  const handleDeleteComment = (commentId: number) => {
    setDeleteCommentId(commentId);
  };

  const handleDeleteCommentConfirm = () => {
    if (!deleteCommentId) return;
    deleteCommentMutation.mutate(deleteCommentId, {
      onSuccess: () => setDeleteCommentId(null),
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
                        onClick={handleDeleteClick}
                        disabled={deleteDiaryMutation.isPending}
                        className="flex items-center gap-2.5 px-4 py-3 w-full text-left hover:bg-[#f5f6f8] transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} color="#1c2333" strokeWidth={1.5} />
                        <span className="text-[#1c2333] text-[13.5px]">삭제</span>
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
                  <div className="flex items-center gap-1.5 mb-0.75 min-w-0">
                    <span className="text-[#1c2333] text-[12px] font-bold shrink-0">
                      {comment.authorNickname}
                    </span>
                    <span className="text-[#9ca3af] text-[11px] shrink-0">
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    {user?.userId === comment.authorId &&
                      editingCommentId !== comment.commentId && (
                        <div className="ml-auto flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleStartEditComment(comment.commentId, comment.content)
                            }
                            className="text-[#9ca3af] text-[11px]"
                          >
                            수정
                          </button>
                          <span className="text-[#d1d5db] text-[10px]">|</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.commentId)}
                            disabled={deleteCommentMutation.isPending}
                            className="text-[#1c2333] text-[11px] disabled:opacity-45"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                  </div>
                  {editingCommentId === comment.commentId ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateComment()}
                        className="min-w-0 flex-1 rounded-[10px] border border-[#e5e7eb] bg-white px-2.5 py-1.5 text-[12.5px] text-[#1c2333] outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleUpdateComment}
                        disabled={updateCommentMutation.isPending || !editingCommentText.trim()}
                        className="rounded-[9px] bg-[#1c2333] px-2.5 py-1.5 text-[11.5px] font-semibold text-white disabled:opacity-40"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditComment}
                        className="rounded-[9px] px-1.5 py-1.5 text-[11.5px] text-[#9ca3af]"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <p className="text-[#1c2333] text-[12.5px] leading-[18.85px]">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={loadMoreCommentsRef} className="min-h-1">
              {isFetchingNextCommentsPage && (
                <div className="py-2 text-center text-[#9ca3af] text-[11.5px]">
                  댓글을 더 불러오는 중...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmSheet
          title="일기를 삭제할까요?"
          description="삭제한 일기는 복구할 수 없어요."
          confirmLabel="삭제"
          destructive
          isPending={deleteDiaryMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}

      {deleteCommentId !== null && (
        <ConfirmSheet
          title="댓글을 삭제할까요?"
          confirmLabel="삭제"
          destructive
          isPending={deleteCommentMutation.isPending}
          onConfirm={handleDeleteCommentConfirm}
          onClose={() => setDeleteCommentId(null)}
        />
      )}

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
