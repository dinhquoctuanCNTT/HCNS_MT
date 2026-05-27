import { useState, useEffect, useRef } from "react";
import { workflowApi } from "../../api/workflow.api";

interface Dependency {
  id: number;
  depends_on_id: number;
  task_key: string;
  title: string;
  is_completed: boolean;
  status_name?: string;
  status_color?: string;
}

interface Props {
  taskId: number;
  projectId: number;
  canEdit?: boolean;
}

export default function WorkflowDependencies({
  taskId,
  projectId,
  canEdit = true,
}: Props) {
  const [deps, setDeps] = useState<Dependency[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    workflowApi
      .getDependencies(taskId)
      .then((res: any) => setDeps(res.data?.data ?? []))
      .catch((err: any) => console.error("Lỗi load dependencies:", err))
      .finally(() => setLoading(false));
  }, [taskId]);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setAdding(false);
        setSearch("");
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tìm task theo keyword
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const res: any = await workflowApi.getBoard(projectId, {
          keyword: search,
        });
        const columns = res.data?.data?.columns ?? [];
        const tasks = columns
          .flatMap((c: any) => c.tasks ?? [])
          .filter(
            (t: any) =>
              t.id !== taskId && !deps.some((d) => d.depends_on_id === t.id),
          );
        setSearchResults(tasks.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, projectId, taskId, deps]);

  const handleAdd = async (dependsOnId: number) => {
    try {
      await workflowApi.addDependency(taskId, dependsOnId);
      const res: any = await workflowApi.getDependencies(taskId);
      setDeps(res.data?.data ?? []);
      setAdding(false);
      setSearch("");
      setSearchResults([]);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        alert("Dependency đã tồn tại");
      } else {
        console.error("Lỗi thêm dependency:", err);
      }
    }
  };

  const handleRemove = async (dependsOnId: number) => {
    try {
      await workflowApi.removeDependency(taskId, dependsOnId);
      setDeps((prev) => prev.filter((d) => d.depends_on_id !== dependsOnId));
    } catch (err) {
      console.error("Lỗi xoá dependency:", err);
    }
  };

  if (loading) return null;
}
