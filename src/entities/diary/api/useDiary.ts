import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse } from '@shared/api';
import { DiaryQueryKeys } from './_keys';

export interface DiaryDetailDto {
  diaryId: number;
  authorId: number;
  authorName: string;
  title: string;
  content: string;
  diaryDate: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export async function getDiary(diaryId: number): Promise<DiaryDetailDto> {
  const res = await http.get<ApiResponse<DiaryDetailDto>>(ENDPOINTS.diaries.detail(diaryId));
  return unwrapApiResponse(res.data);
}

export function useDiary(diaryId: number) {
  return useQuery({
    queryKey: DiaryQueryKeys.detail(diaryId),
    queryFn: () => getDiary(diaryId),
    enabled: diaryId > 0,
  });
}

export function useSuspenseDiary(diaryId: number) {
  return useSuspenseQuery({
    queryKey: DiaryQueryKeys.detail(diaryId),
    queryFn: () => getDiary(diaryId),
  });
}
