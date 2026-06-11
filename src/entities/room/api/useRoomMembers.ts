import {
  useInfiniteQuery,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse, CursorPaginationParams, CursorPaginationResponse } from '@shared/api';
import { RoomQueryKeys } from './_keys';

export type MemberRole = 'OWNER' | 'MEMBER';

export interface MemberDto {
  userId: number;
  name: string;
  role: MemberRole;
}

export async function getRoomMembers(
  roomId: number,
  params?: CursorPaginationParams,
): Promise<CursorPaginationResponse<MemberDto>> {
  const res = await http.get<
    ApiResponse<{ members: MemberDto[]; nextCursor: number | null; hasNext: boolean }>
  >(ENDPOINTS.rooms.members(roomId), { params });
  const data = unwrapApiResponse(res.data);
  return { content: data.members, nextCursor: data.nextCursor, hasNext: data.hasNext };
}

export function useRoomMembers(roomId: number) {
  return useQuery({
    queryKey: RoomQueryKeys.members(roomId),
    queryFn: () => getRoomMembers(roomId, { size: 100 }),
    enabled: roomId > 0,
  });
}

export function useSuspenseRoomMembers(roomId: number) {
  return useSuspenseQuery({
    queryKey: RoomQueryKeys.members(roomId),
    queryFn: () => getRoomMembers(roomId, { size: 100 }),
  });
}

export function useInfiniteRoomMembers(roomId: number, size = 20) {
  return useInfiniteQuery({
    queryKey: [...RoomQueryKeys.members(roomId), 'infinite', size],
    queryFn: ({ pageParam }) =>
      getRoomMembers(roomId, { cursor: pageParam as number | undefined, size }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: roomId > 0,
  });
}

export function useSuspenseInfiniteRoomMembers(roomId: number, size = 20) {
  return useSuspenseInfiniteQuery({
    queryKey: [...RoomQueryKeys.members(roomId), 'infinite', size],
    queryFn: ({ pageParam }) =>
      getRoomMembers(roomId, { cursor: pageParam as number | undefined, size }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}
