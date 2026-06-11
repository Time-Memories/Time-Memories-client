import type { ApiResponse } from './types';
import { http } from './http';
import { unwrapApiResponse } from './error';
import { ENDPOINTS } from './endpoints';

export interface EditMeRequestBody {
  name: string;
}

export interface EditMeResponseBody {
  userId: number;
  name: string;
}

export async function editMe(body: EditMeRequestBody): Promise<EditMeResponseBody> {
  const res = await http.patch<ApiResponse<EditMeResponseBody>>(ENDPOINTS.users.me, body);
  return unwrapApiResponse(res.data);
}

export async function deleteMe(): Promise<void> {
  await http.delete(ENDPOINTS.users.me);
}
