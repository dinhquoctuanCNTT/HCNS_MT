import axiosClient from "./axiosClient";

export const attendanceApi = {
  checkIn: (base64Image: string) =>
    axiosClient.post("/attendance/check-in", { image: base64Image }),

  registerFace: (base64Image: string) =>
    axiosClient.post("/attendance/register-face", { image: base64Image }),

  getHistory: (from?: string, to?: string) =>
    axiosClient.get("/attendance/history", { params: { from, to } }),
};
