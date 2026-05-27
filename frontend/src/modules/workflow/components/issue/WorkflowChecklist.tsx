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
}
