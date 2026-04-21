import { useEffect, useRef, useState } from "react";
import { notificationApi } from "./notification.api";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  task_id?: number;
  task_key?: string;
  task_title?: string;
  is_read: boolean;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

function getTypeInfo(type: string) {
  switch (type) {
    case "task_assigned":
      return {
        icon: "✅",
        bg: "#dcfce7",
        color: "#16a34a",
        label: "Task mới được giao",
      };
    case "task_updated":
      return {
        icon: "✏️",
        bg: "#dbeafe",
        color: "#1d4ed8",
        label: "Task được cập nhật",
      };
    case "task_comment":
      return {
        icon: "💬",
        bg: "#f3e8ff",
        color: "#7c3aed",
        label: "Bình luận mới",
      };
    case "task_completed":
      return {
        icon: "🎉",
        bg: "#dcfce7",
        color: "#16a34a",
        label: "Task hoàn thành",
      };
    case "task_overdue":
      return {
        icon: "⏰",
        bg: "#fee2e2",
        color: "#E24B4A",
        label: "Task quá hạn",
      };
    default:
      return {
        icon: "🔔",
        bg: "#f3f4f6",
        color: "#374151",
        label: "Thông báo",
      };
  }
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res: any = await notificationApi.getNotifications(20);
      setNotifications(res.data?.data ?? []);
      setUnread(res.data?.unread ?? 0);
    } catch (err) {
      console.error("Lỗi load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, right: 16 });
    }
    setOpen((v) => !v);
    if (!open) fetchNotifications();
  };

  const handleReadAll = async () => {
    try {
      await notificationApi.readAllNotifications();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnread(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRead = async (id: number) => {
    try {
      await notificationApi.readNotification(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Bell button */}
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
        {unread > 0 && (
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
              border: "2px solid white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
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
              🔔 Thông báo{" "}
              {unread > 0 && (
                <span style={{ color: "#E24B4A" }}>({unread})</span>
              )}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {notifications.length > 0 && (
                <span style={{ fontSize: 12, color: "#888" }}>
                  {notifications.length} mục
                </span>
              )}
              {unread > 0 && (
                <button
                  onClick={handleReadAll}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    color: "#0052cc",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  Đọc tất cả
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {loading ? (
              <div
                style={{
                  padding: "40px 16px",
                  textAlign: "center",
                  color: "#aaa",
                  fontSize: 13,
                }}
              >
                Đang tải...
              </div>
            ) : notifications.length === 0 ? (
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
              notifications.map((n) => {
                const info = getTypeInfo(n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.is_read && handleRead(n.id)}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f5f5f5",
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      background: n.is_read ? "#fff" : "#fff5f5",
                      cursor: n.is_read ? "default" : "pointer",
                      transition: "background 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: info.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 16,
                      }}
                    >
                      {info.icon}
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
                          color: info.color,
                        }}
                      >
                        {info.label}
                      </p>
                      {n.message && (
                        <p
                          style={{
                            margin: "3px 0 0",
                            fontSize: 12,
                            color: "#6b7280",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {n.message}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 4,
                        }}
                      >
                        {n.task_key && (
                          <span
                            style={{
                              fontSize: 11,
                              background: "#e8f0fe",
                              color: "#0052cc",
                              padding: "1px 6px",
                              borderRadius: 4,
                              fontWeight: 600,
                            }}
                          >
                            {n.task_key}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: "#aaa" }}>
                          {timeAgo(n.created_at)}
                        </span>
                      </div>
                    </div>
                    {!n.is_read && (
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
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
