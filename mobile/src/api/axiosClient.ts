import axios from "axios";
import { store } from "../store";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:3001/api"
    : "https://unjustly-paralegal-jellied.ngrok-free.dev/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = require("../store/slices/authSlice");
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
