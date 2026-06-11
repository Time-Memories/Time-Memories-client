export const RoomQueryKeys = {
  all: () => ['rooms'] as const,
  lists: () => [...RoomQueryKeys.all(), 'list'] as const,
  detail: (roomId: number) => [...RoomQueryKeys.all(), 'detail', roomId] as const,
  members: (roomId: number) => [...RoomQueryKeys.all(), 'members', roomId] as const,
};
