import { useCallback, useEffect, useState } from "react";
import { workflowApi } from "../api/workflow.api";

export interface Project {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await workflowApi.getProjects();
      const data = res.data?.data ?? res.data ?? [];
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Không lấy được danh sách project",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (payload: {
    code: string;
    name: string;
    description?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await workflowApi.createProject(payload);
      const created = res.data?.data ?? res.data ?? null;
      if (created) setProjects((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không tạo được project");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (
    projectId: number,
    payload: { code?: string; name?: string; description?: string },
  ) => {
    try {
      setLoading(true);
      setError(null);
      const res = await workflowApi.updateProject(projectId, payload);
      const updated = res.data?.data ?? res.data ?? null;
      if (updated) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, ...updated } : p)),
        );
      }
      return updated;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không cập nhật được project");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      setLoading(true);
      setError(null);
      await workflowApi.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không xóa được project");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
