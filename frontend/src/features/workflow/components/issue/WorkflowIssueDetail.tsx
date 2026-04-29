import { useState, useRef, useEffect } from "react";
import { BoardTask } from "../../hooks/useWorkflowBoard";
import WorkflowChecklist from "./WorkflowChecklist";
import WorkflowAssignees from "./WorkflowAssignees";
import WorkflowDependencies from "./WorkflowDependencies";
import WorkflowPrimaryAssignee from "./WorkflowPrimaryAssignee";
import { UpdateTaskPayload } from "../../hooks/useUpdateTask";

interface WorkflowIssueDetailProps {
  task: BoardTask;
  projectId?: number;
  members: any[];
  labels: any[];
  priorities: any[];
  issueTypes: any[];
  statuses: any[];
  onUpdateTask?: (payload: UpdateTaskPayload) => Promise<boolean>;
  onCompleteTask?: () => Promise<boolean>;
  onUncompleteTask?: () => Promise<boolean>;
  onArchiveTask?: () => Promise<boolean>;
  onUnarchiveTask?: () => Promise<boolean>;
}

function toInputDate(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

// ─── Custom Status Dropdown có màu ────────────────────────────────────────────
function StatusDropdown({
  statuses,
  currentStatusId,
  canEdit,
  onSelect,
}: {
  statuses: any[];
  currentStatusId: number;
  canEdit: boolean;
  onSelect: (statusId: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current =
    statuses.find((s) => Number(s.id) === Number(currentStatusId)) ??
    statuses[0];

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!canEdit) {
    return (
      <span
        className="wf-status-pill"
        style={{
          background: `${current?.color ?? "#6B7280"}18`,
          color: current?.color ?? "#6B7280",
          borderColor: `${current?.color ?? "#6B7280"}33`,
        }}
      >
        {current?.name ?? "—"}
      </span>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="wf-status-pill"
        style={{
          background: `${current?.color ?? "#6B7280"}18`,
          color: current?.color ?? "#6B7280",
          borderColor: `${current?.color ?? "#6B7280"}33`,
          border: "1.5px solid",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontWeight: 600,
          padding: "4px 10px",
          borderRadius: 20,
          fontSize: 12,
          userSelect: "none",
        }}
      >
        {current?.name ?? "—"}
        <svg
          width="10"
          height="10"
          viewBox="0 0 16 16"
          fill="currentColor"
          style={{ opacity: 0.7 }}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 999,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            minWidth: 160,
            overflow: "hidden",
          }}
        >
          {statuses.map((s) => {
            const isActive = Number(s.id) === Number(currentStatusId);
            return (
              <button
                key={s.id}
                onClick={() => {
                  onSelect(Number(s.id));
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: isActive ? `${s.color}12` : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: "#111827",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = `${s.color}18`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = isActive
                    ? `${s.color}12`
                    : "transparent")
                }
              >
                {/* Chấm màu */}
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: s.color ?? "#6B7280",
                    flexShrink: 0,
                    boxShadow: isActive ? `0 0 0 2px ${s.color}44` : "none",
                  }}
                />
                <span
                  style={{
                    color: s.color ?? "#374151",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {s.name}
                </span>
                {isActive && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill={s.color}
                    style={{ marginLeft: "auto" }}
                  >
                    <path
                      d="M3 8l3.5 3.5L13 4"
                      stroke={s.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WorkflowIssueDetail({
  task,
  projectId,
  members,
  priorities,
  issueTypes,
  statuses,
  labels,
  onUpdateTask,
}: WorkflowIssueDetailProps) {
  const canEdit = !!onUpdateTask;
  const [editDesc, setEditDesc] = useState(false);
  const [descDraft, setDescDraft] = useState(task.description ?? "");
  const [savingDesc, setSavingDesc] = useState(false);

  const handleSaveDesc = async () => {
    if (!canEdit) return;
    try {
      setSavingDesc(true);

      const success = await onUpdateTask?.({
        description: descDraft,
      });

      if (success) {
        setEditDesc(false);
      }
    } finally {
      setSavingDesc(false);
    }
  };
  return (
    <div className="wf-issue-layout">
      <div className="wf-issue-block">
        {task.reporter && (
          <div className="wf-summary-person">
            <div className="wf-summary-person__avatar wf-summary-person__avatar--green">
              {task.reporter.full_name
                .split(" ")
                .map((w: string) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <div className="wf-summary-person__label">Người tạo</div>
              <div className="wf-summary-person__name">
                {task.reporter.full_name}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="wf-issue-block">
        <div className="wf-issue-block__title">Mô tả</div>
        {editDesc ? (
          <div>
            <textarea
              value={descDraft}
              onChange={(e) => setDescDraft(e.target.value)}
              rows={5}
              autoFocus
              className="wf-desc-editor"
            />
            <div className="wf-desc-actions">
              <button
                onClick={handleSaveDesc}
                disabled={savingDesc}
                className="wf-inline-btn wf-inline-btn--primary"
              >
                {savingDesc ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                onClick={() => {
                  setEditDesc(false);
                  setDescDraft(task.description ?? "");
                }}
                className="wf-inline-btn"
              >
                Huỷ
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => canEdit && setEditDesc(true)}
            className={`wf-desc-view${canEdit ? " wf-desc-view--editable" : ""}`}
          >
            {task.description?.trim() ||
              (canEdit ? "Nhấn để thêm mô tả..." : "Không có mô tả.")}
          </div>
        )}
      </div>

      <div className="wf-issue-block">
        <div className="wf-issue-block__title">Nhân sự</div>
        <div className="wf-meta-row">
          <label className="wf-meta-row__label">Phụ trách chính</label>
          <div className="wf-meta-row__content">
            <WorkflowPrimaryAssignee
              taskId={task.id}
              members={members}
              canEdit={canEdit}
            />
          </div>
        </div>
        <div className="wf-meta-row">
          <label className="wf-meta-row__label">Người phối hợp</label>
          <div className="wf-meta-row__content">
            <WorkflowAssignees
              taskId={task.id}
              members={members}
              canEdit={canEdit}
            />
          </div>
        </div>
      </div>

      <div className="wf-issue-block">
        <div className="wf-issue-block__title">Kế hoạch & phân loại</div>
        <div className="wf-meta-grid">
          {/* ── Trạng thái — custom dropdown có màu ── */}
          <div className="wf-meta-card">
            <div className="wf-meta-card__label">Trạng thái</div>
            <div className="wf-meta-card__value">
              <StatusDropdown
                statuses={statuses}
                currentStatusId={task.status_id}
                canEdit={canEdit}
                onSelect={(statusId) => onUpdateTask?.({ status_id: statusId })}
              />
            </div>
          </div>

          {/* ── Ưu tiên ── */}
          <div className="wf-meta-card">
            <div className="wf-meta-card__label">Ưu tiên</div>
            <div className="wf-meta-card__value">
              {canEdit ? (
                <select
                  value={task.priority?.id ?? ""}
                  onChange={(e) =>
                    onUpdateTask?.({
                      priority_id: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  className="wf-select-inline"
                >
                  <option value="">Không ưu tiên</option>
                  {priorities.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{task.priority ? `● ${task.priority.name}` : "—"}</span>
              )}
            </div>
          </div>

          {/* ── Loại ── */}
          <div className="wf-meta-card">
            <div className="wf-meta-card__label">Loại</div>
            <div className="wf-meta-card__value">
              {canEdit ? (
                <select
                  value={task.taskType?.id ?? ""}
                  onChange={(e) =>
                    onUpdateTask?.({
                      task_type_id: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  className="wf-select-inline"
                >
                  <option value="">Không có loại</option>
                  {issueTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{task.taskType?.name ?? "—"}</span>
              )}
            </div>
          </div>

          {/* ── Bắt đầu ── */}
          <div className="wf-meta-card">
            <div className="wf-meta-card__label">Bắt đầu</div>
            <div className="wf-meta-card__value">
              {canEdit ? (
                <input
                  type="date"
                  value={toInputDate(task.start_date)}
                  onChange={(e) =>
                    onUpdateTask?.({ start_date: e.target.value || null })
                  }
                  className="wf-date-inline"
                />
              ) : (
                <span>
                  {task.start_date
                    ? new Date(task.start_date).toLocaleDateString("vi-VN")
                    : "—"}
                </span>
              )}
            </div>
          </div>

          {/* ── Kết thúc ── */}
          <div className="wf-meta-card">
            <div className="wf-meta-card__label">Kết thúc</div>
            <div className="wf-meta-card__value">
              {canEdit ? (
                <input
                  type="date"
                  value={toInputDate(task.due_date)}
                  onChange={(e) =>
                    onUpdateTask?.({ due_date: e.target.value || null })
                  }
                  className="wf-date-inline"
                />
              ) : (
                <span>
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString("vi-VN")
                    : "—"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
