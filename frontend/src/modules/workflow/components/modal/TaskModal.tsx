import { useState, useEffect, useRef } from "react";
import { BoardTask } from "../../hooks/useWorkflowBoard";
import { UpdateTaskPayload } from "../../hooks/useUpdateTask";
import WorkflowIssueDetail from "../issue/WorkflowIssueDetail";
import WorkflowCommentList from "../issue/WorkflowCommentList";
import WorkflowActivityList from "../issue/WorkflowActivityList";
import WorkflowAttachmentSection from "../issue/WorkflowAttachmentSection";
import { workflowApi } from "../../api/workflow.api";
import "../../styles/workflow-form.css";
import "../../styles/task-modal.css";
import CloseIssueDialog, { ResolutionType } from "./CloseIssueDialog";

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
  currentUserId?: number;
  onClose: () => void;
  onCreate?: (payload: any) => Promise<any>;
  onUpdateTask?: (payload: UpdateTaskPayload) => Promise<boolean>;
  onUpdateStatus?: (statusId: number) => Promise<boolean>;
  onRefresh?: () => Promise<void> | void;
}

type RightPaneTab = "chat" | "activity" | "attachments";

function DueDateBadge({ dueDate }: { dueDate?: string | null }) {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / 86400000);

  if (diffDays < 0) {
    return (
      <span className="tm-due-overdue">
        ⚠ Quá hạn {Math.abs(diffDays)} ngày
      </span>
    );
  }
  if (diffDays === 0) {
    return <span className="tm-due-overdue">⚠ Đến hạn hôm nay</span>;
  }
  if (diffDays <= 3) {
    return <span className="tm-due-soon">⏰ Còn {diffDays} ngày</span>;
  }
  return null;
}

function MultiAssigneeSearch({
  members,
  value,
  onChange,
  currentUserId,
}: {
  members: any[];
  value: number[];
  onChange: (val: number[]) => void;
  currentUserId?: number;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = members.filter((m) =>
    (m.full_name || m.name || m.email || "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const selectedMembers = members.filter((m) => value.includes(Number(m.id)));
  const isSelected = (id: number) => value.includes(Number(id));

  const toggleMember = (id: number) => {
    const memberId = Number(id);
    if (value.includes(memberId)) {
      onChange(value.filter((x) => x !== memberId));
    } else {
      onChange([...value, memberId]);
    }
  };

  const removeMember = (id: number) => {
    onChange(value.filter((x) => x !== Number(id)));
  };

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => {
          setOpen((p) => !p);
          setSearch("");
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          border: "2px solid #e5e7eb",
          borderRadius: 8,
          padding: "9px 12px",
          background: "#fff",
          minHeight: 44,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
          {selectedMembers.length > 0 ? (
            selectedMembers.map((m) => (
              <span
                key={m.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  border: "1px solid #bfdbfe",
                  borderRadius: 999,
                  padding: "4px 8px",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {m.full_name || m.name || m.email}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMember(m.id);
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#2563eb",
                    fontSize: 14,
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span style={{ color: "#9ca3af", fontSize: 14 }}>
              Chọn người phụ trách
            </span>
          )}
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="#6b7280"
          strokeWidth="1.5"
        >
          <path d="M5 7l3 3 3-3" />
        </svg>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            zIndex: 2000,
            maxHeight: 280,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: 8 }}>
            <input
              autoFocus
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "2px solid #2563eb",
                borderRadius: 6,
                padding: "7px 10px",
                fontSize: 13,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ overflowY: "auto", maxHeight: 220 }}>
            {filtered.map((m) => {
              const checked = isSelected(m.id);
              const isMe =
                currentUserId && Number(currentUserId) === Number(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => toggleMember(m.id)}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    background: checked ? "#eff6ff" : "transparent",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <input type="checkbox" checked={checked} readOnly />
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#2563eb",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {(m.full_name || m.name || m.email)?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>
                      {m.full_name || m.name}
                      {isMe ? " (Bạn)" : ""}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>
                      {m.email}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (!currentUserId) return;
          const myId = Number(currentUserId);
          if (!value.includes(myId)) {
            onChange([...value, myId]);
          }
        }}
        style={{
          marginTop: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
          width: "100%",
          height: 36,
          border: "1.5px dashed #93c5fd",
          borderRadius: 8,
          background: "#eff6ff",
          color: "#2563eb",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          justifyContent: "center",
          fontFamily: "inherit",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <circle cx="8" cy="6" r="3" />
          <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" />
        </svg>
        Giao cho tôi
      </button>
    </div>
  );
}
const formatDateValue = (date?: string | null) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
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
  currentUserId,
  onClose,
  onCreate,
  onUpdateTask,
  onUpdateStatus,
  onRefresh,
}: TaskModalProps) {
  const isCreate = !task;

  const [rightPaneTab, setRightPaneTab] = useState<RightPaneTab>("chat");
  const [comments, setComments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task?.title ?? "");
  const [overrideStatusId, setOverrideStatusId] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closingTask, setClosingTask] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issueTypeId, setIssueTypeId] = useState<any>("");
  const [assigneeIds, setAssigneeIds] = useState<number[]>([]);
  const [priorityId, setPriorityId] = useState<any>("");
  const [labelId, setLabelId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [createAnother, setCreateAnother] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    issueTypeId?: string;
  }>({});

  const currentStatusId =
    overrideStatusId ??
    Number(task?.status_id ?? (task as any)?.status?.id ?? 0);

  const currentStatus = statuses.find(
    (s) => Number(s.id) === Number(currentStatusId),
  );

  const isDoneStatus =
    currentStatus?.name?.toLowerCase() === "done" ||
    currentStatus?.name?.toLowerCase() === "hoàn thành";

  useEffect(() => {
    setOverrideStatusId(null);
    setTitleDraft(task?.title ?? "");
    setEditingTitle(false);
    setShowCloseDialog(false);
    setComments([]);
    setActivities([]);
    setRightPaneTab("chat");
  }, [task?.id]);

  useEffect(() => {
    if (!task?.id) return;
    fetchComments();
    fetchActivities();
  }, [task?.id]);

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus();
  }, [editingTitle]);

  useEffect(() => {
    if (!isCreate || !currentUserId) return;
    setAssigneeIds((prev) =>
      prev.includes(Number(currentUserId)) ? prev : [Number(currentUserId)],
    );
  }, [isCreate, currentUserId]);

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
    if (!task?.id || Number(newStatusId) === Number(currentStatusId)) {
      return;
    }

    try {
      setUpdatingStatus(true);

      const success = onUpdateTask
        ? await onUpdateTask({
            status_id: newStatusId,
          })
        : await workflowApi.updateTask(task.id, {
            status_id: newStatusId,
          });

      if (success) {
        setOverrideStatusId(newStatusId);
        await onRefresh?.();
      }
    } catch (e) {
      console.error(e);
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

    const success = await onUpdateTask?.({
      title: trimmed,
    });

    if (success) {
      setEditingTitle(false);
    }
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
      console.error(e);
    } finally {
      setClosingTask(false);
      setShowCloseDialog(false);
    }
  };

  const handleCreate = async () => {
    const newErrors: { title?: string; issueTypeId?: string } = {};
    if (!title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
    if (!issueTypeId) newErrors.issueTypeId = "Vui lòng chọn loại";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const createdTask: any = await onCreate?.({
      title: title.trim(),
      description: description.trim(),
      project_id: projectId,
      board_id: boardId,
      status_id: statuses?.[0]?.id || null,
      assignee_id: assigneeIds[0] ?? null,
      assignee_ids: assigneeIds,
      priority_id: priorityId ? Number(priorityId) : null,
      issue_type_id: issueTypeId ? Number(issueTypeId) : null,
      label_id: labelId ? Number(labelId) : null,
      start_date: startDate || null,
      due_date: dueDate || null,
      reporter_id: currentUserId ?? null,
    });
    if (!createdTask?.id) {
      console.error("Không tạo được task");
      return;
    }
    for (const file of pendingFiles) {
      try {
        await workflowApi.uploadAttachment(createdTask.id, file, "assignment");
      } catch (err) {
        console.error(err);
      }
    }
    // ← THÊM 2 DÒNG NÀY
    console.log("=== createdTask ===", createdTask);
    console.log("=== pendingFiles ===", pendingFiles);
    // SAU — truyền File trực tiếp, bỏ FormData trung gian
    for (const file of pendingFiles) {
      try {
        await workflowApi.uploadAttachment(createdTask.id, file, "assignment");
      } catch (err) {
        console.error("Upload file thất bại:", err);
      }
    }
    if (createAnother) {
      setTitle("");
      setDescription("");
      setIssueTypeId("");
      setAssigneeIds(currentUserId ? [Number(currentUserId)] : []);
      setPriorityId("");
      setLabelId("");
      setStartDate("");
      setDueDate("");
      setPendingFiles([]);
      return;
    }

    onClose();
  };

  const getFileEmoji = (type: string) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("word")) return "📝";
    if (type.includes("sheet") || type.includes("excel")) return "📊";
    return "📎";
  };

  const formatSize = (b: number) =>
    b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;

  if (isCreate) {
    return (
      <div
        className="ci-backdrop"
        onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains("ci-backdrop")) {
            onClose();
          }
        }}
      >
        <div className="ci-modal">
          <div className="ci-header">
            <h2 className="ci-header__title">✏️ Tạo công việc mới</h2>
            <button className="ci-close" onClick={onClose} title="Đóng">
              ✕
            </button>
          </div>

          <div className="ci-body">
            <div className="ci-field">
              <label className="ci-label">
                Tiêu đề công việc <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                className="ci-title-input"
                placeholder="Ví dụ: Báo cáo doanh thu tháng 4..."
                value={title}
                autoFocus
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((p) => ({ ...p, title: undefined }));
                  }
                }}
                style={errors.title ? { borderColor: "#ef4444" } : {}}
              />
              {errors.title && <span className="ci-error">{errors.title}</span>}
            </div>

            <div className="ci-field">
              <label className="ci-label">
                Loại công việc <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                className="ci-select"
                value={issueTypeId}
                onChange={(e) => {
                  setIssueTypeId(e.target.value);
                  if (e.target.value) {
                    setErrors((p) => ({ ...p, issueTypeId: undefined }));
                  }
                }}
                style={errors.issueTypeId ? { borderColor: "#ef4444" } : {}}
              >
                <option value="">Chọn loại...</option>
                {issueTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {errors.issueTypeId && (
                <span className="ci-error">{errors.issueTypeId}</span>
              )}
            </div>

            <div className="ci-field">
              <label className="ci-label">Người phụ trách</label>
              <MultiAssigneeSearch
                members={members}
                value={assigneeIds}
                onChange={setAssigneeIds}
                currentUserId={currentUserId}
              />
            </div>

            <div className="ci-two-col">
              <div className="ci-field">
                <label className="ci-label">📅 Ngày bắt đầu</label>
                <input
                  type="date"
                  className="ci-select"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ backgroundImage: "none", padding: "9px 12px" }}
                />
              </div>
              <div className="ci-field">
                <label className="ci-label">⏰ Ngày kết thúc</label>
                <input
                  type="date"
                  className="ci-select"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    backgroundImage: "none",
                    padding: "9px 12px",
                    borderColor:
                      dueDate && new Date(dueDate) < new Date()
                        ? "#ef4444"
                        : undefined,
                  }}
                />
              </div>
            </div>

            <div className="ci-advanced-section">
              <div className="ci-field">
                <label className="ci-label">Mô tả</label>
                <textarea
                  className="ci-textarea"
                  placeholder="Thêm mô tả chi tiết..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="ci-two-col">
                <div className="ci-field">
                  <label className="ci-label">Ưu tiên</label>
                  <select
                    className="ci-select"
                    value={priorityId}
                    onChange={(e) => setPriorityId(e.target.value)}
                  >
                    <option value="">Không ưu tiên</option>
                    {priorities.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ci-field">
                  <label className="ci-label">Danh mục</label>
                  <select
                    className="ci-select"
                    value={labelId}
                    onChange={(e) => setLabelId(e.target.value)}
                  >
                    <option value="">Không chọn danh mục</option>
                    {labels.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ci-field">
                <label className="ci-label">Tài liệu đính kèm</label>
                {/* ✅ FIX: dùng ref thay vì document.getElementById */}
                <div
                  className={`ci-upload-zone${pendingFiles.length > 0 ? " ci-upload-zone--active" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    setPendingFiles((p) => [
                      ...p,
                      ...Array.from(e.dataTransfer.files),
                    ]);
                  }}
                >
                  <div className="ci-upload-icon">📎</div>
                  <div className="ci-upload-text">
                    <strong>
                      {pendingFiles.length > 0
                        ? `${pendingFiles.length} file đã chọn`
                        : "Kéo thả hoặc click để chọn file. Vui lòng đặt tên file không dấu"}
                    </strong>
                    <span>Tối đa 20MB/file</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      console.log("=== files selected ===", e.target.files);
                      const newFiles = Array.from(e.target.files ?? []);
                      console.log("=== newFiles ===", newFiles);
                      setPendingFiles((p) => [...p, ...newFiles]);
                      e.target.value = "";
                    }}
                  />
                </div>

                {pendingFiles.length > 0 && (
                  <div className="ci-file-list">
                    {pendingFiles.map((f, i) => (
                      <div key={i} className="ci-file-item">
                        <span className="ci-file-icon">
                          {getFileEmoji(f.type)}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="ci-file-name">{f.name}</div>
                          <div className="ci-file-size">
                            {formatSize(f.size)}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="ci-file-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPendingFiles((p) =>
                              p.filter((_, idx) => idx !== i),
                            );
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="ci-footer">
            <label className="ci-checkbox-label">
              <input
                type="checkbox"
                checked={createAnother}
                onChange={(e) => setCreateAnother(e.target.checked)}
              />
              Tạo thêm
            </label>
            <div className="ci-footer-btns">
              <button
                type="button"
                className="ci-btn ci-btn--cancel"
                onClick={onClose}
              >
                Huỷ
              </button>
              <button
                type="button"
                className="ci-btn ci-btn--submit"
                onClick={handleCreate}
                disabled={submitting}
              >
                {submitting ? "Đang tạo..." : "Tạo công việc"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="tm-overlay" onClick={onClose} />
      <div className="tm-panel tm-panel--workspace">
        <div className="tm-header">
          <div className="tm-header__left">
            <span className="tm-task-key">{task?.task_key || "TASK"}</span>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                height: 28,
                padding: "0 10px",
                background: `${currentStatus?.color ?? "#6b7280"}18`,
                border: `1.5px solid ${currentStatus?.color ?? "#6b7280"}40`,
                borderRadius: 20,
                opacity: updatingStatus ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: currentStatus?.color ?? "#6b7280",
                  flexShrink: 0,
                }}
              />
              <select
                className="tm-status-select"
                value={currentStatusId}
                disabled={updatingStatus}
                onChange={(e) => handleUpdateStatus(Number(e.target.value))}
                style={{
                  color: currentStatus?.color ?? "#6b7280",
                  fontWeight: 700,
                }}
              >
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <DueDateBadge dueDate={task?.due_date} />
          </div>

          <div className="tm-header__right">
            {isDoneStatus && !task?.is_completed && (
              <button
                type="button"
                className="tm-btn--danger"
                onClick={() => setShowCloseDialog(true)}
                disabled={closingTask}
              >
                Đóng issue
              </button>
            )}

            {isDoneStatus && !task?.is_completed && (
              <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
            )}

            <button
              className="tm-icon-btn"
              onClick={onClose}
              title="Đóng panel"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>

        <div className="tm-title-wrap">
          {editingTitle ? (
            <input
              ref={titleInputRef}
              className="tm-title-input"
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
              className={`tm-title${onUpdateTask ? " tm-title--editable" : ""}`}
              onClick={() => onUpdateTask && setEditingTitle(true)}
            >
              {task?.title}
            </h2>
          )}
        </div>

        <div className="tm-workspace">
          <div className="tm-workspace__left">
            {task && (
              <WorkflowIssueDetail
                task={task}
                projectId={projectId}
                members={members}
                labels={labels}
                priorities={priorities}
                issueTypes={issueTypes}
                statuses={statuses}
                onUpdateTask={onUpdateTask}
              />
            )}
          </div>

          <div className="tm-workspace__right">
            <div className="tm-side-tabs">
              <button
                type="button"
                className={`tm-side-tab${rightPaneTab === "chat" ? " tm-side-tab--active" : ""}`}
                onClick={() => setRightPaneTab("chat")}
              >
                Trao đổi
              </button>
              <button
                type="button"
                className={`tm-side-tab${rightPaneTab === "activity" ? " tm-side-tab--active" : ""}`}
                onClick={() => setRightPaneTab("activity")}
              >
                Hoạt động
              </button>
              <button
                type="button"
                className={`tm-side-tab${rightPaneTab === "attachments" ? " tm-side-tab--active" : ""}`}
                onClick={() => setRightPaneTab("attachments")}
              >
                Tài liệu
              </button>
            </div>

            <div className="tm-side-content">
              {task && rightPaneTab === "chat" && (
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

              {task && rightPaneTab === "activity" && (
                <WorkflowActivityList
                  activities={activities}
                  loading={loadingActivities}
                  statuses={statuses}
                  members={members}
                  priorities={priorities}
                />
              )}

              {task && rightPaneTab === "attachments" && (
                <WorkflowAttachmentSection taskId={task.id} canEdit={true} />
              )}
            </div>
          </div>
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
