const TOKEN_KEY = "token";
const USER_KEY = "user";
const ROLE_KEY = "role"; // ← thêm
const USER_ID_KEY = "userId"; // ← thêm

export const saveAuthData = (token: string, user: any) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(ROLE_KEY, user.role); // ← thêm
  localStorage.setItem(USER_ID_KEY, String(user.id)); // ← thêm
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const getAuthRole = () => {
  // ← thêm
  return localStorage.getItem(ROLE_KEY) ?? "employee";
};

export const getAuthUserId = () => {
  // ← thêm
  return Number(localStorage.getItem(USER_ID_KEY));
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY); // ← thêm
  localStorage.removeItem(USER_ID_KEY); // ← thêm
};
