import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { getAuthToken } from "../features/auth/auth.storage";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
