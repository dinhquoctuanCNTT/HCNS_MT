import axiosClient from "./axiosClient";

export const attendanceApi = {
  checkIn: (
    image: string,
    latitude?: number,
    longitude?: number,
    address?: string,
    timestamp?: string,
  ) =>
    axiosClient.post("/attendance/check-in", {
      image,
      latitude,
      longitude,
      address,
      timestamp,
    }),

  checkOut: (
    image: string,
    latitude?: number,
    longitude?: number,
    address?: string,
    timestamp?: string,
  ) =>
    axiosClient.post("/attendance/check-out", {
      image,
      latitude,
      longitude,
      address,
      timestamp,
    }),

  registerFace: (image: string) =>
    axiosClient.post("/attendance/register-face", { image }),

  getHistory: (from?: string, to?: string) =>
    axiosClient.get("/attendance/history", { params: { from, to } }),

  getLeaveRequests: (status?: string) =>
    axiosClient.get("/attendance/leave", { params: { status } }),

  createLeaveRequest: (data: {
    leave_type: string;
    from_date: string;
    to_date: string;
    total_days?: number;
    reason?: string;
  }) => axiosClient.post("/attendance/leave", data),

  getStats: (month?: string, employeeId?: number) =>
    axiosClient.get("/attendance/stats", { params: { month, employeeId } }),

  getHolidays: (year: number) =>
    axiosClient.get("/holidays", { params: { year } }),
};
