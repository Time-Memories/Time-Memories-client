import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS, http } from '@shared/api';
import { ChatQueryKeys } from './_keys';

export async function deleteChat(roomId: number, chatId: number): Promise<void> {
  await http.delete(ENDPOINTS.chats.delete(roomId, chatId));
}

export function useDeleteChat(roomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: number) => deleteChat(roomId, chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ChatQueryKeys.list(roomId) });
    },
  });
}
