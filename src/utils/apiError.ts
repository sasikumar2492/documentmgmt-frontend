import { toast } from '../components/ui/sonner';
import type { AxiosError } from 'axios';

type ExtractedApiError = {
  code?: string;
  message: string;
  status?: number;
  raw?: any;
};

export function extractApiError(err: any): ExtractedApiError {
  if (!err) return { message: 'An unexpected error occurred' };

  const response = (err as AxiosError)?.response || err?.response;
  const data = response?.data ?? err?.data ?? {};

  const code =
    data?.error?.code ||
    data?.code ||
    data?.errorCode ||
    data?.error?.status ||
    undefined;

  const message =
    data?.error?.message ||
    data?.message ||
    err?.message ||
    String(err) ||
    'An unexpected error occurred';

  const status = response?.status;

  return { code, message, status, raw: err };
}

export function showApiError(err: any, options?: { defaultMessage?: string; duration?: number }) {
  const { code, message } = extractApiError(err);
  const displayMessage = message || options?.defaultMessage || 'An unexpected error occurred';
  const description = code ? `${code}` : undefined;
  toast.error(displayMessage, { description, duration: options?.duration });
  return { code, message: displayMessage };
}

