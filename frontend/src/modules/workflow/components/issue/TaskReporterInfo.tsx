
import { useOverdueStatus } from "../../hooks/useOverdueStatus";
import { getRoleLabel, getRoleColor } from "@auth/auth.permissions";

// ── Kiểu dữ liệu ─────────────────────────────────────────────
export interface PersonInfo {
  id: number;
  full_name?: string;
  name?: string; // fallback nếu API trả "name" thay vì "full_name"
  avatar?: string;
  role?: string;
  email?: string;
}

interface TaskReporterInfoProps {
  reporter?: PersonInfo | null;
  assignee?: PersonInfo | null;
  createdAt?: string | null;
  dueDate?: string | null;
  isCompleted?: boolean;
  /** Hiện badge role hay không (mặc định: true) */
  showRoleBadge?: boolean;
}

// ── Component chính ───────────────────────────────────────────
export default function TaskReporterInfo({
  reporter,
  assignee,
  createdAt,
  dueDate,
  isCompleted = false,
  showRoleBadge = true,
}: TaskReporterInfoProps) {
  const { label: overdueLabel, badgeClass } = useOverdueStatus(
    dueDate,
    isCompleted,
  );

  return (
    <div className="tri-wrapper">
      {/* ── Người giao việc ───────────────────────────── */}
      <div className="tri-row">
        <span className="tri-label">Giao bởi</span>
        <PersonCard person={reporter} showRoleBadge={showRoleBadge} />
        {createdAt && <span className="tri-date">{formatDate(createdAt)}</span>}
      </div>

      {/* ── Người thực hiện ───────────────────────────── */}
      <div className="tri-row">
        <span className="tri-label">Thực hiện</span>
        <PersonCard person={assignee} showRoleBadge={showRoleBadge} />
      </div>

      {/* ── Hạn + overdue badge ───────────────────────── */}
      {dueDate && (
        <div className="tri-row">
          <span className="tri-label">Hạn</span>
          <span className="tri-due-date">{formatDate(dueDate)}</span>
          {overdueLabel && badgeClass && (
            <span className={`tri-badge tri-badge--${badgeClass}`}>
              {badgeClass === "overdue" ? "⏰" : "⚠️"} {overdueLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-component: 1 người ────────────────────────────────────
function PersonCard({
  person,
  showRoleBadge,
}: {
  person?: PersonInfo | null;
  showRoleBadge: boolean;
}) {
  const displayName = person?.full_name || person?.name || "Chưa giao";
  const initial = displayName[0]?.toUpperCase() ?? "?";
  const roleColor = person?.role ? getRoleColor(person.role) : null;
  const roleLabel = person?.role ? getRoleLabel(person.role) : null;

  return (
    <div className="tri-person">
      {/* Avatar */}
      <div className="tri-avatar">
        {person?.avatar ? (
          <img src={person.avatar} alt={displayName} />
        ) : (
          <span className="tri-avatar__initial">{person ? initial : "—"}</span>
        )}
      </div>

      {/* Tên */}
      <span className="tri-person__name" title={person?.email}>
        {displayName}
      </span>

      {/* Badge role */}
      {showRoleBadge && roleColor && roleLabel && (
        <span
          className="tri-role-badge"
          style={{ background: roleColor.bg, color: roleColor.text }}
        >
          {roleLabel}
        </span>
      )}
    </div>
  );
}

// ── Format ngày ──────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
