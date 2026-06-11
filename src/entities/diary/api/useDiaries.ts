import {
  useInfiniteQuery,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse, PagePaginationParams, PagePaginationResponse } from '@shared/api';
import { DiaryQueryKeys } from './_keys';

export interface DiaryDto {
  diaryId: number;
  authorId: number;
  authorName: string;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
}

export async function getDiaries(
  roomId: number,
  params?: PagePaginationParams,
): Promise<PagePaginationResponse<DiaryDto>> {
  const res = await http.get<ApiResponse<PagePaginationResponse<DiaryDto>>>(
    ENDPOINTS.diaries.listByRoom(roomId),
    { params },
  );
  return unwrapApiResponse(res.data);
}

export function useDiaries(roomId: number, page = 0, size = 20) {
  return useQuery({
    queryKey: [...DiaryQueryKeys.listsByRoom(roomId), page],
    queryFn: () => getDiaries(roomId, { page, size }),
    enabled: roomId > 0,
  });
}

export function useSuspenseDiaries(roomId: number, page = 0, size = 20) {
  return useSuspenseQuery({
    queryKey: [...DiaryQueryKeys.listsByRoom(roomId), page],
    queryFn: () => getDiaries(roomId, { page, size }),
  });
}

export function useInfiniteDiaries(roomId: number, size = 20) {
  return useInfiniteQuery({
    queryKey: [...DiaryQueryKeys.listsByRoom(roomId), 'infinite', size],
    queryFn: ({ pageParam }) => getDiaries(roomId, { page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pageNumber + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    enabled: roomId > 0,
  });
}

export function useSuspenseInfiniteDiaries(roomId: number, size = 20) {
  return useSuspenseInfiniteQuery({
    queryKey: [...DiaryQueryKeys.listsByRoom(roomId), 'infinite', size],
    queryFn: ({ pageParam }) => getDiaries(roomId, { page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pageNumber + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
  });
}
