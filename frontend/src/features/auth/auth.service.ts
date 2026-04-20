import { api } from "../../lib/api";
import type { LoginResponse, RegisterResponse } from "./auth.types";
import type { LoginFromValues } from "./login/login.types";
import type { RegisterFormValues } from "./register/register.types";

export const authService = {
  async login(payload: LoginFromValues) {
    const res = await api.post<LoginResponse>("/api/auth/login", payload);
    return res.data;
  },

  async register(payload: RegisterFormValues) {
    const res = await api.post<RegisterResponse>("/api/auth/register", payload);
    return res.data;
  },

  async me() {
    const res = await api.get("/api/auth/me");
    return res.data;
  },
};
