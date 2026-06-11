import type { ApiResponse } from './types';
import { http } from './http';
import { unwrapApiResponse } from './error';
import { ENDPOINTS } from './endpoints';

export interface GetMeResponseBody {
  userId: number;
  name: string;
  email: string;
  createdAt: string;
}

export async function getMe(): Promise<GetMeResponseBody> {
  const res = await http.get<ApiResponse<GetMeResponseBody>>(ENDPOINTS.users.me);
  return unwrapApiResponse(res.data);
}
