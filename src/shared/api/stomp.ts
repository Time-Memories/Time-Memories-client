import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const apiBase: string = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(
  /\/+$/,
  '',
);

export const WS_ENDPOINT = `${apiBase}/ws`;
export const WS_PUBLISH_PREFIX = '/app/rooms';
export const WS_SUBSCRIBE_PREFIX = '/topic/rooms';
export const WS_ERROR_QUEUE = '/user/queue/errors';

export function createStompClient(): Client {
  return new Client({
    webSocketFactory: () => new SockJS(WS_ENDPOINT),
    reconnectDelay: 3000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    connectionTimeout: 10000,
  });
}
