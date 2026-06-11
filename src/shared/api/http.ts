import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

import { ENDPOINTS } from './endpoints';
import { toApiClientError } from './error';

const FALLBACK_API_BASE_URL = 'http://localhost:8080';
const FALLBACK_TIMEOUT_MS = 10000;

const parsedTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS);
const timeoutMs = Number.isFinite(parsedTimeout) ? parsedTimeout : FALLBACK_TIMEOUT_MS;

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || FALLBACK_API_BASE_URL,
  timeout: timeoutMs,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

axiosRetry(http, {
  retries: 3,
  shouldResetTimeout: true,
  retryDelay: (retryCount) => axiosRetry.exponentialDelay(retryCount),
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    (error.response ? error.response.status >= 500 : false),
});

let unauthorizedHandler: ((status: number) => void) | null = null;

export function setUnauthorizedHandler(handler: ((status: number) => void) | null): void {
  unauthorizedHandler = handler;
}

let isRefreshing = false;
type QueueEntry = { resolve: () => void; reject: (err: unknown) => void };
const refreshQueue: QueueEntry[] = [];

interface RefreshableAxiosRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  _refreshed?: boolean;
}

interface RefreshableInternalAxiosRequestConfig<D = unknown> extends InternalAxiosRequestConfig<D> {
  _refreshed?: boolean;
}

function flushRefreshQueue(err: unknown): void {
  for (const entry of refreshQueue) {
    if (err) {
      entry.reject(err);
    } else {
      entry.resolve();
    }
  }
  refreshQueue.length = 0;
}

function toRefreshedConfig(
  config: RefreshableInternalAxiosRequestConfig,
): RefreshableAxiosRequestConfig {
  return { ...config, _refreshed: true };
}

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError<unknown, unknown>(error)) {
      return Promise.reject(toApiClientError(error));
    }

    const config: RefreshableInternalAxiosRequestConfig | undefined = error.config;
    const status = error.response?.status;
    const parsedError = toApiClientError(error);
    const isRefreshEndpoint = config?.url?.includes(ENDPOINTS.auth.refresh) ?? false;

    if (status === 401 && config && !config._refreshed && !isRefreshEndpoint) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then(() => http(toRefreshedConfig(config)))
          .catch(() => Promise.reject(parsedError));
      }

      isRefreshing = true;

      try {
        const baseURL = http.defaults.baseURL ?? FALLBACK_API_BASE_URL;
        await axios.post(`${baseURL}${ENDPOINTS.auth.refresh}`, undefined, {
          withCredentials: true,
        });

        flushRefreshQueue(null);
        return http(toRefreshedConfig(config));
      } catch (refreshErr) {
        flushRefreshQueue(refreshErr);
        unauthorizedHandler?.(401);
        return Promise.reject(parsedError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(parsedError);
  },
);
