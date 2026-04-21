import { useState, useEffect, useRef } from "react";
import { workflowApi } from "../../api/workflow.api";

interface Checklist {
  id: number;
  task_id: number;
  title: string;
  is_done: boolean;
  position: number;
  created_at: string;
}

interface Props {
  taskId: number;
  canEdit?: boolean;
}

export default function WorkflowChecklist({ taskId, canEdit = true }: Props) {
  const [items, setItems] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const doneCount = items.filter((i) => i.is_done).length;
  const total = items.length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    workflowApi
      .getChecklists(taskId)
      .then((res: any) => setItems(res.data?.data ?? []))
      .catch((err: any) => console.error("Lỗi load checklist:", err))
      .finally(() => setLoading(false));
  }, [taskId]);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const handleToggle = async (item: Checklist) => {
    try {
      const res: any = await workflowApi.toggleChecklist(
        taskId,
        item.id,
        !item.is_done,
      );
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, is_done: res.data?.data?.is_done ?? !item.is_done }
            : i,
        ),
      );
    } catch (err) {
      console.error("Lỗi toggle checklist:", err);
    }
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    try {
      const res: any = await workflowApi.createChecklist(taskId, {
        title: newTitle.trim(),
        position: items.length,
      });
      setItems((prev) => [...prev, res.data?.data]);
      setNewTitle("");
      setAdding(false);
    } catch (err) {
      console.error("Lỗi thêm checklist:", err);
    }
  };

  const handleEdit = async (item: Checklist) => {
    if (!editTitle.trim() || editTitle === item.title) {
      setEditingId(null);
      return;
    }
    try {
      const res: any = await workflowApi.updateChecklist(taskId, item.id, {
        title: editTitle.trim(),
        is_done: item.is_done,
      });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? res.data?.data : i)),
      );
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi sửa checklist:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await workflowApi.deleteChecklist(taskId, id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Lỗi xoá checklist:", err);
    }
  };

  if (loading)
    return (
      <div style={{ fontSize: 13, color: "#6b7280", padding: "8px 0" }}>
        Đang tải...
      </div>
    );

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ✅ Checklist
          {total > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: percent === 100 ? "#dcfce7" : "#e0e7ff",
                color: percent === 100 ? "#166534" : "#3730a3",
                borderRadius: 10,
                padding: "1px 7px",
              }}
            >
              {doneCount}/{total}
            </span>
          )}
        </h4>
        {canEdit && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            style={{
              background: "none",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 12,
              cursor: "pointer",
              color: "#374151",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            + Thêm
          </button>
        )}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 6,
                background: "#e5e7eb",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${percent}%`,
                  background: percent === 100 ? "#22c55e" : "#0052cc",
                  borderRadius: 3,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: "#6b7280", minWidth: 30 }}>
              {percent}%
            </span>
          </div>
        </div>
      )}

      {/* Checklist items */}
      {items.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginBottom: 8,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 6,
                background: item.is_done ? "#f0fdf4" : "#fff",
                border: "1px solid #f3f4f6",
                transition: "background 0.15s",
              }}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={item.is_done}
                onChange={() => handleToggle(item)}
                disabled={!canEdit}
                style={{
                  width: 16,
                  height: 16,
                  cursor: canEdit ? "pointer" : "default",
                  accentColor: "#0052cc",
                  flexShrink: 0,
                }}
              />

              {/* Title hoặc edit input */}
              {editingId === item.id ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleEdit(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEdit(item);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  style={{
                    flex: 1,
                    border: "1px solid #0052cc",
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              ) : (
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    color: item.is_done ? "#6b7280" : "#111827",
                    textDecoration: item.is_done ? "line-through" : "none",
                    cursor: canEdit ? "pointer" : "default",
                  }}
                  onDoubleClick={() => {
                    if (!canEdit) return;
                    setEditingId(item.id);
                    setEditTitle(item.title);
                  }}
                  title={canEdit ? "Double click để sửa" : undefined}
                >
                  {item.title}
                </span>
              )}

              {/* Nút xoá */}
              {canEdit && editingId !== item.id && (
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    padding: 2,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    opacity: 0,
                  }}
                  className="checklist-delete-btn"
                  title="Xoá"
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
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
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form thêm mới */}
      {adding && (
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") {
                setAdding(false);
                setNewTitle("");
              }
            }}
            placeholder="Nhập nội dung checklist..."
            style={{
              flex: 1,
              border: "1px solid #0052cc",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 13,
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={handleAdd}
            style={{
              background: "#0052cc",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Thêm
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              setNewTitle("");
            }}
            style={{
              background: "#f3f4f6",
              color: "#374151",
              border: "none",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Huỷ
          </button>
        </div>
      )}

      {!canEdit && items.length === 0 && (
        <div style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>
          Chưa có checklist
        </div>
      )}
    </div>
  );
}
