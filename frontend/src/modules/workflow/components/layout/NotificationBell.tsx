// features/workflow/components/layout/NotificationBell.tsx
import { useEffect, useRef, useState } from "react";
import { useNotificationStore } from "../../hooks/useNotificationStore";

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const notifications = useNotificationStore((s) => s.notifications);
  const markAllSeen = useNotificationStore((s) => s.markAllSeen);
  const clearAll = useNotificationStore((s) => s.clearAll);
  const unseenCount = useNotificationStore((s) => s.unseenCount());

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: 16, // ← số cố định, cách mép phải màn hình 16px
      });
    }
    setOpen((v) => !v);
    if (!open) markAllSeen();
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* ── Bell button ── */}
      <button
        onClick={handleOpen}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "inherit",
        }}
        title="Thông báo"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unseenCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -4,
              minWidth: 18,
              height: 18,
              background: "#22c55e",
              color: "#fff",
              borderRadius: 9,
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              lineHeight: 1,
              border: "2px solid white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            {unseenCount > 99 ? "99+" : unseenCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: dropdownPos.top,
            right: dropdownPos.right,
            width: 400,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#fafafa",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>
              🔔 Thông báo
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {notifications.length > 0 && (
                <span style={{ fontSize: 12, color: "#888" }}>
                  {notifications.length} mục
                </span>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    color: "#E24B4A",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  Xóa tất cả
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: "40px 16px",
                  textAlign: "center",
                  color: "#aaa",
                  fontSize: 13,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔕</div>
                Không có thông báo nào
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={`${n.id}-${n.createdAt}`}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f5f5f5",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    background: n.seenAt ? "#fff" : "#fff5f5",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background:
                        (n as any).type === "new_task" ? "#dcfce7" : "#fee2e2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 16,
                    }}
                  >
                    {(n as any).type === "new_task" ? "✅" : "⏰"}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: "#111",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {n.title}
                    </p>

                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: 12,
                        fontWeight: 500,
                        color:
                          (n as any).type === "new_task"
                            ? "#16a34a"
                            : "#E24B4A",
                      }}
                    >
                      {(n as any).type === "new_task"
                        ? "Task mới đã được tạo"
                        : `Task ${n.roleText} đã quá hạn`}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      {(n as any).type !== "new_task" && n.dueDate && (
                        <span
                          style={{
                            fontSize: 11,
                            background: "#fee2e2",
                            color: "#E24B4A",
                            padding: "1px 6px",
                            borderRadius: 4,
                            fontWeight: 500,
                          }}
                        >
                          Hạn: {formatDate(n.dueDate)}
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: "#aaa" }}>
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  </div>

                  {!n.seenAt && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#E24B4A",
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
