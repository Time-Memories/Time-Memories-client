const PUBLIC_API_PREFIX = '/api/v1';
const AUTH_API_PREFIX = '/api/auth';
const OAUTH_API_PREFIX = '/api/oauth';

export const ENDPOINTS = {
  health: `${PUBLIC_API_PREFIX}/health`,
  oauth: {
    authorizeGoogle: `${OAUTH_API_PREFIX}/authorize/google`,
    authorizeKakao: `${OAUTH_API_PREFIX}/authorize/kakao`,
  },
  auth: {
    logout: `${AUTH_API_PREFIX}/logout`,
    refresh: `${AUTH_API_PREFIX}/refresh`,
  },
  users: {
    me: '/api/users/me',
  },
  rooms: {
    list: '/api/rooms',
    create: '/api/rooms',
    join: '/api/rooms/join',
    detail: (roomId: number) => `/api/rooms/${roomId}`,
    update: (roomId: number) => `/api/rooms/${roomId}`,
    delete: (roomId: number) => `/api/rooms/${roomId}`,
    leave: (roomId: number) => `/api/rooms/${roomId}/leave`,
    members: (roomId: number) => `/api/rooms/${roomId}/members`,
  },
  diaries: {
    listByRoom: (roomId: number) => `/api/rooms/${roomId}/diaries`,
    create: (roomId: number) => `/api/rooms/${roomId}/diaries`,
    detail: (diaryId: number) => `/api/diaries/${diaryId}`,
    update: (diaryId: number) => `/api/diaries/${diaryId}`,
    delete: (diaryId: number) => `/api/diaries/${diaryId}`,
    myAll: '/api/diaries/my-all',
    calendarCounts: '/api/diaries/calendar/counts',
  },
  comments: {
    list: (diaryId: number) => `/api/diaries/${diaryId}/comments`,
    create: (diaryId: number) => `/api/diaries/${diaryId}/comments`,
    update: (commentId: number) => `/api/comments/${commentId}`,
    delete: (commentId: number) => `/api/comments/${commentId}`,
  },
  images: {
    presigned: '/api/images/presigned',
  },
  chats: {
    list: (roomId: number) => `/api/rooms/${roomId}/chats`,
    delete: (roomId: number, chatId: number) => `/api/rooms/${roomId}/chats/${chatId}`,
  },
};
