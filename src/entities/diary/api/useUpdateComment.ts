import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse } from '@shared/api';
import { DiaryQueryKeys } from './_keys';

export interface UpdateCommentRequestBody {
  content: string;
}

export interface UpdateCommentResponseBody {
  commentId: number;
  content: string;
}

export async function updateComment(
  commentId: number,
  body: UpdateCommentRequestBody,
): Promise<UpdateCommentResponseBody> {
  const res = await http.patch<ApiResponse<UpdateCommentResponseBody>>(
    ENDPOINTS.comments.update(commentId),
    body,
  );
  return unwrapApiResponse(res.data);
}

export function useUpdateComment(diaryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DiaryQueryKeys.comments(diaryId) });
    },
  });
}
