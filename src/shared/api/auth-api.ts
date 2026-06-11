import type { ApiResponse } from './types';
import { http } from './http';
import { unwrapApiResponse } from './error';
import { ENDPOINTS } from './endpoints';

export interface MeResponse {
  id: number;
  name: string;
  email: string;
}

export async function getMe(): Promise<MeResponse> {
  const res = await http.get<ApiResponse<MeResponse>>(ENDPOINTS.users.me);
  return unwrapApiResponse(res.data);
}
