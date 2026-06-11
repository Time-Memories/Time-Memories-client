import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse, CursorPaginationParams } from '@shared/api';
import { ChatQueryKeys } from './_keys';

export type ChatMessageType = 'TEXT' | 'IMAGE';

const CHAT_IMAGE_BASE_URL = (
  (import.meta.env.VITE_IMAGE_BASE_URL as string | undefined) ??
  'https://d2u0ocp0437og0.cloudfront.net'
).replace(/\/+$/, '');

export function resolveChatImageUrl(imageKey: string): string {
  if (/^https?:\/\//.test(imageKey)) return imageKey;
  return `${CHAT_IMAGE_BASE_URL}/${imageKey.replace(/^\/+/, '')}`;
}

export interface ChatDto {
  chatId: number;
  senderId: number;
  senderName: string;
  type: ChatMessageType;
  content: string | null;
  imageKeys: string[];
  createdAt: string;
}

export interface GetChatsResponseBody {
  messages: ChatDto[];
  hasNext: boolean;
  nextCursor: number | null;
}

export async function getChats(
  roomId: number,
  params?: CursorPaginationParams,
): Promise<GetChatsResponseBody> {
  const res = await http.get<ApiResponse<GetChatsResponseBody>>(ENDPOINTS.chats.list(roomId), {
    params,
  });
  return unwrapApiResponse(res.data);
}

export function useChats(roomId: number, size = 20) {
  return useInfiniteQuery({
    queryKey: ChatQueryKeys.list(roomId),
    queryFn: ({ pageParam }) => getChats(roomId, { cursor: pageParam as number | undefined, size }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: roomId > 0,
  });
}

export function useSuspenseChats(roomId: number, size = 20) {
  return useSuspenseInfiniteQuery({
    queryKey: ChatQueryKeys.list(roomId),
    queryFn: ({ pageParam }) => getChats(roomId, { cursor: pageParam as number | undefined, size }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}
