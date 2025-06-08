import { v4 as uuidv4 } from 'uuid';
import API_CLIENT, { SUPABASE_URL } from '../client';
import { BUCKETS } from '../constants';
import type { ApiResponseFile } from './types';

export interface UploadFilePayload {
  file: File;
  bucket: string;
  fileName?: string;
}
export const uploadFile = async ({
  file,
  bucket = BUCKETS.POSTERS,
  fileName,
}: UploadFilePayload): Promise<ApiResponseFile> => {
  if (!file || !bucket) {
    throw new Error('file and bucket are required');
  }

  const extension = file?.name?.split('.')?.pop();
  const name = fileName || `${uuidv4()}.${extension || 'jpg'}`;
  const path = `/${name}`;

  const { data, error } = await API_CLIENT.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    throw error;
  }

  return {
    success: true,
    path: generateUploadedFileUrl(data.fullPath) || null,
    error: null,
  };
};

export const generateUploadedFileUrl = (path: string): string => {
  if (!path) return '';
  return `${SUPABASE_URL}/storage/v1/object/public//${path}`;
};
