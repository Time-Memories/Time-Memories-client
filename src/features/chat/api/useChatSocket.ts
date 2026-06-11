import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import {
  createStompClient,
  WS_ERROR_QUEUE,
  WS_PUBLISH_PREFIX,
  WS_SUBSCRIBE_PREFIX,
} from '@shared/api';
import type { Client } from '@stomp/stompjs';
import type { ChatDto, GetChatsResponseBody } from './useChats';
import { ChatQueryKeys } from './_keys';

export type ChatSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WebSocketErrorResponse {
  type: string;
  message: string;
  code: string;
}

interface ChatDeletedResponse {
  chatId: number;
}

function getStompErrorMessage(message?: string): string {
  if (message?.includes('clientInboundChannel')) {
    return '채팅 서버 인증에 실패했습니다. WebSocket 인증 설정을 확인해주세요.';
  }

  return message ?? '채팅 서버 오류가 발생했습니다.';
}

export function useChatSocket(roomId: number) {
  const queryClient = useQueryClient();
  const clientRef = useRef<Client | null>(null);
  const [status, setStatus] = useState<ChatSocketStatus>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let didUnmount = false;

    if (roomId <= 0) {
      queueMicrotask(() => {
        if (!didUnmount) {
          setStatus('disconnected');
          setErrorMessage(null);
        }
      });
      return () => {
        didUnmount = true;
      };
    }

    const client = createStompClient();
    clientRef.current = client;
    let hadStompError = false;

    client.beforeConnect = () => {
      if (!didUnmount) {
        setStatus('connecting');
        setErrorMessage(null);
      }
    };

    client.onConnect = () => {
      const removeMessageFromCache = (chatId: number) => {
        queryClient.setQueryData<InfiniteData<GetChatsResponseBody>>(
          ChatQueryKeys.list(roomId),
          (old) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                messages: page.messages.filter((message) => message.chatId !== chatId),
              })),
            };
          },
        );
      };

      client.subscribe(`${WS_SUBSCRIBE_PREFIX}/${roomId}`, (frame) => {
        try {
          const msg = JSON.parse(frame.body) as ChatDto;
          queryClient.setQueryData<InfiniteData<GetChatsResponseBody>>(
            ChatQueryKeys.list(roomId),
            (old) => {
              if (!old) {
                return {
                  pages: [{ messages: [msg], hasNext: false, nextCursor: null }],
                  pageParams: [undefined],
                };
              }

              if (
                old.pages.some((page) => page.messages.some((item) => item.chatId === msg.chatId))
              ) {
                return old;
              }

              const [first, ...rest] = old.pages;
              return {
                ...old,
                pages: [{ ...first, messages: [msg, ...first.messages] }, ...rest],
              };
            },
          );
        } catch (error) {
          console.error('Failed to parse chat message.', error);
        }
      });

      client.subscribe(`${WS_SUBSCRIBE_PREFIX}/${roomId}/updates`, (frame) => {
        try {
          const deleted = JSON.parse(frame.body) as ChatDeletedResponse;
          removeMessageFromCache(deleted.chatId);
        } catch (error) {
          console.error('Failed to parse chat update.', error);
        }
      });

      client.subscribe(WS_ERROR_QUEUE, (frame) => {
        try {
          const errorResponse = JSON.parse(frame.body) as WebSocketErrorResponse;
          setErrorMessage(errorResponse.message || '메시지를 보내지 못했습니다.');
        } catch (error) {
          console.error('Failed to parse chat error.', error);
          setErrorMessage('메시지를 보내지 못했습니다.');
        }
      });

      if (!didUnmount) {
        setStatus('connected');
        setErrorMessage(null);
      }
    };

    client.onStompError = (frame) => {
      console.error('STOMP broker error.', frame.headers.message, frame.body);
      hadStompError = true;
      if (!didUnmount) {
        setStatus('error');
        setErrorMessage(getStompErrorMessage(frame.headers.message));
      }
      void client.deactivate();
    };

    client.onWebSocketError = (event) => {
      console.error('WebSocket error.', event);
      if (!didUnmount) {
        setStatus('error');
        setErrorMessage('채팅 서버에 연결하지 못했습니다.');
      }
    };

    client.onWebSocketClose = () => {
      if (hadStompError) return;
      if (!didUnmount) {
        setStatus(client.active ? 'connecting' : 'disconnected');
      }
    };

    client.activate();

    return () => {
      didUnmount = true;
      void client.deactivate();
      clientRef.current = null;
    };
  }, [roomId, queryClient]);

  const send = useCallback(
    (content: string): boolean => {
      const client = clientRef.current;
      if (!client?.connected) {
        setErrorMessage('채팅 서버에 연결 중입니다. 잠시 후 다시 보내주세요.');
        return false;
      }

      try {
        client.publish({
          destination: `${WS_PUBLISH_PREFIX}/${roomId}/chats`,
          body: JSON.stringify({ content }),
        });
        setErrorMessage(null);
        return true;
      } catch (error) {
        console.error('Failed to publish chat message.', error);
        setStatus('error');
        setErrorMessage('메시지를 보내지 못했습니다. 다시 시도해주세요.');
        return false;
      }
    },
    [roomId],
  );

  const sendImages = useCallback(
    (imageKeys: string[]): boolean => {
      const client = clientRef.current;
      if (!client?.connected) {
        setErrorMessage('채팅 서버에 연결 중입니다. 잠시 후 다시 보내주세요.');
        return false;
      }

      if (imageKeys.length === 0) {
        setErrorMessage('전송할 이미지를 선택해주세요.');
        return false;
      }

      try {
        client.publish({
          destination: `${WS_PUBLISH_PREFIX}/${roomId}/chats/images`,
          body: JSON.stringify({ imageKeys }),
        });
        setErrorMessage(null);
        return true;
      } catch (error) {
        console.error('Failed to publish chat images.', error);
        setStatus('error');
        setErrorMessage('이미지를 보내지 못했습니다. 다시 시도해주세요.');
        return false;
      }
    },
    [roomId],
  );

  return { send, sendImages, status, errorMessage };
}
