import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse } from '@shared/api';
import { RoomQueryKeys } from './_keys';

export interface JoinRoomRequestBody {
  roomCode: string;
}

export interface JoinRoomResponseBody {
  roomId: number;
  title: string;
}

export async function joinRoom(body: JoinRoomRequestBody): Promise<JoinRoomResponseBody> {
  const res = await http.post<ApiResponse<JoinRoomResponseBody>>(ENDPOINTS.rooms.join, body);
  return unwrapApiResponse(res.data);
}

export function useJoinRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RoomQueryKeys.lists() });
    },
  });
}
