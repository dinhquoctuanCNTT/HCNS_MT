export const ROLES = {
  ADMIN: "admin",
  DIRECTOR: "director",
  BRANCH_MANAGER: "branch_manager",
  DEPARTMENT_HEAD: "department_head",
  EMPLOYEE: "employee",
};

export const ROLE_HIERARCHY = {
  admin: 5,
  director: 4,
  branch_manager: 3,
  department_head: 2,
  employee: 1,
};

export const PERMISSIONS = {
  admin: [
    "manage:users",
    "manage:system",
    "manage:branches",
    "manage:departments",
    "manage:tasks",
    "create:tasks", // ← thêm
    "view:reports",
    "delete:tasks",
    "assign:tasks",
    "manage:projects",
  ],
  director: [
    "manage:branches",
    "manage:departments",
    "manage:tasks",
    "create:tasks", // ← thêm
    "view:reports",
    "view:all_tasks",
    "delete:tasks",
    "assign:tasks",
    "manage:projects",
  ],
  branch_manager: [
    "manage:departments",
    "manage:tasks",
    "create:tasks", // ← thêm
    "view:branch_reports",
    "assign:tasks",
    "view:branch_tasks",
    "delete:tasks",
    "manage:projects",
  ],
  department_head: [
    "manage:tasks",
    "create:tasks", // ← thêm
    "assign:tasks",
    "view:department_tasks",
    "view:department_reports",
    "delete:tasks",
  ],
  employee: ["view:own_tasks", "create:tasks", "update:own_tasks"],
};
