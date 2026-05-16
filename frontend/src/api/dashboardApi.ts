import axiosClient from "./axiosClient";

export const dashboardApi = {
  getPendingCount: async () => {
    const res = await axiosClient.get("/api/dashboard/pending-count");
    return res.data; // { total, leaves, explanations }
  },

  getStats: async (date?: string) => {
    const res = await axiosClient.get("/api/dashboard/stats", { params: { date } });
    return res.data;
  },

  getLatestRequests: async (limit = 5) => {
    const res = await axiosClient.get("/api/dashboard/latest-requests", { params: { limit } });
    return res.data as LatestRequest[];
  },
};

export interface LatestRequest {
  id: number;
  name: string;
  type: string;
  submitted_at: string;
  status: string;
}
