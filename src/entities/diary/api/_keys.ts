export const DiaryQueryKeys = {
  all: () => ['diaries'] as const,
  listsByRoom: (roomId: number) => [...DiaryQueryKeys.all(), 'room', roomId] as const,
  detail: (diaryId: number) => [...DiaryQueryKeys.all(), 'detail', diaryId] as const,
  myAll: (year: number, month: number, day?: number) =>
    [...DiaryQueryKeys.all(), 'my-all', year, month, day] as const,
  calendarCounts: (year: number, month: number) =>
    [...DiaryQueryKeys.all(), 'calendar-counts', year, month] as const,
  comments: (diaryId: number) => [...DiaryQueryKeys.all(), 'comments', diaryId] as const,
};
