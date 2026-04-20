import { useState, useRef, useEffect } from "react";
import { workflowApi } from "../../api/workflow.api";
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
  if (mime.startsWith("image/"))
    return { icon: "🖼️", bgClass: "wf-attachment__icon--image" };
  if (mime === "application/pdf" || ext === "pdf")
    return { icon: "📄", bgClass: "wf-attachment__icon--pdf" };
  if (mime.includes("word") || ext === "doc" || ext === "docx")
    return { icon: "📝", bgClass: "wf-attachment__icon--word" };
  if (
    mime.includes("spreadsheet") ||
    mime.includes("excel") ||
    ext === "xls" ||
    ext === "xlsx"
  )
    return { icon: "📊", bgClass: "wf-attachment__icon--sheet" };
  if (
    mime.includes("zip") ||
    mime.includes("rar") ||
    ext === "zip" ||
    ext === "rar"
  )
    return { icon: "🗜️", bgClass: "wf-attachment__icon--zip" };
  return { icon: "📎", bgClass: "wf-attachment__icon--default" };
}

// Component hiển thị 1 file
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
  const { icon, bgClass } = getFileIcon(att.mime_type, att.file_name);
  const isImage = att.mime_type.startsWith("image/");

  return (
    <div className="wf-attachment__item has-border">
      <div className={`wf-attachment__thumb ${isImage ? "is-image" : bgClass}`}>
        {isImage ? (
          <img
            src={getFullUrl(att.file_url)}
            alt={att.file_name}
            className="wf-attachment__thumb-image"
          />
        ) : (
          <span className="wf-attachment__thumb-emoji">{icon}</span>
        )}
      </div>

      <div className="wf-attachment__info">
        <div className="wf-attachment__filename" title={att.file_name}>
          {att.file_name}
        </div>
        <div className="wf-attachment__meta">
          {formatBytes(att.file_size)} · {att.uploaded_by} ·{" "}
          {formatDate(att.created_at)}
        </div>
      </div>

      <div className="wf-attachment__actions">
        <a
          href={getFullUrl(att.file_url)}
          download={att.file_name}
          title="Tải xuống"
          className="wf-attachment__icon-btn"
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
            <path d="M8 3v7M5 7l3 3 3-3" />
            <path d="M3 13h10" />
          </svg>
        </a>

        {canDelete &&
          (deleteConfirm ? (
            <div className="wf-attachment__delete-confirm">
              <span className="wf-attachment__delete-text">Xoá?</span>
              <button
                type="button"
                className="wf-attachment__confirm-btn"
                onClick={() => onDelete(att.id)}
              >
                ✓
              </button>
              <button
                type="button"
                className="wf-attachment__cancel-btn"
                onClick={() => setDeleteConfirm(false)}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              title="Xoá file"
              className="wf-attachment__icon-btn wf-attachment__icon-btn--danger"
              onClick={() => setDeleteConfirm(true)}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5l.5-9" />
              </svg>
            </button>
          ))}
      </div>
    </div>
  );
}

export default function WorkflowAttachmentSection({
  taskId,
  canEdit = true,
}: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      .catch((err: any) => console.error("Lỗi load attachments:", err))
      .finally(() => setLoading(false));
  }, [taskId]);

  const handleFiles = async (files: FileList | null) => {
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
        // Upload với type = report (báo cáo tiến độ)
        const res: any = await workflowApi.uploadAttachment(
          taskId,
          formData,
          "report",
        );
        setAttachments((prev) => [...prev, res.data?.data]);
      } catch (err) {
        console.error("Lỗi upload file:", err);
        alert(`Upload file "${file.name}" thất bại`);
      }
    }
    setUploading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await workflowApi.deleteAttachment(taskId, id);
      setAttachments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Lỗi xoá file:", err);
      alert("Xoá file thất bại");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  // Tách 2 loại file
  const assignmentFiles = attachments.filter(
    (a) => a.attachment_type === "assignment",
  );
  const reportFiles = attachments.filter(
    (a) => a.attachment_type === "report" || !a.attachment_type,
  );

  if (loading) {
    return (
      <div className="wf-attachment">
        <div style={{ fontSize: 13, color: "#6b7280", padding: "8px 0" }}>
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="wf-attachment">
      {/* ── PHẦN 1: Tài liệu giao việc ── */}
      <div style={{ marginBottom: 20 }}>
        <h4 className="wf-attachment__title">
          📋 Tài liệu giao việc
          {assignmentFiles.length > 0 && (
            <span className="wf-attachment__count">
              {assignmentFiles.length}
            </span>
          )}
        </h4>

        {assignmentFiles.length > 0 ? (
          <div className="wf-attachment__list">
            {assignmentFiles.map((att) => (
              <AttachmentItem
                key={att.id}
                att={att}
                canDelete={false} // Không cho xoá tài liệu giao việc
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="wf-attachment__empty">Chưa có tài liệu giao việc</div>
        )}
      </div>

      {/* ── PHẦN 2: Tài liệu báo cáo ── */}
      <div>
        <h4 className="wf-attachment__title">
          📊 Tài liệu báo cáo
          {reportFiles.length > 0 && (
            <span className="wf-attachment__count">{reportFiles.length}</span>
          )}
        </h4>

        {canEdit && (
          <div
            className={`wf-attachment__dropzone ${dragOver ? "is-dragover" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
          >
            <div className="wf-attachment__dropzone-icon">
              {uploading ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="#0052cc"
                  strokeWidth="1.8"
                  className="wf-attachment__spinner"
                >
                  <circle cx="8" cy="8" r="6" strokeDasharray="20 18" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M8 11V5M5 8l3-3 3 3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12.5A2.5 2.5 0 004.5 15h7a2.5 2.5 0 000-5H11a4 4 0 10-7.9.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <div>
              <div className="wf-attachment__dropzone-title">
                {uploading
                  ? "Đang tải lên..."
                  : dragOver
                    ? "Thả file vào đây"
                    : "Thêm báo cáo tiến độ"}
              </div>
              <div className="wf-attachment__dropzone-subtitle">
                Kéo thả hoặc click để chọn · Tối đa 20MB/file
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="wf-attachment__input"
              onChange={(e) => handleFiles(e.target.files)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {reportFiles.length > 0 ? (
          <div className="wf-attachment__list">
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
          <div className="wf-attachment__empty">Chưa có tài liệu báo cáo</div>
        )}
      </div>

      {/* Preview ảnh */}
      {previewUrl && (
        <div
          className="wf-attachment__preview"
          onClick={() => setPreviewUrl(null)}
        >
          <img
            src={previewUrl}
            alt=""
            className="wf-attachment__preview-image"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setPreviewUrl(null)}
            className="wf-attachment__preview-close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
