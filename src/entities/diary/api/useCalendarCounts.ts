import { useQuery } from '@tanstack/react-query';
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';
import type { ApiResponse } from '@shared/api';
import { DiaryQueryKeys } from './_keys';

export interface DateCount {
  date: string;
  count: number;
}

export interface GetCalendarCountsResponseBody {
  year: number;
  month: number;
  writtenDates: DateCount[];
}

export async function getCalendarCounts(params: {
  year: number;
  month: number;
}): Promise<GetCalendarCountsResponseBody> {
  const res = await http.get<ApiResponse<GetCalendarCountsResponseBody>>(
    ENDPOINTS.diaries.calendarCounts,
    { params },
  );
  return unwrapApiResponse(res.data);
}

export function useCalendarCounts(year: number, month: number) {
  return useQuery({
    queryKey: DiaryQueryKeys.calendarCounts(year, month),
    queryFn: () => getCalendarCounts({ year, month }),
    enabled: year > 0 && month > 0,
  });
}
