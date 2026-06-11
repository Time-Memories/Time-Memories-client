import { useInfiniteQuery } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse, CursorPaginationParams } from '@shared/api';
import { ChatQueryKeys } from './_keys';

export type ChatMessageType = 'TEXT' | 'IMAGE';

export interface ChatDto {
  chatId: number;
  senderId: number;
  senderName: string;
  type: ChatMessageType;
  content: string;
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
