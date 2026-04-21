import { useState, useRef, useEffect } from "react";
import { workflowApi } from "../../api/workflow.api";
import axiosClient from "../../../../api/axiosClient";
import "../../styles/workflow-attachment.css";

export interface Attachment {
  id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
  attachment_type: "assignment" | "report";
}

interface TaskLink {
  id: number;
  task_id: number;
  title: string;
  url: string;
  link_type: string;
  link_category: "assignment" | "report";
  created_by: string;
  created_at: string;
}

interface Props {
  taskId: number | undefined;
  canEdit?: boolean;
}

const getFullUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_API_URL}${url}`;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFileIcon(mime: string, name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (mime.startsWith("image/")) return { icon: "🖼️", bg: "#f3f4f6" };
  if (mime === "application/pdf" || ext === "pdf")
    return { icon: "📄", bg: "#fce4ec" };
  if (mime.includes("word") || ext === "doc" || ext === "docx")
    return { icon: "📝", bg: "#e3f2fd" };
  if (
    mime.includes("spreadsheet") ||
    mime.includes("excel") ||
    ext === "xls" ||
    ext === "xlsx"
  )
    return { icon: "📊", bg: "#e8f5e9" };
  if (
    mime.includes("zip") ||
    mime.includes("rar") ||
    ext === "zip" ||
    ext === "rar"
  )
    return { icon: "🗜️", bg: "#f3f4f6" };
  return { icon: "📎", bg: "#f3f4f6" };
}

function detectLinkType(url: string): string {
  if (url.includes("docs.google.com/spreadsheets")) return "google_sheet";
  if (url.includes("docs.google.com/document")) return "google_doc";
  if (url.includes("docs.google.com/presentation")) return "google_slide";
  if (url.includes("drive.google.com")) return "google_drive";
  if (url.includes("figma.com")) return "figma";
  if (url.includes("notion.so") || url.includes("notion.site")) return "notion";
  if (url.includes("github.com")) return "github";
  return "other";
}

function getLinkConfig(type: string): {
  icon: string;
  bg: string;
  color: string;
  label: string;
} {
  const map: Record<
    string,
    { icon: string; bg: string; color: string; label: string }
  > = {
    google_sheet: {
      icon: "📊",
      bg: "#e8f5e9",
      color: "#2e7d32",
      label: "Sheet",
    },
    google_doc: { icon: "📝", bg: "#e3f2fd", color: "#1565c0", label: "Doc" },
    google_slide: {
      icon: "📽️",
      bg: "#fff3e0",
      color: "#e65100",
      label: "Slides",
    },
    google_drive: {
      icon: "☁️",
      bg: "#e8eaf6",
      color: "#3949ab",
      label: "Drive",
    },
    figma: { icon: "🎨", bg: "#fce4ec", color: "#c2185b", label: "Figma" },
    notion: { icon: "📓", bg: "#f3f4f6", color: "#374151", label: "Notion" },
    github: { icon: "💻", bg: "#f1f5f9", color: "#1e293b", label: "GitHub" },
    other: { icon: "🔗", bg: "#f3f4f6", color: "#6b7280", label: "Link" },
  };
  return map[type] ?? map.other;
}

// ── AttachmentItem ────────────────────────────────────────
function AttachmentItem({
  att,
  canDelete,
  onDelete,
}: {
  att: Attachment;
  canDelete: boolean;
  onDelete: (id: number) => void;
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { icon, bg } = getFileIcon(att.mime_type, att.file_name);
  const isImage = att.mime_type.startsWith("image/");

  return (
    <div
      style={{
        border: "0.5px solid #e5e7eb",
        borderRadius: 8,
        background: "#fff",
        overflow: "hidden",
        position: "relative",
        transition: "border-color 0.12s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db";
        const a = (e.currentTarget as HTMLElement).querySelector(
          ".card-hover-actions",
        ) as HTMLElement;
        if (a) a.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
        const a = (e.currentTarget as HTMLElement).querySelector(
          ".card-hover-actions",
        ) as HTMLElement;
        if (a) a.style.opacity = "0";
      }}
    >
      <div
        style={{
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          fontSize: 26,
        }}
      >
        {isImage ? (
          <img
            src={getFullUrl(att.file_url)}
            alt={att.file_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          icon
        )}
      </div>
      <div style={{ padding: "6px 8px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#111827",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={att.file_name}
        >
          {att.file_name}
        </div>
        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
          {formatBytes(att.file_size)}
        </div>
      </div>
      <div
        className="card-hover-actions"
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          display: "flex",
          gap: 3,
          opacity: 0,
          transition: "opacity 0.12s",
        }}
      >
        <a
          href={getFullUrl(att.file_url)}
          download={att.file_name}
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            border: "none",
            background: "rgba(255,255,255,0.92)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#374151",
            textDecoration: "none",
          }}
          title="Tải xuống"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M8 3v7M5 7l3 3 3-3" />
            <path d="M3 13h10" />
          </svg>
        </a>
        {canDelete && !deleteConfirm && (
          <button
            onClick={() => setDeleteConfirm(true)}
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              border: "none",
              background: "rgba(255,255,255,0.92)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ef4444",
            }}
            title="Xoá"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5l.5-9" />
            </svg>
          </button>
        )}
      </div>
      {deleteConfirm && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>
            Xoá file này?
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => onDelete(att.id)}
              style={{
                height: 24,
                padding: "0 10px",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Xoá
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              style={{
                height: 24,
                padding: "0 10px",
                background: "rgba(255,255,255,0.9)",
                color: "#374151",
                border: "none",
                borderRadius: 5,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── LinkSection ───────────────────────────────────────────
function LinkSection({
  taskId,
  linkCategory,
  canEdit,
}: {
  taskId: number | undefined;
  linkCategory: "assignment" | "report";
  canEdit: boolean;
}) {
  const [links, setLinks] = useState<TaskLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formUrl, setFormUrl] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    load();
  }, [taskId, linkCategory]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(
        `/api/workflow/tasks/${taskId}/links?category=${linkCategory}`,
      );
      setLinks(res.data?.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formUrl.trim() || !formTitle.trim()) return;
    try {
      setSaving(true);
      const link_type = detectLinkType(formUrl);
      const payload = {
        title: formTitle.trim(),
        url: formUrl.trim(),
        link_type,
        link_category: linkCategory,
      };
      if (editingId) {
        await axiosClient.patch(
          `/api/workflow/tasks/${taskId}/links/${editingId}`,
          payload,
        );
      } else {
        await axiosClient.post(`/api/workflow/tasks/${taskId}/links`, payload);
      }
      await load();
      reset();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await axiosClient.delete(`/api/workflow/tasks/${taskId}/links/${id}`);
      setLinks((p) => p.filter((l) => l.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (link: TaskLink) => {
    setEditingId(link.id);
    setFormUrl(link.url);
    setFormTitle(link.title);
    setShowForm(true);
  };

  const reset = () => {
    setShowForm(false);
    setEditingId(null);
    setFormUrl("");
    setFormTitle("");
  };

  if (loading) return null;

  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Liên kết {links.length > 0 && `(${links.length})`}
        </span>
        {canEdit && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              border: "none",
              background: "none",
              color: "#2563eb",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
            Thêm link
          </button>
        )}
      </div>

      {showForm && (
        <div
          style={{
            marginBottom: 8,
            padding: "10px 12px",
            background: "#f9fafb",
            borderRadius: 8,
            border: "0.5px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <input
            autoFocus
            placeholder="Dán URL vào đây..."
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1.5px solid #e5e7eb",
              borderRadius: 6,
              padding: "7px 10px",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
          <input
            placeholder="Tên hiển thị (vd: Báo cáo doanh thu Q1...)"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") reset();
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1.5px solid #e5e7eb",
              borderRadius: 6,
              padding: "7px 10px",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={handleSave}
              disabled={saving || !formUrl.trim() || !formTitle.trim()}
              style={{
                height: 28,
                padding: "0 14px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                opacity:
                  saving || !formUrl.trim() || !formTitle.trim() ? 0.5 : 1,
              }}
            >
              {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm"}
            </button>
            <button
              onClick={reset}
              style={{
                height: 28,
                padding: "0 10px",
                background: "transparent",
                color: "#6b7280",
                border: "0.5px solid #e5e7eb",
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

      {links.length === 0 && !showForm ? (
        <div style={{ fontSize: 11, color: "#9ca3af", fontStyle: "italic" }}>
          Chưa có liên kết.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {links.map((link) => {
            const cfg = getLinkConfig(link.link_type);
            return (
              <div
                key={link.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  background: "#fff",
                  border: "0.5px solid #e5e7eb",
                  borderRadius: 8,
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#f9fafb";
                  const a = (e.currentTarget as HTMLElement).querySelector(
                    ".link-actions",
                  ) as HTMLElement;
                  if (a) a.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#fff";
                  const a = (e.currentTarget as HTMLElement).querySelector(
                    ".link-actions",
                  ) as HTMLElement;
                  if (a) a.style.opacity = "0";
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: cfg.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#1d4ed8",
                      textDecoration: "none",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) =>
                      ((
                        e.currentTarget as HTMLAnchorElement
                      ).style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      ((
                        e.currentTarget as HTMLAnchorElement
                      ).style.textDecoration = "none")
                    }
                  >
                    {link.title}
                  </a>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "2px 7px",
                    borderRadius: 10,
                    background: cfg.bg,
                    color: cfg.color,
                    flexShrink: 0,
                  }}
                >
                  {cfg.label}
                </span>
                <div
                  className="link-actions"
                  style={{
                    display: "flex",
                    gap: 3,
                    flexShrink: 0,
                    opacity: 0,
                    transition: "opacity 0.12s",
                  }}
                >
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(link)}
                      title="Sửa"
                      style={{
                        width: 24,
                        height: 24,
                        border: "0.5px solid #e5e7eb",
                        background: "#fff",
                        borderRadius: 5,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6b7280",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      >
                        <path d="M11 2l3 3-9 9H2v-3L11 2z" />
                      </svg>
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={() => handleDelete(link.id)}
                      disabled={deletingId === link.id}
                      title="Xoá"
                      style={{
                        width: 24,
                        height: 24,
                        border: "0.5px solid #fecaca",
                        background: "#fff",
                        borderRadius: 5,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ef4444",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      >
                        <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5l.5-9" />
                      </svg>
                    </button>
                  )}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 24,
                      height: 24,
                      border: "0.5px solid #e5e7eb",
                      background: "#fff",
                      borderRadius: 5,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                      textDecoration: "none",
                    }}
                    title="Mở link"
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M7 3H3v10h10V9M10 2h4v4M14 2L8 8" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function WorkflowAttachmentSection({
  taskId,
  canEdit = true,
}: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  // ← input đặt ở đây, NGOÀI JSX để tránh conflict
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    workflowApi
      .getAttachments(taskId)
      .then((res: any) => setAttachments(res.data?.data ?? []))
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  }, [taskId]);

  const handleFiles = async (files: FileList | null) => {
    console.log("=== handleFiles called ===", files?.length);

    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (file.size > 20 * 1024 * 1024) {
        alert(`File "${file.name}" vượt quá 20MB`);
        continue;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res: any = await workflowApi.uploadAttachment(
          taskId,
          formData,
          "report",
        );
        // Nếu response có data thì thêm trực tiếp, không thì reload lại
        if (res.data?.data) {
          setAttachments((prev) => [...prev, res.data.data]);
        } else {
          const fresh = await workflowApi.getAttachments(taskId);
          setAttachments(fresh.data?.data ?? []);
        }
      } catch (err) {
        alert(`Upload "${file.name}" thất bại`);
      }
    }
    setUploading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await workflowApi.deleteAttachment(taskId, id);
      setAttachments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Xoá file thất bại");
    }
  };

  const assignmentFiles = attachments.filter(
    (a) => a.attachment_type === "assignment",
  );
  const reportFiles = attachments.filter(
    (a) => a.attachment_type === "report" || !a.attachment_type,
  );

  if (loading)
    return (
      <div style={{ fontSize: 13, color: "#9ca3af", padding: "8px 0" }}>
        Đang tải...
      </div>
    );

  return (
    <div>
      {/* ── input file ĐẶT NGOÀI dropzone để tránh event conflict ── */}
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* ══ PHẦN 1: Tài liệu giao việc ══ */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#374151",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          📋 Tài liệu giao việc
          {assignmentFiles.length > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: "#e0e7ff",
                color: "#3730a3",
                borderRadius: 10,
                padding: "1px 7px",
              }}
            >
              {assignmentFiles.length}
            </span>
          )}
        </div>
        {assignmentFiles.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {assignmentFiles.map((att) => (
              <AttachmentItem
                key={att.id}
                att={att}
                canDelete={false}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              fontSize: 12,
              color: "#9ca3af",
              fontStyle: "italic",
              marginBottom: 8,
            }}
          >
            Chưa có file giao việc
          </div>
        )}
        <LinkSection
          taskId={taskId}
          linkCategory="assignment"
          canEdit={false}
        />
      </div>

      <div
        style={{ height: "0.5px", background: "#f0f0f0", marginBottom: 20 }}
      />

      {/* ══ PHẦN 2: Tài liệu báo cáo ══ */}
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#374151",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          📊 Tài liệu báo cáo
          {reportFiles.length > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: "#e0e7ff",
                color: "#3730a3",
                borderRadius: 10,
                padding: "1px 7px",
              }}
            >
              {reportFiles.length}
            </span>
          )}
        </div>

        {/* ── Dropzone — input đã ở ngoài, chỉ cần gọi ref.click() ── */}
        {canEdit && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              border: `1.5px dashed ${dragOver ? "#2563eb" : "#d1d5db"}`,
              borderRadius: 8,
              cursor: "pointer",
              background: dragOver ? "#eff6ff" : "#fafafa",
              transition: "all 0.15s",
              marginBottom: 10,
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background: "#e0e7ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {uploading ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.8"
                >
                  <circle cx="8" cy="8" r="6" strokeDasharray="20 18" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="#4338ca"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M8 11V5M5 8l3-3 3 3" />
                  <path d="M2 12.5A2.5 2.5 0 004.5 15h7a2.5 2.5 0 000-5H11a4 4 0 10-7.9.5" />
                </svg>
              )}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                {uploading ? "Đang tải lên..." : "Tải lên file báo cáo"}
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                Kéo thả hoặc click · Tối đa 20MB
              </div>
            </div>
          </div>
        )}

        {reportFiles.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {reportFiles.map((att) => (
              <AttachmentItem
                key={att.id}
                att={att}
                canDelete={canEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              fontSize: 12,
              color: "#9ca3af",
              fontStyle: "italic",
              marginBottom: 8,
            }}
          >
            Chưa có file báo cáo
          </div>
        )}

        <LinkSection taskId={taskId} linkCategory="report" canEdit={canEdit} />
      </div>
    </div>
  );
}
