const ROLE_LEVEL: Record<string, number> = {
  admin: 5,
  director: 4,
  branch_manager: 3,
  department_head: 2,
  employee: 1,
};

export const getRole = (): string => {
  return localStorage.getItem("role") ?? "employee";
};

export const getUserId = (): number => {
  return Number(localStorage.getItem("userId"));
};

export const hasMinRole = (minRole: string): boolean => {
  const userLevel = ROLE_LEVEL[getRole()] ?? 0;
  const minLevel = ROLE_LEVEL[minRole] ?? 0;
  return userLevel >= minLevel;
};

// Dùng nhanh
export const isAdmin = () => hasMinRole("admin");
export const isDirector = () => hasMinRole("director");
export const isBranchManager = () => hasMinRole("branch_manager");
export const isDepartmentHead = () => hasMinRole("department_head");
export const isEmployee = () => hasMinRole("employee");
