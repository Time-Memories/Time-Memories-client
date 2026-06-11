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
};
