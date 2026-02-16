import axios from 'axios';
import { tokenStorage, authEvents } from '../utils/tokenStorage';

// Vite exposes env via import.meta.env; prefer VITE_API_BASE_URL
// Default includes /api prefix as the backend mounts APIs under /api
const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000/api';

const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export type LoginPayload = { email: string; password: string; context?: 'dms' | 'ticketflow' };

export const authService = {
  async login(payload: LoginPayload) {
    const resp = await authAxios.post('/auth/login', payload);
    const data = resp?.data || {};

    // Support different API shapes:
    // - { accessToken, refreshToken, user }
    // - { tokens: { accessToken, refreshToken }, user }
    const accessToken = data?.accessToken || data?.tokens?.accessToken || data?.tokens?.access_token;
    const refreshToken = data?.refreshToken || data?.tokens?.refreshToken || data?.tokens?.refresh_token;
    const user = data?.user || data?.data?.user;

    tokenStorage.setTokens({ accessToken, refreshToken });
    authEvents.emit('login');
    return { user, accessToken, refreshToken };
  },

  async refreshToken() {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');
    const resp = await authAxios.post('/auth/refresh', { refreshToken });
    const data = resp.data || resp.data?.data || {};
    const accessToken = data?.accessToken || data?.tokens?.accessToken || data?.tokens?.access_token;
    const newRefresh = data?.refreshToken || data?.tokens?.refreshToken || data?.tokens?.refresh_token;
    tokenStorage.setTokens({ accessToken, refreshToken: newRefresh });
    authEvents.emit('refresh');
    return data;
  },

  async logout(serverSide = true) {
    const refreshToken = tokenStorage.getRefreshToken();
    console.debug('[authService.logout] serverSide=', serverSide, 'refreshToken=', refreshToken);
    try {
      if (serverSide) {
        // Always attempt to POST the current refresh token if available
        const resp = await authAxios.post('/auth/logout', { refreshToken });
        console.debug('[authService.logout] logout request sent', resp.status);
        tokenStorage.clear();
        console.debug('[authService.logout] tokens cleared');
        const message = resp?.data?.message || resp?.data?.data?.message || 'Signed out';
        return { ok: true, status: resp.status, message, data: resp.data };
      } else {
        tokenStorage.clear();
        console.debug('[authService.logout] tokens cleared (client only)');
        return { ok: true, status: 200, message: 'Signed out (client)' };
      }
    } catch (e: any) {
      console.warn('logout request failed', e);
      // ensure tokens are cleared client-side even if server call failed
      try { tokenStorage.clear(); } catch {}
      const message = e?.response?.data?.message || e?.message || 'Logout failed';
      return { ok: false, status: e?.response?.status, message, error: e };
    }
  },

  async forgotPassword(email: string) {
    return authAxios.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string) {
    return authAxios.post('/auth/reset-password', { token, newPassword });
  },

  async getCurrentUser() {
    // lazy import to avoid circular deps with api client
    const { apiClient } = await import('../api/axios');
    const resp = await apiClient.get('/auth/me');
    return resp.data?.data;
  }
};

