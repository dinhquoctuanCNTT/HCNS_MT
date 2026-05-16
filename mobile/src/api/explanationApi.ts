import axiosClient from "./axiosClient";

export const explanationApi = {
  create: (data: {
    workDate: string; // "2026-05-15"
    reason: string;
    requestedCheckIn?: string; // "08:00:00"
    requestedCheckOut?: string; // "17:30:00"
  }) => axiosClient.post("/explanations", data),

  getMy: () => axiosClient.get("/explanations/my"),
};
