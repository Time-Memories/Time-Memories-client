import { useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Calendar, Image, Plus, X } from 'lucide-react';

import { formatKoreanDate } from '@shared/lib';
import { useCreateDiary, useEditDiary, useSuspenseDiary } from '@entities/diary';
import type { DiaryDetailDto } from '@entities/diary';
import { getImageKeyFromUrl, uploadImages } from '@shared/api';
import { AsyncBoundary, LoadingDots } from '@shared/ui';

interface DiaryFormProps {
  roomId: number;
  diaryId?: number;
  initialData?: DiaryDetailDto;
}

function DiaryForm({ roomId, diaryId, initialData }: DiaryFormProps) {
  const navigate = useNavigate();
  const isEdit = !!diaryId;

  const [date] = useState(() => (initialData ? new Date(initialData.diaryDate) : new Date()));
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialData?.imageUrls ?? []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const createMutation = useCreateDiary(roomId);
  const editMutation = useEditDiary(diaryId ?? 0, roomId);

  const existingCount = (initialData?.imageUrls ?? []).length;
  const totalImages = previewUrls.length;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = 5 - totalImages;
    const selected = files.slice(0, remaining);
    setNewImages((prev) => [...prev, ...selected]);
    setPreviewUrls((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
  };

  const handleRemoveImage = (index: number) => {
    if (index < existingCount) {
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingCount;
      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setErrorMessage('');
    setIsUploading(true);
    try {
      const newKeys = newImages.length > 0 ? await uploadImages(newImages) : [];
      const initialImageUrls = initialData?.imageUrls ?? [];
      const initialImageUrlSet = new Set(initialImageUrls);
      const keptKeys = previewUrls
        .filter((url) => initialImageUrlSet.has(url))
        .map(getImageKeyFromUrl);
      const imageKeys = [...keptKeys, ...newKeys];
      const diaryDate = date.toISOString().split('T')[0];

      if (isEdit && diaryId) {
        await editMutation.mutateAsync({ title: title.trim(), content, diaryDate, imageKeys });
        navigate(`/rooms/${roomId}/diaries/${diaryId}`);
      } else {
        const created = await createMutation.mutateAsync({
          title: title.trim(),
          content,
          diaryDate,
          imageKeys,
        });
        navigate(`/rooms/${roomId}/diaries/${created.diaryId}`);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '일기를 저장하는 중 오류가 발생했습니다.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = isUploading || createMutation.isPending || editMutation.isPending;
  const isValid = title.trim().length > 0 && !isPending;

  return (
    <div className="flex flex-col h-svh bg-white">
      <div className="shrink-0 flex items-center justify-between px-4 pt-3.5 pb-3.75 border-b border-[#eceef2]">
        <button onClick={() => navigate(-1)} className="text-[#4b5563] text-[14px] min-w-10">
          취소
        </button>
        <span className="text-[#1c2333] text-[15px] font-bold">
          {isEdit ? '일기 수정' : '새 일기'}
        </span>
        <button
          onClick={() => void handleSave()}
          disabled={!isValid}
          className="text-[#1c2333] text-[14px] font-bold min-w-10 text-right disabled:text-[#9ca3af]"
        >
          저장
        </button>
      </div>

      <div className="relative flex-1 flex flex-col min-h-0">
        {isPending && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <LoadingDots />
          </div>
        )}

        <div className="flex-1 overflow-auto min-h-0 px-4.5 py-4 flex flex-col gap-3.5">
          {errorMessage && (
            <div className="rounded-[10px] bg-[#fff5f5] px-3.5 py-2.5 text-[12.5px] text-[#ef4444]">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[#4b5563] text-[11.3px] font-medium">일자</label>
            <div className="bg-white border border-[#e5e7eb] rounded-xl px-3.75 py-3.25 flex items-center justify-between">
              <span className="text-[#1c2333] text-[14px]">{formatKoreanDate(date)}</span>
              <Calendar size={16} color="#9ca3af" />
            </div>
          </div>

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

          <div className="flex flex-col gap-1.5">
            <label className="text-[#4b5563] text-[11.3px] font-medium">
              사진 ({totalImages}/5)
            </label>
            <div className="flex gap-2 items-start flex-wrap">
              {previewUrls.map((url, idx) => (
                <div key={url} className="relative size-15 shrink-0">
                  <img src={url} alt="" className="size-15 rounded-[10px] object-cover" />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-1.5 -right-1.5 size-4.5 rounded-full bg-[#1c2333] flex items-center justify-center"
                  >
                    <X size={10} color="white" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
              {totalImages < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="size-15 rounded-[10px] bg-[#f5f6f8] border border-dashed border-[#e5e7eb] flex items-center justify-center shrink-0"
                >
                  <Plus size={20} color="#9ca3af" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>
          </div>

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

        <div className="shrink-0 bg-[#f5f6f8] border-t border-[#eceef2] flex items-center gap-1.5 px-4 py-2.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border border-[#eceef2] rounded-[14px] flex items-center gap-1.25 px-2.75 py-1.75"
          >
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
    </div>
  );
}

export default function DiaryWritePage() {
  const { roomId, diaryId } = useParams();
  const roomIdNum = Number(roomId);
  const hasDiaryId = diaryId !== undefined;
  const diaryIdNum = hasDiaryId ? Number(diaryId) : 0;

  if (
    !Number.isInteger(roomIdNum) ||
    roomIdNum <= 0 ||
    (hasDiaryId && (!Number.isInteger(diaryIdNum) || diaryIdNum <= 0))
  ) {
    return <Navigate to="/404" replace />;
  }

  if (!hasDiaryId) {
    return <DiaryForm key="new" roomId={roomIdNum} />;
  }

  return (
    <AsyncBoundary
      fallbackVariant="screen"
      errorVariant="screen"
      resetKeys={[roomIdNum, diaryIdNum]}
    >
      <DiaryEditLoader roomId={roomIdNum} diaryId={diaryIdNum} />
    </AsyncBoundary>
  );
}

interface DiaryEditLoaderProps {
  roomId: number;
  diaryId: number;
}

function DiaryEditLoader({ roomId, diaryId }: DiaryEditLoaderProps) {
  const { data: existingDiary } = useSuspenseDiary(diaryId);

  return <DiaryForm key={diaryId} roomId={roomId} diaryId={diaryId} initialData={existingDiary} />;
}
