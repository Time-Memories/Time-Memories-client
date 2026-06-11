import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse } from '@shared/api';
import { RoomQueryKeys } from './_keys';
import type { RoomType } from './useRooms';

export interface CreateRoomRequestBody {
  title: string;
  type: RoomType;
}

export interface CreateRoomResponseBody {
  roomId: number;
  title: string;
  type: RoomType;
  roomCode: string;
  createdAt: string;
}

export async function createRoom(body: CreateRoomRequestBody): Promise<CreateRoomResponseBody> {
  const res = await http.post<ApiResponse<CreateRoomResponseBody>>(ENDPOINTS.rooms.create, body);
  return unwrapApiResponse(res.data);
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RoomQueryKeys.lists() });
    },
  });
}
