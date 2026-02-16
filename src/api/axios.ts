import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage, authEvents } from '../utils/tokenStorage';

// Vite: use import.meta.env for environment variables
// Default includes /api prefix so apiClient posts to e.g. http://localhost:4000/api/auth/refresh
const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (err: any) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else {
      if (token) p.config.headers = { ...p.config.headers, Authorization: `Bearer ${token}` };
      p.resolve(apiClient(p.config));
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  res => res,
  async (err: AxiosError & { config?: InternalAxiosRequestConfig }) => {
    const originalConfig = err.config;
    if (!originalConfig) return Promise.reject(err);

    if (err.response?.status === 401 && !(originalConfig as any)._retry) {
      (originalConfig as any)._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      isRefreshing = true;
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clear();
        isRefreshing = false;
        return Promise.reject(err);
      }

      try {
        const refreshResp = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken }, { headers: { 'Content-Type': 'application/json' } });
        const data = refreshResp.data?.data;
        const newAccess = data?.accessToken;
        const newRefresh = data?.refreshToken;
        tokenStorage.setTokens({ accessToken: newAccess, refreshToken: newRefresh });
        authEvents.emit('refresh');
        processQueue(null, newAccess);
        return apiClient({ ...originalConfig, headers: { ...originalConfig.headers, Authorization: `Bearer ${newAccess}` } });
      } catch (refreshErr) {
        processQueue(refreshErr, undefined);
        tokenStorage.clear();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

