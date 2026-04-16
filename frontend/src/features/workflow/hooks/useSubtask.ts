import { useCallback, useEffect, useState } from "react";
import { workflowApi } from "../api/workflow.api";

export interface SubTask {
  id: number;
  task_key: string;
  title: string;
  status_id: number;
  assignee?: { id: number; full_name: string; avatar_url?: string } | null;
  priority?: { id: number; name: string; color?: string } | null;
  position: number;
}

export default function useSubTasks(
  parentTaskId?: number,
  onMutated?: () => void,
) {
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubTasks = useCallback(async () => {
    if (!parentTaskId) {
      setSubTasks([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await workflowApi.getSubTasks(parentTaskId);
      const data = res.data?.data ?? res.data ?? [];
      setSubTasks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không lấy được subtask");
    } finally {
      setLoading(false);
    }
  }, [parentTaskId]);

  useEffect(() => {
    fetchSubTasks();
  }, [fetchSubTasks]);

  const createSubTask = async (payload: {
    title: string;
    description?: string;
    assignee_id?: number | null;
    priority_id?: number | null;
  }) => {
    if (!parentTaskId) return null;
    try {
      setSubmitting(true);
      setError(null);
      const res = await workflowApi.createSubTask(parentTaskId, payload);
      const data = res.data?.data ?? res.data ?? null;
      await fetchSubTasks();
      onMutated?.();
      return data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không tạo được subtask");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    subTasks,
    loading,
    submitting,
    error,
    fetchSubTasks,
    createSubTask,
  };
}
