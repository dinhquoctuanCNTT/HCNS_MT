import { useState } from "react";
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

  const status =
    statuses.find((s) => Number(s.id) === Number(task.status_id)) ??
    statuses.find((s) => Number(s.id) === Number((task as any)?.status?.id)) ??
    null;

  const handleSaveDesc = async () => {
    if (!canEdit) return;
    setSavingDesc(true);
    await onUpdateTask!({ description: descDraft });
    setSavingDesc(false);
    setEditDesc(false);
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
          <div className="wf-meta-card">
            <div className="wf-meta-card__label">Trạng thái</div>
            <div className="wf-meta-card__value">
              {status ? (
                <span
                  className="wf-status-pill"
                  style={{
                    background: `${status.color}18`,
                    color: status.color,
                    borderColor: `${status.color}33`,
                  }}
                >
                  {status.name}
                </span>
              ) : (
                "—"
              )}
            </div>
          </div>

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
