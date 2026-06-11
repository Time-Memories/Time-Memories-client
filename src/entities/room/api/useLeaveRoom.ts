import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS } from '@shared/api';
import { RoomQueryKeys } from './_keys';

export async function leaveRoom(roomId: number): Promise<void> {
  await http.delete(ENDPOINTS.rooms.leave(roomId));
}

export function useLeaveRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: number) => leaveRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RoomQueryKeys.lists() });
    },
  });
}
