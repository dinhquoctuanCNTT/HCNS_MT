import { useState } from "react";
import { BoardTask } from "../../hooks/useWorkflowBoard";
import { UpdateTaskPayload } from "../../hooks/useUpdateTask";

interface WorkflowIssueDetailProps {
  task: BoardTask;
  members: any[];
  labels: any[];
  priorities: any[];
  issueTypes: any[];
  statuses: any[];
  onCompleteTask?: () => Promise<boolean>;
  onUncompleteTask?: () => Promise<boolean>;
  onArchiveTask?: () => Promise<boolean>;
  onUnarchiveTask?: () => Promise<boolean>;
  onUpdateTask?: (payload: UpdateTaskPayload) => Promise<boolean>;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="wf-detail__row">
      <span className="wf-detail__label">{label}</span>
      <div className="wf-detail__value">{children}</div>
    </div>
  );
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function toInputDate(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function WorkflowIssueDetail({
  task,
  members,
  priorities,
  issueTypes,
  statuses,
  labels,
  onUpdateTask,
  onCompleteTask,
  onUncompleteTask,
  onArchiveTask,
  onUnarchiveTask,
}: WorkflowIssueDetailProps) {
  const canEdit = !!onUpdateTask;
  const isCompleted = !!(task as any).is_completed;
  const isArchived = !!(task as any).is_archived;
  const [editDesc, setEditDesc] = useState(false);
  const [descDraft, setDescDraft] = useState(task.description ?? "");
  const [savingDesc, setSavingDesc] = useState(false);

  const status =
    statuses.find((s) => Number(s.id) === Number(task.status_id)) ??
    statuses.find((s) => Number(s.id) === Number((task as any)?.status?.id)) ??
    null;
  const avatarInitials = task.assignee?.full_name
    ? task.assignee.full_name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const handleSaveDesc = async () => {
    if (!canEdit) return;
    setSavingDesc(true);
    await onUpdateTask!({ description: descDraft });
    setSavingDesc(false);
    setEditDesc(false);
  };

  return (
    <div className="wf-detail">
      {/* ====================== COMPLETE / ARCHIVE ACTIONS ========================== */}
      {(onCompleteTask || onArchiveTask) && (
        <div className="wf-detail__actions">
          <button
            className={`wf-btn wf-btn--sm ${isCompleted ? "wf-btn--success-active" : "wf-btn--success"}`}
            onClick={() =>
              isCompleted ? onUncompleteTask?.() : onCompleteTask?.()
            }
          >
            {isCompleted ? "✓ Completed" : "Mark Complete"}
          </button>

          <button
            className={`wf-btn wf-btn--sm ${isArchived ? "wf-btn--ghost-active" : "wf-btn--ghost"}`}
            onClick={() =>
              isArchived ? onUnarchiveTask?.() : onArchiveTask?.()
            }
          >
            {isArchived ? "📦 Archived" : "Archive"}
          </button>
        </div>
      )}

      {/* ====================== DESCRIPTION ========================== */}
      <div className="wf-detail__section">
        <h4 className="wf-detail__section-title">Description</h4>
        {editDesc ? (
          <div className="wf-detail__desc-edit">
            <textarea
              className="wf-editor__area"
              value={descDraft}
              onChange={(e) => setDescDraft(e.target.value)}
              rows={5}
              autoFocus
            />
            <div className="wf-detail__desc-actions">
              <button
                className="wf-btn wf-btn--primary wf-btn--sm"
                onClick={handleSaveDesc}
                disabled={savingDesc}
              >
                {savingDesc ? "Saving..." : "Save"}
              </button>
              <button
                className="wf-btn wf-btn--ghost wf-btn--sm"
                onClick={() => {
                  setEditDesc(false);
                  setDescDraft(task.description ?? "");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            className={`wf-detail__description ${canEdit ? "wf-detail__description--editable" : ""}`}
            onClick={() => canEdit && setEditDesc(true)}
            title={canEdit ? "Click to edit" : undefined}
          >
            {task.description?.trim() ? (
              task.description
            ) : (
              <em className="wf-detail__empty">
                {canEdit
                  ? "Click to add description..."
                  : "No description provided."}
              </em>
            )}
          </p>
        )}
      </div>

      {/* ====================== DETAILS GRID ========================== */}
      <div className="wf-detail__section">
        <h4 className="wf-detail__section-title">Details</h4>
        <div className="wf-detail__grid">
          <DetailRow label="Status">
            {status ? (
              <span
                className="wf-detail__badge"
                style={{
                  background: `${status.color}22`,
                  color: status.color,
                  borderColor: `${status.color}44`,
                }}
              >
                {status.name}
              </span>
            ) : (
              "—"
            )}
          </DetailRow>

          <DetailRow label="Assignee">
            {canEdit ? (
              <select
                className="wf-detail__select"
                value={task.assignee?.id ?? ""}
                onChange={(e) =>
                  onUpdateTask!({
                    assignee_id: e.target.value ? Number(e.target.value) : null,
                  })
                }
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name ?? m.name}
                  </option>
                ))}
              </select>
            ) : task.assignee ? (
              <div className="wf-detail__person">
                {task.assignee.avatar_url ? (
                  <img
                    src={task.assignee.avatar_url}
                    alt=""
                    className="wf-detail__avatar"
                  />
                ) : (
                  <span className="wf-detail__avatar wf-detail__avatar--initials">
                    {avatarInitials}
                  </span>
                )}
                <span>{task.assignee.full_name}</span>
              </div>
            ) : (
              <span className="wf-detail__empty">Unassigned</span>
            )}
          </DetailRow>

          <DetailRow label="Reporter">
            {task.reporter ? (
              <div className="wf-detail__person">
                <span className="wf-detail__avatar wf-detail__avatar--initials wf-detail__avatar--reporter">
                  {task.reporter.full_name
                    .split(" ")
                    .map((w: string) => w[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
                <span>{task.reporter.full_name}</span>
              </div>
            ) : (
              "—"
            )}
          </DetailRow>

          <DetailRow label="Priority">
            {canEdit ? (
              <select
                className="wf-detail__select"
                value={task.priority?.id ?? ""}
                onChange={(e) =>
                  onUpdateTask!({
                    priority_id: e.target.value ? Number(e.target.value) : null,
                  })
                }
              >
                <option value="">No priority</option>
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            ) : task.priority ? (
              <span
                className="wf-detail__priority"
                style={{ color: task.priority.color ?? "#6B7280" }}
              >
                ● {task.priority.name}
              </span>
            ) : (
              "—"
            )}
          </DetailRow>

          <DetailRow label="Type">
            {canEdit ? (
              <select
                className="wf-detail__select"
                value={task.taskType?.id ?? ""}
                onChange={(e) =>
                  onUpdateTask!({
                    task_type_id: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              >
                <option value="">No type</option>
                {issueTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            ) : (
              (task.taskType?.name ?? "—")
            )}
          </DetailRow>

          <DetailRow label="Labels">
            {task.labels?.length > 0 ? (
              <div className="wf-detail__labels">
                {task.labels.map((l) => (
                  <span
                    key={l.id}
                    className="wf-card__label"
                    style={{
                      background: l.color ? `${l.color}22` : "#E5E7EB",
                      color: l.color ?? "#6B7280",
                    }}
                  >
                    {l.name}
                  </span>
                ))}
              </div>
            ) : (
              "—"
            )}
          </DetailRow>

          <DetailRow label="Start date">
            {canEdit ? (
              <input
                type="date"
                className="wf-detail__date-input"
                value={toInputDate(task.start_date)}
                onChange={(e) =>
                  onUpdateTask!({ start_date: e.target.value || null })
                }
              />
            ) : (
              formatDate(task.start_date)
            )}
          </DetailRow>

          <DetailRow label="Due date">
            {canEdit ? (
              <input
                type="date"
                className="wf-detail__date-input"
                value={toInputDate(task.due_date)}
                onChange={(e) =>
                  onUpdateTask!({ due_date: e.target.value || null })
                }
              />
            ) : (
              <span
                className={
                  task.due_date && new Date(task.due_date) < new Date()
                    ? "wf-detail__overdue"
                    : ""
                }
              >
                {formatDate(task.due_date)}
              </span>
            )}
          </DetailRow>
        </div>
      </div>
    </div>
  );
}
