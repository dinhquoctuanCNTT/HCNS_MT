import "../styles/workflow-complete.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import WorkflowModule from "../components/common/WorkflowModule";
import TaskModal from "../components/modal/TaskModal";

import useWorkflowBoard, {
  BoardColumn,
  BoardTask,
} from "../hooks/useWorkflowBoard";

import useWorkflowMeta from "../hooks/useWorkflowMeta";
import useProjects from "../hooks/useProjects";
import { useCreateIssue } from "../hooks/useCreateIssue";
import { WorkflowTab } from "../components/layout/WorkflowHeader";
import { useAuthStore } from "@auth/auth.store";
import { useOverdueNotifier } from "../hooks/useOverdueNotifier";

import { workflowApi } from "../api/workflow.api";

export default function WorkflowPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projectId, setProjectId] = useState<number | undefined>(undefined);

  // Create modal
  const [openCreate, setOpenCreate] = useState(false);
  const [createColumn, setCreateColumn] = useState<BoardColumn | null>(null);

  // Detail/Edit modal
  const [selectedTask, setSelectedTask] = useState<BoardTask | null>(null);

  const [openDetail, setOpenDetail] = useState(false);

  const { userId } = useAuthStore();

  const tabParam = searchParams.get("tab") as WorkflowTab | null;

  const [activeTab, setActiveTab] = useState<WorkflowTab>(
    tabParam === "history" ? "history" : "board",
  );

  useEffect(() => {
    const t = searchParams.get("tab") as WorkflowTab | null;

    if (t === "history" || t === "board") {
      setActiveTab(t);
    } else {
      setActiveTab("board");
    }
  }, [searchParams]);

  const handleTabChange = (tab: WorkflowTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const {
    projects,
    loading: projectLoading,
    error: projectError,
  } = useProjects();

  const resolvedProjectId =
    projectId ?? (projects.length > 0 ? Number(projects[0].id) : undefined);

  const {
    project: boardProject,
    board,
    columns,
    tasks,
    loading: boardLoading,
    error: boardError,
    clientSearch,
    setClientSearch,
    applyServerFilter,
    clearFilters,
    serverFilters,
    moveTaskToColumn,
    reorderTasksInColumn,
    moveTaskBetweenColumns,
    fetchBoard,
  } = useWorkflowBoard(resolvedProjectId);

  const {
    project: metaProject,
    members,
    labels,
    statuses,
    priorities,
    issueTypes,
    loading: metaLoading,
    hasError: metaHasError,
  } = useWorkflowMeta(resolvedProjectId);

  const { createIssue } = useCreateIssue(resolvedProjectId, fetchBoard);

  // overdue notify
  useOverdueNotifier(
    tasks.map((t) => ({
      id: t.id,
      title: t.title,
      due_date: t.due_date,
      is_completed: !!(t as any).is_completed,
      is_archived: !!(t as any).is_archived,
      reporter_id: t.reporter?.id ?? null,
      assignee_id: t.assignee?.id ?? null,
    })),
    userId ?? 0,
  );

  const error =
    projectError ||
    boardError ||
    (metaHasError ? "Không lấy được metadata" : null);

  const project = metaProject || boardProject;

  const handleOpenCreate = (column?: BoardColumn | null) => {
    setCreateColumn(column ?? null);
    setOpenCreate(true);
  };

  if (projectLoading) {
    return <div className="wf-page-loading">Đang tải project...</div>;
  }

  if (projectError) {
    return <div className="wf-page-error">⚠️ {projectError}</div>;
  }

  if (!resolvedProjectId) {
    return <div className="wf-page-error">Không tìm thấy project nào</div>;
  }

  return (
    <>
      <WorkflowModule
        project={project}
        projects={projects}
        projectId={resolvedProjectId}
        board={board}
        tasks={tasks}
        columns={columns}
        members={members}
        labels={labels}
        statuses={statuses}
        priorities={priorities}
        issueTypes={issueTypes}
        loading={boardLoading || metaLoading}
        error={error}
        clientSearch={clientSearch}
        onClientSearch={setClientSearch}
        serverFilters={serverFilters}
        onApplyServerFilter={applyServerFilter}
        onClearFilters={clearFilters}
        onProjectChange={(id) => setProjectId(id)}
        onCreateTask={() => handleOpenCreate(null)}
        onAddTaskFromColumn={handleOpenCreate}
        onTaskClick={(task) => {
          setSelectedTask(task);
          setOpenDetail(true);
        }}
        onMoveTask={moveTaskToColumn}
        onReorderTask={reorderTasksInColumn}
        onMoveBetweenColumns={moveTaskBetweenColumns}
        onRefresh={fetchBoard}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {openCreate && (
        <TaskModal
          task={null}
          projectId={resolvedProjectId}
          boardId={board?.id}
          members={members}
          labels={labels}
          priorities={priorities}
          issueTypes={issueTypes}
          statuses={statuses}
          currentUserId={userId}
          onClose={() => {
            setOpenCreate(false);
            setCreateColumn(null);
          }}
          onCreate={async (payload) => {
            return await createIssue({
              ...payload,
              status_id: createColumn?.status?.id ?? statuses?.[0]?.id ?? null,
            });
          }}
        />
      )}

      {/* DETAIL / UPDATE MODAL */}
      {openDetail && selectedTask && (
        <TaskModal
          task={selectedTask}
          projectId={resolvedProjectId}
          boardId={board?.id}
          members={members}
          labels={labels}
          priorities={priorities}
          issueTypes={issueTypes}
          statuses={statuses}
          currentUserId={userId}
          onClose={() => {
            setOpenDetail(false);
            setSelectedTask(null);
          }}
          onUpdate={async (payload) => {
            const success = await workflowApi.updateTask(
              selectedTask.id,
              payload,
            );

            if (success) {
              setSelectedTask((prev) =>
                prev
                  ? {
                      ...prev,
                      ...payload,
                    }
                  : prev,
              );

              await fetchBoard();
            }

            return success;
          }}
        />
      )}
    </>
  );
}
