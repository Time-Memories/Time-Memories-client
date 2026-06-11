import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS } from '@shared/api';
import { DiaryQueryKeys } from './_keys';

export async function deleteComment(commentId: number): Promise<void> {
  await http.delete(ENDPOINTS.comments.delete(commentId));
}

export function useDeleteComment(diaryId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DiaryQueryKeys.comments(diaryId) });
    },
  });
}
