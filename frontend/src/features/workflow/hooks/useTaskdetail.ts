import { useCallback, useEffect, useState } from "react";
import { workflowApi } from "../api/workflow.api";

export interface TaskDetail {
  id: number;
  task_key: string;
  title: string;
  description?: string;
  status_id: number;
  priority?: { id: number; name: string; color?: string } | null;
  taskType?: { id: number; name: string; icon?: string } | null;
  assignee?: { id: number; full_name: string; avatar_url?: string } | null;
  reporter?: { id: number; full_name: string } | null;
  parent_task_id?: number | null;
  start_date?: string | null;
  due_date?: string | null;
  position: number;
  labels: { id: number; name: string; color?: string }[];
  is_completed?: boolean;
  is_archived?: boolean;
  comments: {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
    full_name: string;
    avatar_url?: string;
  }[];
  activities: {
    id: number;
    action_type: string;
    field_name?: string;
    old_value?: string;
    new_value?: string;
    created_at: string;
    full_name: string;
  }[];
  subTasks: TaskDetail[];
}

export default function useTaskDetail(taskId?: number, onMutated?: () => void) {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTask = useCallback(async () => {
    if (!taskId) {
      setTask(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await workflowApi.getTaskDetail(taskId);
      const data = res.data?.data ?? res.data ?? null;
      setTask(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không lấy được task");
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  // Update toàn bộ fields: title, description, priority, type, assignee, dates...
  const updateTask = async (payload: {
    title?: string;
    description?: string;
    task_type_id?: number | null;
    priority_id?: number | null;
    assignee_id?: number | null;
    reporter_id?: number | null;
    parent_task_id?: number | null;
    start_date?: string | null;
    due_date?: string | null;
  }) => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.updateTask(taskId, payload);
      await fetchTask();
      onMutated?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không cập nhật được task");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTask = async () => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.deleteTask(taskId);
      setTask(null);
      onMutated?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không xóa được task");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateAssignee = async (assigneeId: number) => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.updateTaskAssignee(taskId, { assigneeId });
      await fetchTask();
      onMutated?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không cập nhật được assignee");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateDates = async (
    startDate?: string | null,
    dueDate?: string | null,
  ) => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.updateTaskDates(taskId, { startDate, dueDate });
      await fetchTask();
      onMutated?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không cập nhật được ngày");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const addLabel = async (labelId: number) => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.addTaskLabel(taskId, { labelId });
      await fetchTask();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thêm được label");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const removeLabel = async (labelId: number) => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.removeTaskLabel(taskId, labelId);
      await fetchTask();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không xóa được label");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const addComment = async (content: string) => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.addComment(taskId, { content });
      await fetchTask();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thêm được comment");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const createSubTask = async (payload: {
    title: string;
    description?: string;
  }) => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.createSubTask(taskId, payload);
      await fetchTask();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không tạo được subtask");
      return false;
    } finally {
      setSubmitting(false);
    }
  };
  const completeTask = async () => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.completeTask(taskId, {
        resolution: "done",
      });
      await fetchTask();
      onMutated?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không complete được task");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const uncompleteTask = async () => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.uncompleteTask(taskId);
      await fetchTask();
      onMutated?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không uncomplete được task");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const archiveTask = async () => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.archiveTask(taskId);
      await fetchTask();
      onMutated?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không archive được task");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const unarchiveTask = async () => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      await workflowApi.unarchiveTask(taskId);
      await fetchTask();
      onMutated?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không unarchive được task");
      return false;
    } finally {
      setSubmitting(false);
    }
  };
  return {
    task,
    loading,
    submitting,
    error,
    fetchTask,
    updateTask,
    deleteTask,
    updateAssignee,
    updateDates,
    addLabel,
    removeLabel,
    addComment,
    createSubTask,
    completeTask,
    uncompleteTask,
    archiveTask,
    unarchiveTask,
  };
}
