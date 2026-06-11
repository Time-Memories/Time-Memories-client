import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS } from '@shared/api';
import { RoomQueryKeys } from './_keys';

export async function deleteRoom(roomId: number): Promise<void> {
  await http.delete(ENDPOINTS.rooms.delete(roomId));
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: number) => deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RoomQueryKeys.lists() });
    },
  });
}
