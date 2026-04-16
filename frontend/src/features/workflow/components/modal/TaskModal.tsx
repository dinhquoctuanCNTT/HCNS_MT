import { useState, useEffect, useRef } from "react";
import { BoardTask } from "../../hooks/useWorkflowBoard";
import { UpdateTaskPayload } from "../../hooks/useUpdateTask";
import WorkflowIssueDetail from "../issue/WorkflowIssueDetail";
import WorkflowCommentList from "../issue/WorkflowCommentList";
import WorkflowActivityList from "../issue/WorkflowActivityList";
import { workflowApi } from "../../api/workflow.api";
import "../../styles/workflow-form.css";
import WorkflowAttachmentSection from "../issue/WorkflowAttachmentSection";
import CloseIssueDialog, { ResolutionType } from "./CloseIssueDialog";

// ── Searchable Assignee Dropdown ─────────────────────────
function AssigneeSearch({
  members,
  value,
  onChange,
}: {
  members: any[];
  value: any;
  onChange: (val: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = members.find((m) => String(m.id) === String(value));

  const filtered = members.filter((m) =>
    (m.full_name || m.name || m.email)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        className="wf-select"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => {
          setOpen((prev) => !prev);
          setSearch("");
        }}
      >
        <span style={{ color: selected ? "#111" : "#888" }}>
          {selected
            ? selected.full_name || selected.name || selected.email
            : "Automatic"}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M5 7l3 3 3-3" />
        </svg>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 6,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            zIndex: 1000,
            maxHeight: 260,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "8px" }}>
            <input
              autoFocus
              className="wf-input"
              placeholder="Tìm kiếm nhân viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ marginBottom: 0 }}
            />
          </div>

          <div style={{ overflowY: "auto", maxHeight: 200 }}>
            <div
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                background: !value ? "#f0f4ff" : "transparent",
                fontSize: 14,
                color: "#555",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = !value
                  ? "#f0f4ff"
                  : "transparent")
              }
              onClick={() => {
                onChange("");
                setOpen(false);
                setSearch("");
              }}
            >
              Automatic
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "8px 12px", color: "#aaa", fontSize: 13 }}>
                Không tìm thấy
              </div>
            ) : (
              filtered.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    background:
                      String(m.id) === String(value)
                        ? "#f0f4ff"
                        : "transparent",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      String(m.id) === String(value)
                        ? "#f0f4ff"
                        : "transparent")
                  }
                  onClick={() => {
                    onChange(m.id);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#0052cc",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {(m.full_name || m.name || m.email)?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>
                      {m.full_name || m.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>{m.email}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        className="wf-assign-me"
        onClick={() => members?.[0]?.id && onChange(members[0].id)}
      >
        Assign to me
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
interface TaskModalProps {
  task: BoardTask | null;
  projectId?: number;
  boardId?: number;
  members: any[];
  labels: any[];
  priorities: any[];
  issueTypes: any[];
  statuses: any[];
  submitting?: boolean;
  onClose: () => void;
  onCreate?: (payload: any) => Promise<void>;
  onUpdateTask?: (payload: UpdateTaskPayload) => Promise<boolean>;
  onUpdateStatus?: (statusId: number) => Promise<boolean>;
  onRefresh?: () => Promise<void> | void;
}

type TabType = "detail" | "comments" | "activity";

export default function TaskModal({
  task,
  projectId,
  boardId,
  members,
  labels,
  priorities,
  issueTypes,
  statuses,
  submitting = false,
  onClose,
  onCreate,
  onUpdateTask,
  onUpdateStatus,
  onRefresh,
}: TaskModalProps) {
  const isCreate = !task;

  const [activeTab, setActiveTab] = useState<TabType>("detail");
  const [comments, setComments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusId, setStatusId] = useState<number>(statuses?.[0]?.id ?? 0);
  const [assigneeId, setAssigneeId] = useState<any>("");
  const [priorityId, setPriorityId] = useState<any>("");
  const [issueTypeId, setIssueTypeId] = useState<any>("");
  const [labelId, setLabelId] = useState("");
  const [parentId, setParentId] = useState("");
  const [createAnother, setCreateAnother] = useState(false);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task?.title ?? "");
  const [overrideStatusId, setOverrideStatusId] = useState<number | null>(null);

  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closingTask, setClosingTask] = useState(false);

  const currentStatusId =
    overrideStatusId ??
    Number(task?.status_id ?? (task as any)?.status?.id ?? 0);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{
    title?: string;
    issueTypeId?: string;
  }>({});

  const currentStatus = statuses.find(
    (s) => Number(s.id) === Number(currentStatusId),
  );
  const isDoneStatus =
    currentStatus?.name?.toLowerCase() === "done" ||
    currentStatus?.name?.toLowerCase() === "hoàn thành";

  useEffect(() => {
    if (isCreate && statuses.length > 0 && statusId === 0) {
      setStatusId(statuses[0].id);
    }
  }, [isCreate, statuses, statusId]);

  useEffect(() => {
    setOverrideStatusId(null);
    setTitleDraft(task?.title ?? "");
    setEditingTitle(false);
    setActiveTab("detail");
    setShowCloseDialog(false);
  }, [task?.id]);

  useEffect(() => {
    if (!task?.id) return;
    if (activeTab === "comments") fetchComments();
    if (activeTab === "activity") fetchActivities();
  }, [activeTab, task?.id]);

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus();
  }, [editingTitle]);

  const fetchComments = async () => {
    if (!task?.id) return;
    try {
      setLoadingComments(true);
      const res = await workflowApi.getComments(task.id);
      setComments(res.data?.data ?? res.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchActivities = async () => {
    if (!task?.id) return;
    try {
      setLoadingActivities(true);
      const res = await workflowApi.getActivities(task.id);
      setActivities(res.data?.data ?? res.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleUpdateStatus = async (newStatusId: number) => {
    if (!task?.id || Number(newStatusId) === Number(currentStatusId)) return;
    try {
      setUpdatingStatus(true);
      if (onUpdateStatus) {
        await onUpdateStatus(newStatusId);
      } else {
        await workflowApi.updateTask(task.id, { status_id: newStatusId });
      }
      setOverrideStatusId(newStatusId);
      await onRefresh?.();
    } catch (e) {
      console.error("handleUpdateStatus ERROR:", e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleTitleSave = async () => {
    const trimmed = titleDraft.trim();
    if (!trimmed || trimmed === task?.title) {
      setEditingTitle(false);
      setTitleDraft(task?.title ?? "");
      return;
    }
    await onUpdateTask?.({ title: trimmed });
    setEditingTitle(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task?.id) return;
    try {
      setCommentSubmitting(true);
      await workflowApi.addComment(task.id, { content: newComment.trim() });
      setNewComment("");
      await fetchComments();
    } catch (e) {
      console.error(e);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleCloseIssue = async (resolution: ResolutionType, note: string) => {
    if (!task?.id) return;
    try {
      setClosingTask(true);
      await workflowApi.completeTask(task.id, { resolution, note });
      await onRefresh?.();
      onClose();
    } catch (e) {
      console.error("handleCloseIssue ERROR:", e);
    } finally {
      setClosingTask(false);
      setShowCloseDialog(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatusId(statuses?.[0]?.id ?? 0);
    setAssigneeId("");
    setPriorityId("");
    setIssueTypeId("");
    setLabelId("");
    setParentId("");
  };

  const handleCreate = async () => {
    const newErrors: { title?: string; issueTypeId?: string } = {};
    if (!title.trim()) newErrors.title = "Summary is required";
    if (!issueTypeId) newErrors.issueTypeId = "Issue type is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    await onCreate?.({
      title: title.trim(),
      description: description.trim(),
      project_id: projectId,
      board_id: boardId,
      status_id: statusId || null,
      assignee_id: assigneeId ? Number(assigneeId) : null,
      priority_id: priorityId ? Number(priorityId) : null,
      issue_type_id: issueTypeId ? Number(issueTypeId) : null,
      label_id: labelId ? Number(labelId) : null,
      parent_id: parentId ? Number(parentId) : null,
    });

    if (createAnother) {
      resetForm();
      return;
    }

    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("wf-modal__backdrop")) {
      onClose();
    }
  };

  const selectedStatus = statuses.find((s) => s.id === Number(statusId));

  const tabs: { key: TabType; label: string }[] = isCreate
    ? [{ key: "detail", label: "Details" }]
    : [
        { key: "detail", label: "Details" },
        {
          key: "comments",
          label: comments.length ? `Comments (${comments.length})` : "Comments",
        },
        { key: "activity", label: "Activity" },
      ];

  return (
    <>
      <div className="wf-modal__backdrop" onClick={handleBackdropClick}>
        <div className={`wf-modal ${isCreate ? "wf-modal--create" : ""}`}>
          {isCreate ? (
            <>
              <div className="wf-modal__header">
                <span className="wf-modal__title">Create issue</span>
                <div className="wf-modal__header-actions">
                  <button
                    className="wf-icon-btn"
                    title="Minimize"
                    type="button"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <line x1="3" y1="8" x2="13" y2="8" />
                    </svg>
                  </button>
                  <button className="wf-icon-btn" title="Expand" type="button">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M10 3h3v3M6 13H3v-3M13 10v3h-3M3 6V3h3" />
                    </svg>
                  </button>
                  <button
                    className="wf-icon-btn"
                    title="Close"
                    type="button"
                    onClick={onClose}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="wf-modal__body">
                <div className="wf-field">
                  <label className="wf-field__label">
                    Status
                    <svg
                      className="wf-field__info-icon"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="8" cy="8" r="6" />
                      <path d="M8 7v4M8 5.5v.5" />
                    </svg>
                  </label>
                  <div className="wf-status-pill-wrap">
                    <span
                      className="wf-status-dot"
                      style={{ background: selectedStatus?.color ?? "#0052cc" }}
                    />
                    <select
                      className="wf-status-select-visible"
                      value={statusId}
                      onChange={(e) => setStatusId(Number(e.target.value))}
                    >
                      {statuses.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="wf-status-caret"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M5 7l3 3 3-3" />
                    </svg>
                  </div>
                  <span className="wf-field__hint">
                    This is the issue's initial status upon creation
                  </span>
                </div>

                <div className="wf-divider" />

                <input
                  className={`wf-input${errors.title ? " wf-input--error" : ""}`}
                  placeholder="Enter issue summary"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim()) {
                      setErrors((p) => ({ ...p, title: undefined }));
                    }
                  }}
                  autoFocus
                />
                {errors.title && (
                  <span className="wf-field__error">{errors.title}</span>
                )}

                <div className="wf-field">
                  <label className="wf-field__label">Description</label>
                  <div className="wf-editor">
                    <div className="wf-editor__toolbar">
                      <button
                        type="button"
                        className="wf-tb-btn wf-tb-btn--text"
                      >
                        Normal text
                        <svg
                          style={{ width: 10, height: 10 }}
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M2 4l3 3 3-3" />
                        </svg>
                      </button>
                      <div className="wf-tb-sep" />
                      <button type="button" className="wf-tb-btn">
                        <strong>B</strong>
                      </button>
                      <button type="button" className="wf-tb-btn">
                        <em>I</em>
                      </button>
                      <button type="button" className="wf-tb-btn">
                        <u>U</u>
                      </button>
                      <div className="wf-tb-sep" />
                      <button type="button" className="wf-tb-btn">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        >
                          <path d="M2 4h10M2 7h6M2 10h8" />
                        </svg>
                      </button>
                      <button type="button" className="wf-tb-btn">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        >
                          <path d="M3 4l2 2-2 2M7 8h4" />
                        </svg>
                      </button>
                      <div className="wf-tb-sep" />
                      <button type="button" className="wf-tb-btn">
                        @
                      </button>
                    </div>
                    <textarea
                      className="wf-editor__area"
                      placeholder="Add a description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="wf-field">
                  <WorkflowAttachmentSection taskId={0} canEdit />
                </div>

                <div className="wf-field">
                  <label className="wf-field__label">Assignee</label>
                  <AssigneeSearch
                    members={members}
                    value={assigneeId}
                    onChange={setAssigneeId}
                  />
                </div>

                <div className="wf-field">
                  <label className="wf-field__label">Labels</label>
                  <select
                    className="wf-select"
                    value={labelId}
                    onChange={(e) => setLabelId(e.target.value)}
                  >
                    <option value="">Select label</option>
                    {labels.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="wf-two-col">
                  <div className="wf-field">
                    <label className="wf-field__label">Priority</label>
                    <select
                      className="wf-select"
                      value={priorityId}
                      onChange={(e) => setPriorityId(e.target.value)}
                    >
                      <option value="">No priority</option>
                      {priorities.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="wf-field">
                    <label className="wf-field__label">Issue type</label>
                    <select
                      className={`wf-select${errors.issueTypeId ? " wf-select--error" : ""}`}
                      value={issueTypeId}
                      onChange={(e) => {
                        setIssueTypeId(e.target.value);
                        if (e.target.value) {
                          setErrors((p) => ({ ...p, issueTypeId: undefined }));
                        }
                      }}
                    >
                      <option value="">Select type</option>
                      {issueTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    {errors.issueTypeId && (
                      <span className="wf-field__error">
                        {errors.issueTypeId}
                      </span>
                    )}
                  </div>
                </div>

                <div className="wf-field">
                  <label className="wf-field__label">
                    Parent <span className="wf-badge-new">NEW</span>
                  </label>
                  <select
                    className="wf-select"
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                  >
                    <option value="">Select parent</option>
                  </select>
                </div>
              </div>

              <div className="wf-modal__footer">
                <label className="wf-checkbox-row">
                  <input
                    type="checkbox"
                    checked={createAnother}
                    onChange={(e) => setCreateAnother(e.target.checked)}
                  />
                  <span>Create another issue</span>
                </label>
                <div className="wf-modal__footer-actions">
                  <button
                    type="button"
                    className="wf-btn wf-btn--ghost"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="wf-btn wf-btn--primary"
                    onClick={handleCreate}
                    disabled={submitting}
                  >
                    {submitting ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="wf-modal__header">
                <div className="wf-modal__header-left">
                  <span className="wf-modal__task-key">
                    {task?.task_key || "TASK"}
                  </span>
                  <div
                    className="wf-status-pill-wrap"
                    style={{ opacity: updatingStatus ? 0.6 : 1 }}
                  >
                    <span
                      className="wf-status-dot"
                      style={{ background: currentStatus?.color ?? "#6B7280" }}
                    />
                    <select
                      className="wf-status-select"
                      value={currentStatusId}
                      disabled={updatingStatus}
                      onChange={(e) =>
                        handleUpdateStatus(Number(e.target.value))
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <span className="wf-status-label">
                      {currentStatus?.name ?? "—"}
                    </span>
                    <svg
                      className="wf-status-caret"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M5 7l3 3 3-3" />
                    </svg>
                  </div>
                  {updatingStatus && (
                    <span style={{ fontSize: 12, color: "#8590a2" }}>
                      Saving...
                    </span>
                  )}
                </div>

                <div className="wf-modal__header-right">
                  {isDoneStatus && !task.is_completed && (
                    <button
                      type="button"
                      className="wf-btn wf-btn--danger wf-btn--sm"
                      onClick={() => setShowCloseDialog(true)}
                      disabled={closingTask}
                    >
                      Đóng issue
                    </button>
                  )}
                  <button
                    className="wf-icon-btn"
                    onClick={onClose}
                    title="Close"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="wf-modal__title-wrap">
                {editingTitle ? (
                  <input
                    ref={titleInputRef}
                    className="wf-modal__title-input"
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTitleSave();
                      if (e.key === "Escape") {
                        setEditingTitle(false);
                        setTitleDraft(task?.title ?? "");
                      }
                    }}
                  />
                ) : (
                  <h2
                    className={`wf-modal__title${onUpdateTask ? " wf-modal__title--editable" : ""}`}
                    onClick={() => onUpdateTask && setEditingTitle(true)}
                    title={onUpdateTask ? "Click to edit" : undefined}
                  >
                    {task?.title}
                  </h2>
                )}
              </div>

              <div className="wf-modal__tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`wf-modal__tab${activeTab === tab.key ? " wf-modal__tab--active" : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="wf-modal__body">
                {activeTab === "detail" && (
                  <WorkflowIssueDetail
                    task={task}
                    members={members}
                    labels={labels}
                    priorities={priorities}
                    issueTypes={issueTypes}
                    statuses={statuses}
                    onUpdateTask={onUpdateTask}
                    onCompleteTask={async () => {
                      await workflowApi.completeTask(task.id, {
                        resolution: "done",
                      });
                      await onRefresh?.();
                      return true;
                    }}
                    onUncompleteTask={async () => {
                      await workflowApi.uncompleteTask(task.id);
                      await onRefresh?.();
                      return true;
                    }}
                    onArchiveTask={async () => {
                      await workflowApi.archiveTask(task.id);
                      await onRefresh?.();
                      return true;
                    }}
                    onUnarchiveTask={async () => {
                      await workflowApi.unarchiveTask(task.id);
                      await onRefresh?.();
                      return true;
                    }}
                  />
                )}
                {activeTab === "comments" && (
                  <WorkflowCommentList
                    taskId={task.id}
                    comments={comments}
                    loading={loadingComments}
                    newComment={newComment}
                    submitting={commentSubmitting}
                    onNewCommentChange={setNewComment}
                    onSubmit={handleAddComment}
                  />
                )}
                {activeTab === "activity" && (
                  <WorkflowActivityList
                    activities={activities}
                    loading={loadingActivities}
                    statuses={statuses}
                    members={members}
                    priorities={priorities}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showCloseDialog && task && (
        <CloseIssueDialog
          taskKey={task.task_key || "TASK"}
          taskTitle={task.title || ""}
          onConfirm={handleCloseIssue}
          onCancel={() => setShowCloseDialog(false)}
          submitting={closingTask}
        />
      )}
    </>
  );
}
