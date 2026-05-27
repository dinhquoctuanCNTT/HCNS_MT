import { useState } from "react";
import { createPortal } from "react-dom";

export type ResolutionType = "done" | "cancelled" | "wont_do";

interface Props {
  taskKey: string;
  taskTitle: string;
  onConfirm: (resolution: ResolutionType, note: string) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

export default function CloseIssueDialog({
  taskKey,
  taskTitle,
  onConfirm,
  onCancel,
  submitting = false,
}: Props) {
  const [selected, setSelected] = useState<ResolutionType>("done");

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          width: 440,
          maxWidth: "95vw",
          boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#0052cc",
                background: "#e8f0fe",
                padding: "2px 6px",
                borderRadius: 3,
                letterSpacing: 0.3,
              }}
            >
              {taskKey}
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>
              Đóng issue
            </span>
          </div>
          <button
            onClick={onCancel}
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px" }}>
          {/* Task title preview */}
          <p
            style={{
              fontSize: 13,
              color: "#374151",
              margin: "0 0 16px",
              padding: "10px 12px",
              background: "#f9fafb",
              borderRadius: 6,
              borderLeft: "3px solid #d1d5db",
            }}
          >
            {taskTitle}
          </p>

          {/* Resolution options */}
          <p
            style={{
              fontSize: 12,
              color: "#6b7280",
              margin: "0 0 10px",
              fontWeight: 500,
            }}
          >
            Lý do đóng
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                value: "done" as ResolutionType,
                label: "Hoàn thành",
                color: "#0f6e56",
                bg: "#f0fdf4",
              },
              {
                value: "cancelled" as ResolutionType,
                label: "Huỷ bỏ",
                color: "#92400e",
                bg: "#fffbeb",
              },
              {
                value: "wont_do" as ResolutionType,
                label: "Không thực hiện",
                color: "#991b1b",
                bg: "#fff1f2",
              },
            ].map((r) => (
              <label
                key={r.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  border: `1.5px solid ${selected === r.value ? r.color : "#e5e7eb"}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  background: selected === r.value ? r.bg : "#fff",
                  transition: "all 0.12s",
                }}
              >
                <input
                  type="radio"
                  name="resolution"
                  value={r.value}
                  checked={selected === r.value}
                  onChange={() => setSelected(r.value)}
                  style={{ accentColor: r.color }}
                />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: r.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: selected === r.value ? 500 : 400,
                    color: "#111827",
                  }}
                >
                  {r.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            background: "#f9fafb",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            style={{
              padding: "7px 16px",
              fontSize: 13,
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
              color: "#374151",
            }}
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selected, "")}
            disabled={submitting}
            style={{
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 6,
              border: "none",
              background: submitting ? "#d1d5db" : "#dc2626",
              color: "#fff",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Đang đóng..." : "Xác nhận đóng"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
