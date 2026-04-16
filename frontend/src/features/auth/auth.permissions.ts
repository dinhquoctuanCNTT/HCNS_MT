import { useAuthStore } from "./auth.store";

export const ROLE_LEVEL: Record<string, number> = {
  admin: 5,
  director: 4,
  branch_manager: 3,
  department_head: 2,
  employee: 1,
};

export const ROLE_LABEL: Record<string, string> = {
  admin: "Quản trị viên",
  director: "Giám đốc",
  branch_manager: "Quản lý chi nhánh",
  department_head: "Trưởng phòng",
  employee: "Nhân viên",
};

export const ROLE_COLOR: Record<string, { bg: string; text: string }> = {
  admin: { bg: "#EDE9FE", text: "#5B21B6" },
  director: { bg: "#DBEAFE", text: "#1E40AF" },
  branch_manager: { bg: "#D1FAE5", text: "#065F46" },
  department_head: { bg: "#FEF3C7", text: "#92400E" },
  employee: { bg: "#F3F4F6", text: "#374151" },
};

export function hasMinRole(
  role: string | null | undefined,
  minRole: string,
): boolean {
  return (ROLE_LEVEL[role ?? ""] ?? 0) >= (ROLE_LEVEL[minRole] ?? 0);
}

export function canAssignTo(
  assignerRole: string | null | undefined,
  targetRole: string | null | undefined,
): boolean {
  return (
    (ROLE_LEVEL[assignerRole ?? ""] ?? 0) > (ROLE_LEVEL[targetRole ?? ""] ?? 0)
  );
}

export function getAssignableMembers<T extends { id: number; role: string }>(
  currentRole: string | null | undefined,
  members: T[],
): T[] {
  return members.filter((m) => canAssignTo(currentRole, m.role));
}

export function compareRoles(
  roleA: string | null | undefined,
  roleB: string | null | undefined,
): number {
  return (ROLE_LEVEL[roleA ?? ""] ?? 0) - (ROLE_LEVEL[roleB ?? ""] ?? 0);
}

/** Lấy label tiếng Việt của role */
export function getRoleLabel(role: string | null | undefined): string {
  return ROLE_LABEL[role ?? ""] ?? "—";
}

/** Lấy màu badge của role */
export function getRoleColor(role: string | null | undefined): {
  bg: string;
  text: string;
} {
  return ROLE_COLOR[role ?? ""] ?? ROLE_COLOR.employee;
}

export function usePermissions() {
  const { role, userId } = useAuthStore();

  return {
    role,
    userId,
    roleLabel: getRoleLabel(role),
    roleColor: getRoleColor(role),
    isAdmin: role === "admin",
    isDirectorOrAbove: hasMinRole(role, "director"),
    isDeptHeadOrAbove: hasMinRole(role, "department_head"),

    canAssignTo: (targetRole: string | null | undefined): boolean =>
      canAssignTo(role, targetRole),
    getAssignableMembers: <T extends { id: number; role: string }>(
      members: T[],
    ): T[] => getAssignableMembers(role, members),

    // ── WORKFLOW MODULE ───────────────────────────────────
    workflow: {
      canCreate: hasMinRole(role, "employee"),

      canEditAny: hasMinRole(role, "department_head"),

      canEditOwn: (
        reporterId?: number | null,
        assigneeId?: number | null,
      ): boolean =>
        hasMinRole(role, "department_head") ||
        userId === reporterId ||
        userId === assigneeId,

      /** Phân công assignee */
      canAssign: hasMinRole(role, "department_head"),

      /** Xóa task */
      canDelete: hasMinRole(role, "department_head"),

      /** Archive / unarchive */
      canArchive: hasMinRole(role, "department_head"),

      /** Mở lại task đã đóng */
      canReopen: hasMinRole(role, "department_head"),

      canComplete: (
        reporterId?: number | null,
        assigneeId?: number | null,
      ): boolean =>
        hasMinRole(role, "department_head") ||
        userId === reporterId ||
        userId === assigneeId,

      canViewAll: hasMinRole(role, "department_head"),

      canManageBoard: hasMinRole(role, "branch_manager"),

      canManageProject: hasMinRole(role, "director"),
    },

    // ── ADMIN MODULE ──────────────────────────────────────
    admin: {
      canAccess: hasMinRole(role, "department_head"),

      canManageUsers: hasMinRole(role, "director"),

      canViewReports: hasMinRole(role, "branch_manager"),

      canConfigSystem: role === "admin",
    },

    hr: {
      canViewProfiles: hasMinRole(role, "department_head"),

      canEditProfiles: hasMinRole(role, "branch_manager"),

      canApproveLeave: hasMinRole(role, "department_head"),

      canManageSalary: hasMinRole(role, "director"),
    },

    finance: {
      canViewReports: hasMinRole(role, "branch_manager"),

      canManageBudget: hasMinRole(role, "director"),
    },
  };
}
