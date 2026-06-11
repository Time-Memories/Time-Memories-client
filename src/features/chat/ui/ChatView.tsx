import { Image as ImageIcon, LoaderCircle, Plus, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { resolveChatImageUrl, useSuspenseChats } from '../api/useChats';
import type { ChatDto } from '../api/useChats';
import { useChatSocket } from '../api/useChatSocket';
import { uploadImages } from '@shared/api';
import { useAuthStore } from '@shared/model';

interface ChatViewProps {
  roomId: number;
}

function ChatBubbleContent({ isMe, message }: { isMe: boolean; message: ChatDto }) {
  if (message.imageKeys.length > 0) {
    const isSingleImage = message.imageKeys.length === 1;

    return (
      <div
        className={`grid gap-1 overflow-hidden ${isSingleImage ? 'grid-cols-1 max-w-[210px]' : 'grid-cols-2 max-w-[204px]'}`}
      >
        {message.imageKeys.map((imageKey, index) => (
          <img
            key={`${message.chatId}-${imageKey}-${index}`}
            src={resolveChatImageUrl(imageKey)}
            alt={`채팅 이미지 ${index + 1}`}
            className={
              isSingleImage
                ? 'w-[210px] max-h-[260px] rounded-[14px] object-cover'
                : 'size-[100px] rounded-[10px] object-cover'
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={
        isMe
          ? 'bg-[#1c2333] rounded-bl-[14px] rounded-br-[4px] rounded-tl-[14px] rounded-tr-[14px] px-3 py-[8px] max-w-[200px]'
          : 'bg-white border border-[#eceef2] rounded-bl-[4px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[14px] px-3 py-[8px] max-w-[200px]'
      }
    >
      <p
        className={
          isMe
            ? 'text-white text-[12.5px] font-normal leading-[18.2px] break-words text-right whitespace-pre-wrap'
            : 'text-[#1c2333] text-[12.5px] font-normal leading-[18.2px] break-words whitespace-pre-wrap'
        }
      >
        {message.content ?? ''}
      </p>
    </div>
  );
}

export const ChatView = ({ roomId }: ChatViewProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data } = useSuspenseChats(roomId);
  const user = useAuthStore((s) => s.user);
  const { send, sendImages, status, errorMessage } = useChatSocket(roomId);

  const allMessages = data.pages.flatMap((p) => p.messages);
  const isConnected = status === 'connected';
  const feedbackMessage = errorMessage ?? uploadErrorMessage;
  const isBusy = isUploading;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages.length]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const didSend = send(trimmed);
    if (!didSend) return;

    setUploadErrorMessage('');
    setInputValue('');
    inputRef.current?.focus();
  };

  const handlePhotoMenuClick = () => {
    setShowAttachmentMenu(false);
    fileInputRef.current?.click();
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (!files.length) return;
    if (!isConnected) {
      setUploadErrorMessage('채팅 서버에 연결된 뒤 사진을 보낼 수 있습니다.');
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith('image/')).slice(0, 5);
    if (imageFiles.length === 0) {
      setUploadErrorMessage('이미지 파일만 보낼 수 있습니다.');
      return;
    }

    setIsUploading(true);
    setUploadErrorMessage(files.length > 5 ? '사진은 최대 5장까지 보낼 수 있습니다.' : '');

    try {
      const imageKeys = await uploadImages(imageFiles);
      const didSend = sendImages(imageKeys);
      if (didSend) {
        setUploadErrorMessage('');
      }
    } catch (error) {
      setUploadErrorMessage(
        error instanceof Error ? error.message : '사진을 보내는 중 오류가 발생했습니다.',
      );
    } finally {
      setIsUploading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="bg-[#f5f6f8] flex flex-col flex-1 min-h-0 relative">
      <div className="flex flex-col gap-[10px] overflow-auto pb-[92px] pt-[14px] px-[14px] flex-1">
        {allMessages.map((message, index) => {
          const prevMessage = allMessages[index - 1];
          const isSameAuthorAsPrev = prevMessage && prevMessage.senderId === message.senderId;
          const isMe = user?.userId === message.senderId;

          if (isMe) {
            return (
              <div key={message.chatId} className="flex flex-col items-end">
                <div className="flex flex-col gap-[2px] items-start">
                  <ChatBubbleContent isMe={isMe} message={message} />
                </div>
              </div>
            );
          }

          return (
            <div key={message.chatId} className="flex items-end gap-2">
              {!isSameAuthorAsPrev ? (
                <div className="rounded-[14px] shrink-0 size-7 bg-[#e5e7eb]" />
              ) : (
                <div className="shrink-0 w-7" />
              )}

              <div className="flex flex-col gap-[3px] items-start">
                {!isSameAuthorAsPrev && (
                  <span className="text-[#9ca3af] text-[11px]">{message.senderName}</span>
                )}
                <ChatBubbleContent isMe={isMe} message={message} />
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {(status !== 'connected' || feedbackMessage || isUploading) && (
        <div className="absolute bottom-[68px] left-[14px] right-[14px] text-center text-[11px] text-[#9ca3af]">
          {feedbackMessage ??
            (isUploading ? '사진 업로드 중입니다...' : '채팅 서버에 연결 중입니다...')}
        </div>
      )}

      {showAttachmentMenu && (
        <div
          className="absolute inset-0 bg-[rgba(15,20,30,0.45)] flex items-end justify-center z-10"
          onClick={() => setShowAttachmentMenu(false)}
        >
          <div
            className="bg-white w-full pb-6 pt-5 px-5 rounded-tl-[22px] rounded-tr-[22px] flex flex-col gap-2 shadow-[0px_-16px_36px_-22px_rgba(15,20,30,0.8)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-center mb-1">
              <div className="bg-[#e0e3e8] h-1 rounded-sm w-9" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-[#1c2333] font-bold text-[16px]">보내기</span>
              <span className="text-[#9ca3af] text-[11.5px]">최대 5장</span>
            </div>

            <button
              type="button"
              onClick={handlePhotoMenuClick}
              disabled={!isConnected || isBusy}
              className="flex items-center gap-3 px-1 py-3.25 rounded-[14px] hover:bg-[#f5f6f8] disabled:opacity-45 transition-colors"
            >
              <div className="size-10 rounded-full bg-[#1c2333] flex items-center justify-center shrink-0">
                <ImageIcon size={17} color="white" strokeWidth={1.6} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[#1c2333] text-[14px] font-semibold">사진</span>
                <span className="text-[#9ca3af] text-[11.5px]">앨범에서 이미지를 선택해요</span>
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-[10px] right-[10px] bg-white border border-[#e5e7eb] rounded-[24px] h-[52px] flex items-center px-3">
        <button
          type="button"
          onClick={() => setShowAttachmentMenu(true)}
          disabled={!isConnected || isBusy}
          aria-label="첨부 메뉴 열기"
          className="rounded-full flex items-center justify-center size-8 shrink-0 disabled:opacity-45"
        >
          {isUploading ? (
            <LoaderCircle size={18} color="#9ca3af" strokeWidth={1.8} className="animate-spin" />
          ) : (
            <Plus size={20} color="#4b5563" strokeWidth={1.8} />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => void handleImageSelect(event)}
        />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={
            isUploading ? '사진 업로드 중...' : isConnected ? '메시지 보내기...' : '연결 중...'
          }
          className="flex-1 min-w-0 text-[12.2px] text-[#1c2333] placeholder:text-[#9ca3af] bg-transparent outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!isConnected || isBusy}
          aria-label="메시지 보내기"
          className="bg-[#1c2333] disabled:bg-[#c7ccd5] rounded-[15.5px] flex items-center justify-center h-[34px] w-7 shrink-0 transition-colors"
        >
          <SendHorizontal size={16} color="white" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};
