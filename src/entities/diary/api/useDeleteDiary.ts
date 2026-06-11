import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS } from '@shared/api';
import { DiaryQueryKeys } from './_keys';

export async function deleteDiary(diaryId: number): Promise<void> {
  await http.delete(ENDPOINTS.diaries.delete(diaryId));
}

export function useDeleteDiary(roomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (diaryId: number) => deleteDiary(diaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DiaryQueryKeys.listsByRoom(roomId) });
    },
  });
}
