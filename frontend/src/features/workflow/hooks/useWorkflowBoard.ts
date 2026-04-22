import { useCallback, useEffect, useMemo, useState } from "react";
import { workflowApi } from "../api/workflow.api";

export interface BoardTask {
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
  comments?: any[];
  is_completed?: boolean;
  is_archived?: boolean;
}

export interface BoardColumn {
  id: number;
  name: string;
  position: number;
  wip_limit?: number | null;
  status?: { id: number; name: string; color?: string } | null;
  tasks: BoardTask[];
}

export interface BoardProject {
  id: number;
  code?: string;
  key?: string;
  name: string;
  description?: string;
  boardName?: string;
}

// Params cho server-side filter — khớp với backend findTasksByBoard
export interface BoardFilterParams {
  keyword?: string;
  assigneeId?: number;
  priorityId?: number;
}

interface BoardData {
  project: BoardProject | null;
  board: { id: number; name: string } | null;
  columns: BoardColumn[];
}

function toArray<T = any>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}

function pickColumns(rawData: any): any[] {
  return (
    rawData?.columns ||
    rawData?.board?.columns ||
    rawData?.data?.columns ||
    rawData?.data?.board?.columns ||
    []
  );
}

function normalizeTask(task: any): BoardTask {
  return {
    id: Number(task?.id ?? 0),
    task_key: task?.task_key ?? task?.key ?? "",
    title: task?.title ?? "",
    description: task?.description ?? "",
    status_id: Number(task?.status_id ?? task?.status?.id ?? 0),
    is_archived: Boolean(task?.is_archived),
    is_completed: Boolean(task?.is_completed),
    priority: task?.priority
      ? {
          id: Number(task.priority?.id ?? 0),
          name: task.priority?.name ?? "",
          color: task.priority?.color,
        }
      : null,
    taskType: task?.taskType
      ? {
          id: Number(task.taskType?.id ?? 0),
          name: task.taskType?.name ?? "",
          icon: task.taskType?.icon,
        }
      : task?.task_type
        ? {
            id: Number(task.task_type?.id ?? 0),
            name: task.task_type?.name ?? "",
            icon: task.task_type?.icon,
          }
        : null,
    assignee: task?.assignee
      ? {
          id: Number(task.assignee?.id ?? 0),
          full_name: task.assignee?.full_name ?? "",
          avatar_url: task.assignee?.avatar_url,
        }
      : null,
    reporter: task?.reporter
      ? {
          id: Number(task.reporter?.id ?? 0),
          full_name: task.reporter?.full_name ?? "",
        }
      : null,
    parent_task_id: task?.parent_task_id ?? null,
    start_date: task?.start_date ?? null,
    due_date: task?.due_date ?? task?.dueDate ?? null,
    position: Number(task?.position ?? 0),
    labels: toArray(task?.labels).map((label: any) => ({
      id: Number(label?.id ?? 0),
      name: label?.name ?? String(label ?? ""),
      color: label?.color,
    })),
    comments: toArray(task?.comments),
  };
}

function normalizeColumn(col: any): BoardColumn {
  const rawTasks = col?.tasks ?? col?.items ?? col?.task_list ?? [];
  return {
    id: Number(col?.id ?? 0),
    name: col?.name ?? "",
    position: Number(col?.position ?? 0),
    wip_limit: col?.wip_limit ?? null,
    status: col?.status
      ? {
          id: Number(col.status?.id ?? 0),
          name: col.status?.name ?? "",
          color: col.status?.color,
        }
      : null,
    tasks: toArray(rawTasks).map(normalizeTask),
  };
}

function normalizeBoardData(rawData: any): BoardData {
  const rawProject = rawData?.project || rawData?.data?.project || null;
  const rawBoard = rawData?.board || rawData?.data?.board || null;
  const rawColumns = pickColumns(rawData);

  const normalizedColumns = toArray(rawColumns)
    .map(normalizeColumn)
    .sort((a, b) => a.position - b.position);

  return {
    project: rawProject
      ? {
          id: Number(rawProject?.id ?? 0),
          code: rawProject?.code,
          key: rawProject?.key ?? rawProject?.code,
          name: rawProject?.name ?? "",
          description: rawProject?.description,
          boardName:
            rawProject?.boardName ?? rawBoard?.name ?? rawProject?.board_name,
        }
      : null,
    board: rawBoard
      ? { id: Number(rawBoard?.id ?? 0), name: rawBoard?.name ?? "" }
      : null,
    columns: normalizedColumns,
  };
}

export default function useWorkflowBoard(projectId?: number) {
  const [boardData, setBoardData] = useState<BoardData>({
    project: null,
    board: null,
    columns: [],
  });

  // FIX: Tách search thành 2 tầng:
  // - clientSearch: filter nhanh client-side ngay khi gõ (instant)
  // - serverFilters: filter nặng gửi lên server (assignee, priority)
  const [clientSearch, setClientSearch] = useState("");
  const [serverFilters, setServerFilters] = useState<BoardFilterParams>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(
    async (filters?: BoardFilterParams) => {
      if (!projectId) {
        setBoardData({ project: null, board: null, columns: [] });
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Gửi params lên server nếu có filter
        const params: Record<string, unknown> = {};
        if (filters?.keyword) params.keyword = filters.keyword;
        if (filters?.assigneeId) params.assigneeId = filters.assigneeId;
        if (filters?.priorityId) params.priorityId = filters.priorityId;

        const res = await workflowApi.getBoard(projectId, {
          ...params,
          _t: Date.now(), // cache-buster
        });
        const rawData = res.data?.data ?? res.data ?? {};
        const normalized = normalizeBoardData(rawData);
        setBoardData(normalized);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Không lấy được board");
        setBoardData({ project: null, board: null, columns: [] });
      } finally {
        setLoading(false);
      }
    },
    [projectId],
  );

  // Fetch lại khi projectId đổi
  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Fetch lại khi serverFilters đổi (assignee, priority)
  useEffect(() => {
    if (Object.keys(serverFilters).length > 0) {
      fetchBoard(serverFilters);
    }
  }, [serverFilters]);

  const applyServerFilter = useCallback((filters: BoardFilterParams) => {
    setServerFilters(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setServerFilters({});
    setClientSearch("");
    fetchBoard();
  }, [fetchBoard]);

  // Client-side search (instant, không cần gọi API)
  const filteredColumns = useMemo<BoardColumn[]>(() => {
    const columns = boardData?.columns ?? [];
    const keyword = clientSearch.trim().toLowerCase();

    return columns.map((col) => ({
      ...col,
      tasks: col.tasks
        .filter((task) => !task.is_completed && !task.is_archived) // ← thêm dòng này
        .filter((task) =>
          !keyword
            ? true
            : (task.title ?? "").toLowerCase().includes(keyword) ||
              (task.task_key ?? "").toLowerCase().includes(keyword) ||
              (task.assignee?.full_name ?? "")
                .toLowerCase()
                .includes(keyword) ||
              task.labels.some((l) =>
                (l?.name ?? "").toLowerCase().includes(keyword),
              ),
        ),
    }));
  }, [boardData, clientSearch]);
  const tasks = useMemo<BoardTask[]>(() => {
    return (boardData?.columns ?? []).flatMap((col) => col?.tasks ?? []);
  }, [boardData]);

  const createTask = async (payload: Record<string, unknown>) => {
    await workflowApi.createTask(payload);
    await fetchBoard(
      Object.keys(serverFilters).length ? serverFilters : undefined,
    );
  };

  const moveTaskToColumn = async (
    taskId: number,
    toStatusId: number,
    toColumnId: number,
    newPosition: number,
  ) => {
    // ✅ Optimistic update — cập nhật UI trước
    setBoardData((prev) => {
      const newColumns = prev.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }));

      const targetCol = newColumns.find((c) => c.id === toColumnId);
      const movedTask = prev.columns
        .flatMap((c) => c.tasks)
        .find((t) => t.id === taskId);

      if (targetCol && movedTask) {
        const updatedTask = {
          ...movedTask,
          status_id: toStatusId,
          position: newPosition,
        };
        targetCol.tasks.splice(newPosition, 0, updatedTask);
      }

      return { ...prev, columns: newColumns };
    });

    // Gọi API sau, không fetchBoard
    try {
      await workflowApi.moveTask(taskId, {
        toStatusId,
        toColumnId,
        newPosition,
      });
    } catch (err) {
      // Nếu lỗi thì fetch lại để đồng bộ
      await fetchBoard(
        Object.keys(serverFilters).length ? serverFilters : undefined,
      );
    }
  };
  const reorderTasksInColumn = async (
    taskId: number,
    statusId: number,
    newPosition: number,
  ) => {
    // ✅ Optimistic update
    setBoardData((prev) => {
      const newColumns = prev.columns.map((col) => {
        const taskIndex = col.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return col;

        const newTasks = [...col.tasks];
        const [task] = newTasks.splice(taskIndex, 1);
        newTasks.splice(newPosition, 0, { ...task, position: newPosition });
        return { ...col, tasks: newTasks };
      });
      return { ...prev, columns: newColumns };
    });

    try {
      await workflowApi.reorderTask(taskId, { statusId, newPosition });
    } catch (err) {
      await fetchBoard(
        Object.keys(serverFilters).length ? serverFilters : undefined,
      );
    }
  };

  const moveTaskBetweenColumns = async (
    taskId: number,
    fromColId: number,
    toColId: number,
    newPosition: number,
  ) => {
    const toCol = boardData.columns.find((c) => c.id === toColId);
    const toStatusId = toCol?.status?.id ?? 0;

    // ✅ Optimistic update
    setBoardData((prev) => {
      const movedTask = prev.columns
        .flatMap((c) => c.tasks)
        .find((t) => t.id === taskId);

      const newColumns = prev.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }));

      const targetCol = newColumns.find((c) => c.id === toColId);
      if (targetCol && movedTask) {
        const updatedTask = {
          ...movedTask,
          status_id: toStatusId,
          position: newPosition,
        };
        targetCol.tasks.splice(newPosition, 0, updatedTask);
      }

      return { ...prev, columns: newColumns };
    });

    try {
      await workflowApi.moveTask(taskId, {
        toStatusId,
        toColumnId: toColId,
        newPosition,
      });
    } catch (err) {
      await fetchBoard(
        Object.keys(serverFilters).length ? serverFilters : undefined,
      );
    }
  };
  return {
    project: boardData?.project ?? null,
    board: boardData?.board ?? null,
    columns: filteredColumns,
    tasks,
    // Client search
    clientSearch,
    setClientSearch,
    // Server filter
    serverFilters,
    applyServerFilter,
    clearFilters,
    loading,
    error,
    fetchBoard,
    createTask,
    moveTaskToColumn,
    reorderTasksInColumn,
    moveTaskBetweenColumns,
  };
}
