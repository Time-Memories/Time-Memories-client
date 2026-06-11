import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse, CursorPaginationResponse } from '@shared/api';
import { DiaryQueryKeys } from './_keys';

export interface MyDiaryItem {
  diaryId: number;
  authorId: number;
  authorName: string;
  title: string;
  writtenDate: string;
  room: {
    roomId: number;
    roomName: string;
    roomType: 'PRIVATE' | 'GROUP';
  };
}

export interface GetMyDiariesRequestBody {
  year: number;
  month: number;
  day?: number;
  cursor?: number;
  size?: number;
}

export async function getMyDiaries(
  params: GetMyDiariesRequestBody,
): Promise<CursorPaginationResponse<MyDiaryItem>> {
  const res = await http.get<
    ApiResponse<{ content: MyDiaryItem[]; nextCursor: number | null; hasNext: boolean }>
  >(ENDPOINTS.diaries.myAll, { params });
  const data = unwrapApiResponse(res.data);
  return { content: data.content, nextCursor: data.nextCursor, hasNext: data.hasNext };
}

export function useMyDiaries(year: number, month: number, day?: number) {
  return useQuery({
    queryKey: DiaryQueryKeys.myAll(year, month, day),
    queryFn: () => getMyDiaries({ year, month, day }),
    enabled: year > 0 && month > 0,
  });
}

export function useSuspenseMyDiaries(year: number, month: number, day?: number) {
  return useSuspenseQuery({
    queryKey: DiaryQueryKeys.myAll(year, month, day),
    queryFn: () => getMyDiaries({ year, month, day }),
  });
}
