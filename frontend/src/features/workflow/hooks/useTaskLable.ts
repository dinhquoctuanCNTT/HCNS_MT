import { useState } from "react";
import { workflowApi } from "../api/workflow.api";

export default function useTaskLabels(taskId?: number, onMutated?: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLabel = async (labelId: number) => {
    if (!taskId) return false;
    try {
      setSubmitting(true);
      setError(null);
      await workflowApi.addTaskLabel(taskId, { labelId });
      onMutated?.();
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
      setError(null);
      await workflowApi.removeTaskLabel(taskId, labelId);
      onMutated?.();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không xóa được label");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    error,
    addLabel,
    removeLabel,
  };
}
