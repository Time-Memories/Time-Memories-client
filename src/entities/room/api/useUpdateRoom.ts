import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse } from '@shared/api';
import { RoomQueryKeys } from './_keys';

export interface UpdateRoomRequestBody {
  title: string;
}

export interface UpdateRoomResponseBody {
  title: string;
}

export async function updateRoom(
  roomId: number,
  body: UpdateRoomRequestBody,
): Promise<UpdateRoomResponseBody> {
  const res = await http.patch<ApiResponse<UpdateRoomResponseBody>>(
    ENDPOINTS.rooms.update(roomId),
    body,
  );
  return unwrapApiResponse(res.data);
}

export function useUpdateRoom(roomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateRoomRequestBody) => updateRoom(roomId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RoomQueryKeys.detail(roomId) });
      queryClient.invalidateQueries({ queryKey: RoomQueryKeys.lists() });
    },
  });
}
