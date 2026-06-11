import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse } from '@shared/api';
import { RoomQueryKeys } from './_keys';
import type { RoomType } from './useRooms';

export interface RoomDetailDto {
  roomId: number;
  title: string;
  type: RoomType;
  roomCode: string;
  owner: {
    ownerId: number;
    ownerName: string;
  };
  createdAt: string;
}

export async function getRoom(roomId: number): Promise<RoomDetailDto> {
  const res = await http.get<ApiResponse<RoomDetailDto>>(ENDPOINTS.rooms.detail(roomId));
  return unwrapApiResponse(res.data);
}

export function useRoom(roomId: number) {
  return useQuery({
    queryKey: RoomQueryKeys.detail(roomId),
    queryFn: () => getRoom(roomId),
    enabled: roomId > 0,
  });
}

export function useSuspenseRoom(roomId: number) {
  return useSuspenseQuery({
    queryKey: RoomQueryKeys.detail(roomId),
    queryFn: () => getRoom(roomId),
  });
}
