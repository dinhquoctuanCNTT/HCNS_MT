import axiosClient from "./axiosClient";

export const leaveApi = {
  getMyRequests: (status?: string) =>
    axiosClient.get("/leaves/my", { params: { status } }),

  getMyBalance: () =>
    axiosClient.get("/leaves/my/balance"),

  create: (data: {
    leave_category: string;
    from_date: string;
    to_date: string;
    reason?: string;
  }) => axiosClient.post("/leaves", data),

  cancel: (id: number) =>
    axiosClient.patch(`/leaves/${id}/cancel`),
};
