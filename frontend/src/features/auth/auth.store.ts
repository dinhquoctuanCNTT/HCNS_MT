import { create } from "zustand";
import type { AuthStoreState } from "./auth.types";
import {
  clearAuthData,
  getAuthToken,
  getAuthUser,
  getAuthRole,
  getAuthUserId,
  saveAuthData,
} from "./auth.storage";

export const useAuthStore = create<AuthStoreState>((set) => ({
  token: getAuthToken(),
  user: getAuthUser(),
  role: getAuthRole(),
  userId: getAuthUserId(),

  setAuth: (token, user) => {
    saveAuthData(token, user); // lưu vào localStorage (bao gồm role + userId)
    set({
      token,
      user,
      role: user.role, // ← thêm
      userId: user.id, // ← thêm
    });
  },

  clearAuthState: () => {
    clearAuthData();
    set({ token: null, user: null, role: null, userId: null });
  },
}));
