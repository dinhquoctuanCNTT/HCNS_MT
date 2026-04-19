// frontend/src/api/axiosClient.ts — GIỮ NGUYÊN localStorage
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://183.91.8.233:3001",
  headers: {
    "Content-Type": "application/json",
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
