import { ENDPOINTS } from './endpoints';
import { http } from './http';

export async function getHealth(): Promise<unknown> {
  const res = await http.get<unknown>(ENDPOINTS.health);
  return res.data;
}
