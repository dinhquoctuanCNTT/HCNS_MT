import { useState } from "react";
import { workflowApi } from "../api/workflow.api";

export function useCreateIssue(projectId?: number, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const createIssue = async (data: { title: string; description?: string }) => {
    if (!projectId) return;

    try {
      setLoading(true);

      await workflowApi.createTask({
        projectId,
        title: data.title,
        description: data.description,
      });

      onSuccess?.(); // reload board
    } catch (err) {
      console.error("Create issue error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { createIssue, loading };
}
