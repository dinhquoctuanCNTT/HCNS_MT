import { useState } from "react";
import { workflowApi } from "../api/workflow.api";

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  task_type_id?: number | null;
  priority_id?: number | null;
  assignee_id?: number | null;
  reporter_id?: number | null;
  parent_task_id?: number | null;
  start_date?: string | null;
  due_date?: string | null;
  status_id?: number | null;
}

/**
 * Hook nhẹ chỉ xử lý updateTask — dùng trong TaskModal / WorkflowIssueDetail
 * Không fetch lại task tự động, gọi onSuccess để parent quyết định refetch gì
 */
export default function useUpdateTask(taskId?: number, onSuccess?: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = async (payload: UpdateTaskPayload): Promise<boolean> => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      setError(null);
      await workflowApi.updateTask(taskId, payload as Record<string, unknown>);
      onSuccess?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không cập nhật được task");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = (statusId: number) =>
    updateTask({ status_id: statusId });

  const updateTitle = (title: string) => updateTask({ title });

  const updateDescription = (description: string) =>
    updateTask({ description });

  const updatePriority = (priorityId: number | null) =>
    updateTask({ priority_id: priorityId });

  const updateType = (taskTypeId: number | null) =>
    updateTask({ task_type_id: taskTypeId });

  const updateAssignee = (assigneeId: number | null) =>
    updateTask({ assignee_id: assigneeId });

  const updateDates = (startDate?: string | null, dueDate?: string | null) =>
    updateTask({ start_date: startDate, due_date: dueDate });

  return {
    submitting,
    error,
    updateTask,
    updateStatus,
    updateTitle,
    updateDescription,
    updatePriority,
    updateType,
    updateAssignee,
    updateDates,
  };
}
