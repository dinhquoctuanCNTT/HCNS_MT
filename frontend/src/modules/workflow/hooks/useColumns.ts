import { useState } from "react";
import { workflowApi } from "../api/workflow.api";

export default function useColumns(projectId?: number, onMutated?: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createColumn = async (payload: {
    status_id: number;
    name: string;
    position?: number;
    wip_limit?: number | null;
  }) => {
    if (!projectId) return null;
    try {
      setSubmitting(true);
      setError(null);
      const res = await workflowApi.createColumn(projectId, payload);
      const data = res.data?.data ?? res.data ?? null;
      onMutated?.();
      return data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không tạo được column");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const updateColumn = async (
    columnId: number,
    payload: {
      status_id?: number;
      name?: string;
      position?: number;
      wip_limit?: number | null;
    },
  ) => {
    if (!projectId) return null;
    try {
      setSubmitting(true);
      setError(null);
      const res = await workflowApi.updateColumn(projectId, columnId, payload);
      const data = res.data?.data ?? res.data ?? null;
      onMutated?.();
      return data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không cập nhật được column");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteColumn = async (columnId: number) => {
    if (!projectId) return false;
    try {
      setSubmitting(true);
      setError(null);
      await workflowApi.deleteColumn(projectId, columnId);
      onMutated?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không xóa được column");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    error,
    createColumn,
    updateColumn,
    deleteColumn,
  };
}
