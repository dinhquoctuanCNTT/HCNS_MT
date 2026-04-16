import { useState, useRef } from "react";
import "../../styles/workflow-attachment.css";

export interface Attachment {
  id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
}

interface Props {
  taskId: number;
  canEdit?: boolean;
}

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
  if (mime.startsWith("image/")) {
    return { icon: "🖼️", bgClass: "wf-attachment__icon--image" };
  }
  if (mime === "application/pdf" || ext === "pdf") {
    return { icon: "📄", bgClass: "wf-attachment__icon--pdf" };
  }
  if (mime.includes("word") || ext === "doc" || ext === "docx") {
    return { icon: "📝", bgClass: "wf-attachment__icon--word" };
  }
  if (
    mime.includes("spreadsheet") ||
    mime.includes("excel") ||
    ext === "xls" ||
    ext === "xlsx"
  ) {
    return { icon: "📊", bgClass: "wf-attachment__icon--sheet" };
  }
  if (
    mime.includes("zip") ||
    mime.includes("rar") ||
    ext === "zip" ||
    ext === "rar"
  ) {
    return { icon: "🗜️", bgClass: "wf-attachment__icon--zip" };
  }
  return { icon: "📎", bgClass: "wf-attachment__icon--default" };
}

let _mockId = 100;

export default function WorkflowAttachmentSection({
  taskId,
  canEdit = true,
}: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newItems: Attachment[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 20 * 1024 * 1024) {
        alert(`File "${file.name}" vượt quá 20MB`);
        continue;
      }

      const blobUrl = URL.createObjectURL(file);
      newItems.push({
        id: ++_mockId,
        file_name: file.name,
        file_url: blobUrl,
        file_size: file.size,
        mime_type: file.type || "application/octet-stream",
        uploaded_by: "Bạn",
        uploaded_at: new Date().toISOString(),
      });
    }

    await new Promise((r) => setTimeout(r, 400));
    setAttachments((prev) => [...prev, ...newItems]);
    setUploading(false);
  };

  const handleDelete = (id: number) => {
    URL.revokeObjectURL(attachments.find((a) => a.id === id)?.file_url ?? "");
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="wf-attachment">
      <h4 className="wf-attachment__title">
        Tài liệu đính kèm
        {attachments.length > 0 && (
          <span className="wf-attachment__count">{attachments.length}</span>
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
                  : "Đính kèm file"}
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

      {attachments.length > 0 && (
        <div className="wf-attachment__list">
          {attachments.map((att, idx) => {
            const { icon, bgClass } = getFileIcon(att.mime_type, att.file_name);
            const isImage = att.mime_type.startsWith("image/");

            return (
              <div
                key={att.id}
                className={`wf-attachment__item ${
                  idx < attachments.length - 1 ? "has-border" : ""
                }`}
              >
                <div
                  className={`wf-attachment__thumb ${
                    isImage ? "is-image" : bgClass
                  }`}
                  onClick={() => isImage && setPreviewUrl(att.file_url)}
                >
                  {isImage ? (
                    <img
                      src={att.file_url}
                      alt={att.file_name}
                      className="wf-attachment__thumb-image"
                    />
                  ) : (
                    <span className="wf-attachment__thumb-emoji">{icon}</span>
                  )}
                </div>

                <div className="wf-attachment__info">
                  <div
                    className="wf-attachment__filename"
                    title={att.file_name}
                  >
                    {att.file_name}
                  </div>
                  <div className="wf-attachment__meta">
                    {formatBytes(att.file_size)} · {att.uploaded_by} ·{" "}
                    {formatDate(att.uploaded_at)}
                  </div>
                </div>

                <div className="wf-attachment__actions">
                  <a
                    href={att.file_url}
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

                  {canEdit &&
                    (deleteConfirm === att.id ? (
                      <div className="wf-attachment__delete-confirm">
                        <span className="wf-attachment__delete-text">Xoá?</span>
                        <button
                          type="button"
                          className="wf-attachment__confirm-btn"
                          onClick={() => handleDelete(att.id)}
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          className="wf-attachment__cancel-btn"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        title="Xoá file"
                        className="wf-attachment__icon-btn wf-attachment__icon-btn--danger"
                        onClick={() => setDeleteConfirm(att.id)}
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
          })}
        </div>
      )}

      {!canEdit && attachments.length === 0 && (
        <div className="wf-attachment__empty">Không có tài liệu đính kèm</div>
      )}

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
