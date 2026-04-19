import axiosClient from "./axiosClient";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    axiosClient.post("/auth/login", data),

  register: (data: { name: string; email: string; password: string }) =>
    axiosClient.post("/auth/register", data),

  forgotPassword: (data: { email: string }) =>
    axiosClient.post("/auth/forgot-password", data),
};
