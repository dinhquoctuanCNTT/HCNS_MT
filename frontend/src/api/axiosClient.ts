import axios from "axios";
import { API_BASE_URL } from "../config/env";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    if (status === 403) {
      alert("Bạn không có quyền thực hiện thao tác này!");
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
