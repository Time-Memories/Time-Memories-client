export type ApiResult = 'SUCCESS' | 'FAIL';

export interface ApiResponse<T> {
  result: ApiResult;
  data: T;
  code?: string;
  message?: string;
}

export interface BackendErrorPayload {
  state?: number;
  code?: string;
  message?: string;
}

export interface BackendErrorEnvelope {
  error?: BackendErrorPayload;
  code?: string;
  message?: string;
  result?: ApiResult;
}

export interface ApiErrorInfo {
  status: number;
  code?: string;
  message: string;
  result?: ApiResult;
}

export interface CursorPaginationParams {
  cursor?: number;
  size?: number;
}

export interface PagePaginationParams {
  page?: number;
  size?: number;
}

export interface PagePaginationResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface CursorPaginationResponse<T> {
  content: T[];
  nextCursor: number | null;
  hasNext: boolean;
}

export type PartialUpdate<T> = Partial<T>;
