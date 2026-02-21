import { apiClient } from '../api/axios';

type KPIsResponse = {
  totalRequests?: number;
  totalApproved?: number;
  pendingApproval?: number;
  rejectedCount?: number;
  totalTemplates?: number;
  totalUsers?: number;
  totalDepartments?: number;
  approvalRatePercent?: number;
};

export const dashboardService = {
  async getKPIs(range = '30d'): Promise<KPIsResponse | null> {
    try {
      const resp = await apiClient.get(`/dashboard/kpis`, { params: { range } });
      return resp.data || null;
    } catch (err) {
      console.warn('[dashboardService] getKPIs failed', err);
      return null;
    }
  },

  async getRecentTemplates(limit = 10, range = '30d'): Promise<any | null> {
    try {
      const resp = await apiClient.get(`/dashboard/recent-templates`, { params: { limit, range } });
      return resp.data || null;
    } catch (err) {
      console.warn('[dashboardService] getRecentTemplates failed', err);
      return null;
    }
  },

  async getRecentRequests(limit = 10, range = '30d'): Promise<any | null> {
    try {
      const resp = await apiClient.get(`/dashboard/recent-requests`, { params: { limit, range } });
      return resp.data || null;
    } catch (err) {
      console.warn('[dashboardService] getRecentRequests failed', err);
      return null;
    }
  },

  async getRequestCounts(range = '30d', groupBy = 'status'): Promise<any | null> {
    try {
      const resp = await apiClient.get(`/dashboard/request-counts`, { params: { range, groupBy } });
      return resp.data || null;
    } catch (err) {
      console.warn('[dashboardService] getRequestCounts failed', err);
      return null;
    }
  }
};

