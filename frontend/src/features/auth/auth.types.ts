import type { UserProfile } from "../user/user-type";

export type UserRole =
  | "admin"
  | "director"
  | "branch_manager"
  | "department_head"
  | "employee";

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status?: string;
  isVerified?: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    fullname: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    is_verified: boolean;
  };
}

export interface AuthStoreState {
  token: string | null;
  user: UserProfile | null;
  role: string | null;
  userId: number | null;
  setAuth: (token: string | null, user: UserProfile) => void;
  clearAuthState: () => void;
}
