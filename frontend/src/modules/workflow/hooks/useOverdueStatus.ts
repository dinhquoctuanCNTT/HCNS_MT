import { useMemo } from "react";

// ── Kiểu trả về ──────────────────────────────────────────────
export interface OverdueStatus {
  /** Đã quá hạn */
  isOverdue: boolean;
  /** Còn dưới 24h */
  isNearDue: boolean;
  /** Còn dưới 3 ngày */
  isApproaching: boolean;
  /** Nhãn hiển thị: "Quá hạn 2 ngày" / "Còn 5h" / null */
  label: string | null;
  /** Class gắn vào badge: "overdue" | "near" | "approaching" | null */
  badgeClass: "overdue" | "near" | "approaching" | null;
  /** Số ms còn lại (âm = đã quá hạn) */
  diffMs: number | null;
}

// ── Format thời gian ─────────────────────────────────────────
function formatDiff(diffMs: number): string {
  const abs = Math.abs(diffMs);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);

  if (days > 0) return `${days} ngày${hours > 0 ? ` ${hours}h` : ""}`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes} phút`;
  return "vài giây";
}

const EMPTY: OverdueStatus = {
  isOverdue: false,
  isNearDue: false,
  isApproaching: false,
  label: null,
  badgeClass: null,
  diffMs: null,
};

export function useOverdueStatus(
  dueDate: string | null | undefined,
  isCompleted: boolean,
): OverdueStatus {
  return useMemo(
    () => calcOverdueStatus(dueDate, isCompleted),
    [dueDate, isCompleted],
  );
}

export function calcOverdueStatus(
  dueDate: string | null | undefined,
  isCompleted: boolean,
): OverdueStatus {
  if (!dueDate || isCompleted) return EMPTY;

  const due = new Date(dueDate).getTime();
  if (isNaN(due)) return EMPTY;

  const diffMs = due - Date.now();
  const isOverdue = diffMs < 0;
  const isNearDue = diffMs >= 0 && diffMs < 24 * 3_600_000; // < 24h
  const isApproaching = diffMs >= 0 && diffMs < 3 * 86_400_000; // < 3 ngày

  let label: string | null = null;
  let badgeClass: OverdueStatus["badgeClass"] = null;

  if (isOverdue) {
    label = `Quá hạn ${formatDiff(diffMs)}`;
    badgeClass = "overdue";
  } else if (isNearDue) {
    label = `Còn ${formatDiff(diffMs)}`;
    badgeClass = "near";
  } else if (isApproaching) {
    label = `Còn ${formatDiff(diffMs)}`;
    badgeClass = "approaching";
  }

  return { isOverdue, isNearDue, isApproaching, label, badgeClass, diffMs };
}
