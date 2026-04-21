import { useState } from "react";
import WorkflowHeader from "./WorkflowHeader";
import WorkflowFilters from "./WorkflowFilters";
import WorkflowBoard from "../board/WorkflowBoard";
import TaskModal from "../modal/TaskModal";
import WorkflowHistory from "../../workflowHistory/WorkflowHistory";
import {
  BoardColumn,
  BoardProject,
  BoardTask,
  BoardFilterParams,
} from "../../hooks/useWorkflowBoard";
import useUpdateTask from "../../hooks/useUpdateTask";
import { WorkflowTab } from "./WorkflowHeader";

interface WorkflowModuleProps {
  project: BoardProject | null;
  projects?: { id: number; name: string; code?: string; key?: string }[];
  projectId?: number;
  board?: { id: number; name: string } | null;
  tasks: BoardTask[];
  columns: BoardColumn[];
  members: any[];
  labels: any[];
  statuses: any[];
  priorities: any[];
  issueTypes: any[];
  loading: boolean;
  error: string | null;
  clientSearch: string;
  onClientSearch: (val: string) => void;
  serverFilters: BoardFilterParams;
  onApplyServerFilter: (filters: BoardFilterParams) => void;
  onClearFilters: () => void;
  onProjectChange: (projectId: number) => void;
  onCreateTask: () => void;
  onAddTaskFromColumn?: (column: BoardColumn | null) => void;
  onMoveTask: (
    taskId: number,
    toStatusId: number,
    toColumnId: number,
    newPosition: number,
  ) => Promise<void>;
  onReorderTask: (
    taskId: number,
    statusId: number,
    newPosition: number,
  ) => Promise<void>;
  onMoveBetweenColumns: (
    taskId: number,
    fromColId: number,
    toColId: number,
    newPosition: number,
  ) => Promise<void>;
  onRefresh: () => void;
  activeTab?: WorkflowTab;
  onTabChange?: (tab: WorkflowTab) => void;
}

export default function WorkflowModule({
  project,
  projects = [],
  projectId,
  board,
  columns,
  members,
  labels,
  statuses,
  priorities,
  issueTypes,
  loading,
  error,
  clientSearch,
  onClientSearch,
  serverFilters,
  onApplyServerFilter,
  onClearFilters,
  onProjectChange,
  onCreateTask,
  onAddTaskFromColumn,
  onMoveTask,
  onReorderTask,
  onMoveBetweenColumns,
  onRefresh,
  activeTab: activeTabProp,
  onTabChange: onTabChangeProp,
}: WorkflowModuleProps) {
  const [selectedTask, setSelectedTask] = useState<BoardTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [internalTab, setInternalTab] = useState<WorkflowTab>("board");
  const activeTab = activeTabProp ?? internalTab;
  const setActiveTab = onTabChangeProp ?? setInternalTab;

  const {
    updateTask,
    updateStatus,
    submitting: updateSubmitting,
  } = useUpdateTask(selectedTask?.id, onRefresh);

  const openTask = (task: BoardTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleFilterMember = (assigneeId: number | null) => {
    onApplyServerFilter({
      ...serverFilters,
      assigneeId: assigneeId ?? undefined,
    });
  };

  const handleFilterPriority = (priorityId: number | null) => {
    onApplyServerFilter({
      ...serverFilters,
      priorityId: priorityId ?? undefined,
    });
  };

  const filterMember = serverFilters.assigneeId ?? null;
  const filterPriority = serverFilters.priorityId ?? null;

  return (
    <div className="wf-module">
      <WorkflowHeader
        project={project}
        projects={projects}
        projectId={projectId}
        onProjectChange={onProjectChange}
        onOpenCreate={onCreateTask}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "board" && (
        <>
          <WorkflowFilters
            search={clientSearch}
            onSearchChange={onClientSearch}
            members={members}
            priorities={priorities}
            filterMember={filterMember}
            filterPriority={filterPriority}
            onFilterMember={handleFilterMember}
            onFilterPriority={handleFilterPriority}
            onClearFilters={onClearFilters}
          />

          {loading && (
            <div className="wf-loading">
              <div className="wf-spinner" />
              <span>Đang tải board...</span>
            </div>
          )}

          {error && !loading && (
            <div className="wf-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          {!loading && !error && (
            <WorkflowBoard
              columns={columns}
              onTaskClick={openTask}
              onMoveTask={onMoveTask}
              onReorderTask={onReorderTask}
              onAddTask={onAddTaskFromColumn}
            />
          )}
        </>
      )}

      {activeTab === "history" && projectId && (
        <WorkflowHistory
          projectId={projectId}
          members={members}
          statuses={statuses}
        />
      )}

      {isModalOpen && selectedTask && projectId && (
        <TaskModal
          task={selectedTask}
          projectId={projectId}
          boardId={board?.id}
          members={members}
          labels={labels}
          priorities={priorities}
          issueTypes={issueTypes}
          statuses={statuses}
          submitting={updateSubmitting}
          onUpdateTask={updateTask}
          onUpdateStatus={updateStatus}
          onRefresh={onRefresh}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
