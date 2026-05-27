import axiosClient from "@api/axiosClient";

export const notificationApi = {
  getNotifications: (limit = 20) =>
    axiosClient.get(`/api/notifications?limit=${limit}`),

  readNotification: (id: number) =>
    axiosClient.patch(`/api/notifications/${id}/read`),

  readAllNotifications: () => axiosClient.patch("/api/notifications/read-all"),
};
