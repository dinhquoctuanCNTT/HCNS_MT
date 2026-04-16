import { useState } from "react";
import { workflowApi } from "../api/workflow.api";
import { useNotificationStore } from "./useNotificationStore"; // ✅ thêm

export function useCreateIssue(projectId?: number, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addNotification = useNotificationStore((s) => s.addNotification); // ✅ thêm

  const createIssue = async (data: {
    title: string;
    description?: string;
    status_id?: number;
    board_id?: number;
    assignee_id?: number | null;
    priority_id?: number | null;
    issue_type_id?: number | null;
    label_id?: number | null;
    parent_id?: number | null;
  }) => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      await workflowApi.createTask({
        project_id: projectId,
        board_id: data.board_id,
        status_id: data.status_id,
        title: data.title,
        description: data.description,
        assignee_id: data.assignee_id ?? null,
        priority_id: data.priority_id ?? null,
        task_type_id: data.issue_type_id ?? null,
        label_id: data.label_id ?? null,
        parent_id: data.parent_id ?? null,
      });

      // ✅ Thông báo tạo task mới thành công
      addNotification({
        id: Date.now(), // dùng timestamp làm id tạm vì chưa có task id thật
        title: data.title,
        roleText: "bạn tạo",
        dueDate: "",
        createdAt: Date.now(),
        type: "new_task",
      });

      onSuccess?.();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Không tạo được issue. Thử lại sau.";
      setError(message);
      console.error("useCreateIssue error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { createIssue, loading, error };
}
