import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse } from '@shared/api';
import { DiaryQueryKeys } from './_keys';
import type { DiaryDetailDto } from './useDiary';

export interface CreateDiaryRequestBody {
  title: string;
  content: string;
  diaryDate: string;
  imageKeys: string[];
}

export async function createDiary(
  roomId: number,
  body: CreateDiaryRequestBody,
): Promise<DiaryDetailDto> {
  const res = await http.post<ApiResponse<DiaryDetailDto>>(ENDPOINTS.diaries.create(roomId), body);
  return unwrapApiResponse(res.data);
}

export function useCreateDiary(roomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDiaryRequestBody) => createDiary(roomId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DiaryQueryKeys.listsByRoom(roomId) });
    },
  });
}
