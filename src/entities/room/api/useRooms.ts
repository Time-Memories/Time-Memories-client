import { useInfiniteQuery } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse, CursorPaginationParams, CursorPaginationResponse } from '@shared/api';
import { RoomQueryKeys } from './_keys';

export type RoomType = 'PRIVATE' | 'GROUP';

export interface RoomDto {
  roomId: number;
  title: string;
  type: RoomType;
  createdAt: string;
}

export async function getRooms(
  params?: CursorPaginationParams,
): Promise<CursorPaginationResponse<RoomDto>> {
  const res = await http.get<
    ApiResponse<{ rooms: RoomDto[]; nextCursor: number | null; hasNext: boolean }>
  >(ENDPOINTS.rooms.list, { params });
  const data = unwrapApiResponse(res.data);
  return { content: data.rooms, nextCursor: data.nextCursor, hasNext: data.hasNext };
}

export function useRooms(size = 20) {
  return useInfiniteQuery({
    queryKey: RoomQueryKeys.lists(),
    queryFn: ({ pageParam }) => getRooms({ cursor: pageParam as number | undefined, size }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}
