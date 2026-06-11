import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse } from '@shared/api';
import { DiaryQueryKeys } from './_keys';

export interface CreateCommentRequestBody {
  content: string;
}

export interface CreateCommentResponseBody {
  commentId: number;
  content: string;
}

export async function createComment(
  diaryId: number,
  body: CreateCommentRequestBody,
): Promise<CreateCommentResponseBody> {
  const res = await http.post<ApiResponse<CreateCommentResponseBody>>(
    ENDPOINTS.comments.create(diaryId),
    body,
  );
  return unwrapApiResponse(res.data);
}

export function useCreateComment(diaryId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => createComment(diaryId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DiaryQueryKeys.comments(diaryId) });
    },
  });
}
