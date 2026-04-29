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
    columns: toArray(rawColumns)
      .map(normalizeColumn)
      .sort((a, b) => a.position - b.position),
  };
}

export function getRealPosition(
  realTasks: BoardTask[],
  filteredTasks: BoardTask[],
  displayIndex: number,
): number {
  if (filteredTasks.length === 0) return 0;
  if (displayIndex <= 0) {
    const firstId = filteredTasks[0].id;
    const idx = realTasks.findIndex((t) => t.id === firstId);
    return idx >= 0 ? idx : 0;
  }

  if (displayIndex >= filteredTasks.length) {
    const lastId = filteredTasks[filteredTasks.length - 1].id;
    const idx = realTasks.findIndex((t) => t.id === lastId);
    return idx >= 0 ? idx + 1 : realTasks.length;
  }

  const prevId = filteredTasks[displayIndex - 1].id;
  const prevIdx = realTasks.findIndex((t) => t.id === prevId);
  return prevIdx >= 0 ? prevIdx + 1 : realTasks.length;
}
function isTaskVisible(task: BoardTask, keyword: string): boolean {
  if (task.is_completed || task.is_archived) return false;
  if (!keyword) return true;
  const kw = keyword.toLowerCase();
  return (
    (task.title ?? "").toLowerCase().includes(kw) ||
    (task.task_key ?? "").toLowerCase().includes(kw) ||
    (task.assignee?.full_name ?? "").toLowerCase().includes(kw) ||
    task.labels.some((l) => (l?.name ?? "").toLowerCase().includes(kw))
  );
}

export default function useWorkflowBoard(projectId?: number) {
  const [boardData, setBoardData] = useState<BoardData>({
    project: null,
    board: null,
    columns: [],
  });
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
        const params: Record<string, unknown> = { _t: Date.now() };
        if (filters?.keyword) params.keyword = filters.keyword;
        if (filters?.assigneeId) params.assigneeId = filters.assigneeId;
        if (filters?.priorityId) params.priorityId = filters.priorityId;

        const res = await workflowApi.getBoard(projectId, params);
        const rawData = res.data?.data ?? res.data ?? {};
        setBoardData(normalizeBoardData(rawData));
      } catch (err: any) {
        setError(err?.response?.data?.message || "Không lấy được board");
        setBoardData({ project: null, board: null, columns: [] });
      } finally {
        setLoading(false);
      }
    },
    [projectId],
  );

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);
  useEffect(() => {
    if (Object.keys(serverFilters).length > 0) fetchBoard(serverFilters);
  }, [serverFilters]);

  const applyServerFilter = useCallback(
    (filters: BoardFilterParams) => setServerFilters(filters),
    [],
  );
  const clearFilters = useCallback(() => {
    setServerFilters({});
    setClientSearch("");
    fetchBoard();
  }, [fetchBoard]);

  // filteredColumns — CHỈ dùng để render, KHÔNG dùng index để splice
  const filteredColumns = useMemo<BoardColumn[]>(() => {
    const keyword = clientSearch.trim().toLowerCase();
    return (boardData?.columns ?? []).map((col) => ({
      ...col,
      tasks: col.tasks.filter((t) => isTaskVisible(t, keyword)),
    }));
  }, [boardData, clientSearch]);

  const tasks = useMemo<BoardTask[]>(
    () => (boardData?.columns ?? []).flatMap((col) => col?.tasks ?? []),
    [boardData],
  );

  const createTask = async (payload: Record<string, unknown>) => {
    await workflowApi.createTask(payload);
    await fetchBoard(
      Object.keys(serverFilters).length ? serverFilters : undefined,
    );
  };

  const calcNewPosition = (
    realDestTasks: BoardTask[],
    taskId: number,
    displayIndex: number,
    isCrossColumn = false,
  ): number => {
    const keyword = clientSearch.trim().toLowerCase();
    const realWithout = realDestTasks.filter((t) => t.id !== taskId);
    const filteredWithout = realWithout.filter((t) =>
      isTaskVisible(t, keyword),
    );

    const adjustedIndex =
      isCrossColumn &&
      filteredWithout.length > 0 &&
      displayIndex >= filteredWithout.length - 1
        ? filteredWithout.length
        : displayIndex;

    return getRealPosition(realWithout, filteredWithout, adjustedIndex);
  };
  // ── moveTaskBetweenColumns ─────────────────────────────────────────────────
  const moveTaskBetweenColumns = async (
    taskId: number,
    fromColId: number,
    toColId: number,
    displayIndex: number,
  ) => {
    const toCol = boardData.columns.find((c) => c.id === toColId);
    const toStatusId = toCol?.status?.id ?? 0;
    const newPosition = calcNewPosition(
      toCol?.tasks ?? [],
      taskId,
      displayIndex,
      true,
    );

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
        targetCol.tasks = targetCol.tasks.map((t, i) => ({
          ...t,
          position: i,
        }));
      }
      return { ...prev, columns: newColumns };
    });

    try {
      await workflowApi.moveTask(taskId, {
        toStatusId,
        toColumnId: toColId,
        newPosition,
      });
    } catch {
      await fetchBoard(
        Object.keys(serverFilters).length ? serverFilters : undefined,
      );
    }
  };

  // ── reorderTasksInColumn ───────────────────────────────────────────────────
  const reorderTasksInColumn = async (
    taskId: number,
    statusId: number,
    displayIndex: number,
  ) => {
    const col = boardData.columns.find((c) =>
      c.tasks.some((t) => t.id === taskId),
    );
    const newPosition = calcNewPosition(col?.tasks ?? [], taskId, displayIndex);

    setBoardData((prev) => {
      const newColumns = prev.columns.map((c) => {
        const idx = c.tasks.findIndex((t) => t.id === taskId);
        if (idx === -1) return c;
        const arr = [...c.tasks];
        const [task] = arr.splice(idx, 1);
        arr.splice(newPosition, 0, { ...task, position: newPosition });
        return { ...c, tasks: arr.map((t, i) => ({ ...t, position: i })) };
      });
      return { ...prev, columns: newColumns };
    });

    try {
      await workflowApi.reorderTask(taskId, { statusId, newPosition });
    } catch {
      await fetchBoard(
        Object.keys(serverFilters).length ? serverFilters : undefined,
      );
    }
  };

  // ── moveTaskToColumn (backward compat) ────────────────────────────────────
  const moveTaskToColumn = async (
    taskId: number,
    toStatusId: number,
    toColumnId: number,
    displayIndex: number,
  ) => {
    const fromColId =
      boardData.columns.find((c) => c.tasks.some((t) => t.id === taskId))?.id ??
      -1;
    return moveTaskBetweenColumns(taskId, fromColId, toColumnId, displayIndex);
  };

  return {
    project: boardData?.project ?? null,
    board: boardData?.board ?? null,
    columns: filteredColumns,
    tasks,
    clientSearch,
    setClientSearch,
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
    getRealPosition,
  };
}
