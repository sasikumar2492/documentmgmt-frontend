import axios from 'axios';

export interface UploadDocxResponse {
  success: boolean;
  htmlContent: string;
  message?: string;
}

/**
 * Upload a .docx file to the backend for AI processing.
 * Sends multipart/form-data to POST /api/upload-docx and returns the parsed response.
 */
export async function uploadDocx(file: File): Promise<UploadDocxResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post('/api/upload-docx', formData, {
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

