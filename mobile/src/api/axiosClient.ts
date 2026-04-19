import axios from "axios";
import { store } from "../store";

const axiosClient = axios.create({
  baseURL: "http://192.168.68.23:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
