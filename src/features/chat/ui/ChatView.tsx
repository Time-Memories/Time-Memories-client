import { SendHorizontal } from 'lucide-react';
import { useRef, useState } from 'react';

import { useChats } from '../api/useChats';
import { useAuthStore } from '@shared/model';

interface ChatViewProps {
  roomId: number;
}

export const ChatView = ({ roomId }: ChatViewProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useChats(roomId);
  const user = useAuthStore((s) => s.user);

  const allMessages = data?.pages.flatMap((p) => p.messages) ?? [];

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setInputValue('');
  };

  return (
    <div className="bg-[#f5f6f8] flex flex-col flex-1 min-h-0 relative">
      <div className="flex flex-col gap-[10px] overflow-auto pb-[80px] pt-[14px] px-[14px] flex-1">
        {isLoading && (
          <div className="text-[#9ca3af] text-[11px] text-center py-4">불러오는 중...</div>
        )}

        {allMessages.map((message, index) => {
          const prevMessage = allMessages[index - 1];
          const isSameAuthorAsPrev = prevMessage && prevMessage.senderId === message.senderId;
          const isMe = user?.userId === message.senderId;

          if (isMe) {
            return (
              <div key={message.chatId} className="flex flex-col items-end">
                <div className="flex flex-col gap-[2px] items-start">
                  <div className="bg-[#1c2333] rounded-bl-[14px] rounded-br-[4px] rounded-tl-[14px] rounded-tr-[14px] px-3 py-[8px] max-w-[200px]">
                    <p className="text-white text-[12.5px] font-normal leading-[18.2px] break-words text-right whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
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
                <div className="bg-white border border-[#eceef2] rounded-bl-[4px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[14px] px-3 py-[8px] max-w-[200px]">
                  <p className="text-[#1c2333] text-[12.5px] font-normal leading-[18.2px] break-words whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-3 left-[10px] right-[10px] bg-white border border-[#e5e7eb] rounded-[24px] h-[52px] flex items-center px-4">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지 보내기..."
          className="flex-1 text-[12.2px] text-[#1c2333] placeholder:text-[#9ca3af] bg-transparent outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-[#1c2333] rounded-[15.5px] flex items-center justify-center h-[34px] w-7 shrink-0"
        >
          <SendHorizontal size={16} color="white" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};
