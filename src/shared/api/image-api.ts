import type { ApiResponse } from './types';
import { http } from './http';
import { unwrapApiResponse } from './error';
import { ENDPOINTS } from './endpoints';

export type ImageContentType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/gif'
  | 'image/heic';

export interface FileRequest {
  fileName: string;
  contentType: ImageContentType;
}

export interface UploadInfo {
  imageKey: string;
  presignedUrl: string;
  imageUrl: string;
  expiresIn: number;
}

export interface PresignedUrlResponse {
  uploads: UploadInfo[];
}

const IMAGE_BASE_URL = (
  (import.meta.env.VITE_IMAGE_BASE_URL as string | undefined) ??
  'https://d2u0ocp0437og0.cloudfront.net'
).replace(/\/+$/, '');

export function resolveImageUrl(imageKey: string): string {
  if (/^https?:\/\//.test(imageKey)) return imageKey;
  return `${IMAGE_BASE_URL}/${imageKey.replace(/^\/+/, '')}`;
}

export function getImageKeyFromUrl(imageUrlOrKey: string): string {
  if (!/^https?:\/\//.test(imageUrlOrKey)) {
    return imageUrlOrKey.replace(/^\/+/, '');
  }

  try {
    return decodeURIComponent(new URL(imageUrlOrKey).pathname.replace(/^\/+/, ''));
  } catch {
    return imageUrlOrKey;
  }
}

export async function getPresignedUrls(files: FileRequest[]): Promise<UploadInfo[]> {
  const res = await http.post<ApiResponse<PresignedUrlResponse>>(ENDPOINTS.images.presigned, {
    files,
  });
  return unwrapApiResponse(res.data).uploads;
}

export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  let response: Response;

  try {
    response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
  } catch (error) {
    throw new Error(
      error instanceof TypeError
        ? '이미지 업로드에 실패했습니다.'
        : '이미지 업로드 중 오류가 발생했습니다.',
      { cause: error },
    );
  }

  if (!response.ok) {
    throw new Error(`이미지 업로드에 실패했습니다. (${response.status})`);
  }
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const fileRequests: FileRequest[] = files.map((f) => ({
    fileName: f.name,
    contentType: f.type as ImageContentType,
  }));

  const uploads = await getPresignedUrls(fileRequests);

  await Promise.all(uploads.map((upload, i) => uploadToS3(upload.presignedUrl, files[i])));

  return uploads.map((u) => u.imageKey);
}
