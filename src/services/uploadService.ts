import { apiClient } from '../api/axios';

export interface UploadDocxResponse {
  success: boolean;
  htmlContent: string;
  message?: string;
}

/**
 * Upload a .docx file to the backend for AI processing.
 * Sends multipart/form-data to POST /api/upload-docx and returns the parsed response.
 */
export async function uploadDocx(file: File, meta?: { name?: string; description?: string; departmentId?: string; organizationId?: string }): Promise<UploadDocxResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (meta) {
    if (meta.name) formData.append('name', meta.name);
    if (meta.description) formData.append('description', meta.description);
    if (meta.departmentId) formData.append('departmentId', meta.departmentId);
    if (meta.organizationId) formData.append('organizationId', meta.organizationId);
  }

  try {
    const res = await apiClient.post('/templates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data as UploadDocxResponse;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err?.message || 'Network or server error';
    throw new Error(message);
  }
}

