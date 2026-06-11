import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse, CursorPaginationParams } from '@shared/api';
import { DiaryQueryKeys } from './_keys';

export interface CommentItem {
  commentId: number;
  authorId: number;
  authorNickname: string;
  content: string;
  createdAt: string;
}

export async function getComments(
  diaryId: number,
  params?: CursorPaginationParams,
): Promise<{ content: CommentItem[]; nextCursor: number | null; hasNext: boolean }> {
  const res = await http.get<
    ApiResponse<{ content: CommentItem[]; nextCursor: number | null; hasNext: boolean }>
  >(ENDPOINTS.comments.list(diaryId), { params });
  const data = unwrapApiResponse(res.data);
  return { content: data.content, nextCursor: data.nextCursor, hasNext: data.hasNext };
}

export function useComments(diaryId: number) {
  return useQuery({
    queryKey: DiaryQueryKeys.comments(diaryId),
    queryFn: () => getComments(diaryId, { size: 100 }),
    enabled: diaryId > 0,
  });
}

export function useSuspenseComments(diaryId: number) {
  return useSuspenseQuery({
    queryKey: DiaryQueryKeys.comments(diaryId),
    queryFn: () => getComments(diaryId, { size: 100 }),
  });
}
