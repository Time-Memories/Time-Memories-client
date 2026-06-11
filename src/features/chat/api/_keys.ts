export const ChatQueryKeys = {
  all: () => ['chats'] as const,
  list: (roomId: number) => [...ChatQueryKeys.all(), 'list', roomId] as const,
};
