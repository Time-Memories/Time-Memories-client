import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse } from '@shared/api';
import { DiaryQueryKeys } from './_keys';
import type { DiaryDetailDto } from './useDiary';

export interface EditDiaryRequestBody {
  title: string;
  content: string;
  diaryDate: string;
  imageKeys: string[];
}

export async function editDiary(
  diaryId: number,
  body: EditDiaryRequestBody,
): Promise<DiaryDetailDto> {
  const res = await http.put<ApiResponse<DiaryDetailDto>>(ENDPOINTS.diaries.update(diaryId), body);
  return unwrapApiResponse(res.data);
}

export function useEditDiary(diaryId: number, roomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: EditDiaryRequestBody) => editDiary(diaryId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DiaryQueryKeys.detail(diaryId) });
      queryClient.invalidateQueries({ queryKey: DiaryQueryKeys.listsByRoom(roomId) });
    },
  });
}
