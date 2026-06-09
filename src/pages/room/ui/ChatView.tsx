import { SendHorizontal } from 'lucide-react';
import { useRef, useState } from 'react';

import type { ChatMessage } from '../model/types';

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderId: 'minho',
    senderName: '민호',
    senderColor: '#fde2dc',
    text: '한라산 일기 봤어, 진짜 부럽다 ㅋㅋ',
    isMe: false,
  },
  {
    id: '2',
    senderId: 'minho',
    senderName: '민호',
    senderColor: '#fde2dc',
    text: '사진 너무 잘 나왔는데?',
    isMe: false,
  },
  {
    id: '3',
    senderId: 'me',
    senderName: '나',
    senderColor: '',
    text: '고마워 ㅎㅎ 다음엔 같이 가자',
    isMe: true,
    time: '오후 2:14',
    readCount: 0,
  },
  {
    id: '4',
    senderId: 'sua',
    senderName: '수아',
    senderColor: '#e5e7eb',
    text: '나도 ㅠㅠ 7월 같이 가요',
    isMe: false,
  },
];

const DATE_LABEL = '2026.05.18';

export const ChatView = () => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setInputValue('');
  };

  return (
    <div className="bg-[#f5f6f8] flex flex-col flex-1 min-h-0 relative">
      <div className="flex flex-col gap-[10px] overflow-auto pb-[80px] pt-[14px] px-[14px] flex-1">
        <div className="flex justify-center py-1">
          <div className="bg-[#f5f6f8] px-[10px] py-[3px] rounded-[10px]">
            <span className="text-[#9ca3af] text-[11px]">{DATE_LABEL}</span>
          </div>
        </div>

        {MOCK_MESSAGES.map((message, index) => {
          const prevMessage = MOCK_MESSAGES[index - 1];
          const isSameAuthorAsPrev = prevMessage && prevMessage.senderId === message.senderId;

          if (message.isMe) {
            return (
              <div key={message.id} className="flex flex-col items-end">
                <div className="flex flex-col gap-[2px] items-start">
                  <div className="bg-[#1c2333] rounded-bl-[14px] rounded-br-[4px] rounded-tl-[14px] rounded-tr-[14px] px-3 py-[8px] max-w-[200px]">
                    <p className="text-white text-[12.5px] font-normal leading-[18.2px] break-words text-right whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </div>
                  <div className="flex justify-end w-full">
                    <span className="text-[#9ca3af] text-[9.4px]">읽음 · {message.time}</span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className="flex items-end gap-2">
              {!isSameAuthorAsPrev ? (
                <div
                  className="rounded-[14px] shrink-0 size-7"
                  style={{ backgroundColor: message.senderColor }}
                />
              ) : (
                <div className="shrink-0 w-7" />
              )}

              <div className="flex flex-col gap-[3px] items-start">
                {!isSameAuthorAsPrev && (
                  <span className="text-[#9ca3af] text-[11px]">{message.senderName}</span>
                )}
                <div className="bg-white border border-[#eceef2] rounded-bl-[4px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[14px] px-3 py-[8px] max-w-[200px]">
                  <p className="text-[#1c2333] text-[12.5px] font-normal leading-[18.2px] break-words whitespace-pre-wrap">
                    {message.text}
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
