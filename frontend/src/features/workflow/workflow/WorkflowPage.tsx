import "../styles/workflow-complete.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import WorkflowModule from "../components/common/WorkflowModule";
import TaskModal from "../components/modal/TaskModal";
import useWorkflowBoard from "../hooks/useWorkflowBoard";
import useWorkflowMeta from "../hooks/useWorkflowMeta";
import useProjects from "../hooks/useProjects";
import { useCreateIssue } from "../hooks/useCreateIssue";
import { WorkflowTab } from "../components/layout/WorkflowHeader";
import { useAuthStore } from "../../auth/auth.store";
import { useOverdueNotifier } from "../hooks/useOverdueNotifier";

export default function WorkflowPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projectId, setProjectId] = useState<number | undefined>(undefined);
  const [openCreate, setOpenCreate] = useState(false);

  const { userId } = useAuthStore();

  const tabParam = searchParams.get("tab") as WorkflowTab | null;
  const [activeTab, setActiveTab] = useState<WorkflowTab>(
    tabParam === "history" ? "history" : "board",
  );

  // Đồng bộ tab khi query param thay đổi (ví dụ bấm sidebar)
  useEffect(() => {
    const t = searchParams.get("tab") as WorkflowTab | null;
    if (t === "history" || t === "board") {
      setActiveTab(t);
    } else {
      setActiveTab("board");
    }
  }, [searchParams]);

  // Khi user đổi tab trong UI, cập nhật query param
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

  if (projectLoading)
    return <div className="wf-page-loading">Đang tải project...</div>;
  if (projectError)
    return <div className="wf-page-error">⚠️ {projectError}</div>;
  if (!resolvedProjectId)
    return <div className="wf-page-error">Không tìm thấy project nào</div>;

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
        onCreateTask={() => setOpenCreate(true)}
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
          boardId={board?.id ?? 0}
          members={members}
          labels={labels}
          statuses={statuses}
          priorities={priorities}
          onRefresh={fetchBoard}
          issueTypes={issueTypes}
          onClose={() => setOpenCreate(false)}
          onCreate={async (data) => {
            await createIssue({ ...data, board_id: board?.id });
            setOpenCreate(false);
          }}
        />
      )}
    </>
  );
}
