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

export async function getPresignedUrls(files: FileRequest[]): Promise<UploadInfo[]> {
  const res = await http.post<ApiResponse<PresignedUrlResponse>>(ENDPOINTS.images.presigned, {
    files,
  });
  return unwrapApiResponse(res.data).uploads;
}

export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
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
