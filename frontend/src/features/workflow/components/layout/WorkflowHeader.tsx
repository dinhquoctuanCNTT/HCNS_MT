import WorkflowProjectSwitcher from "./WorkflowProjectSwitcher";

type ProjectOption = {
  id: number;
  name: string;
  code?: string;
  key?: string;
};

type ProjectInfo = {
  id: number;
  name: string;
  code?: string;
  key?: string;
  boardName?: string;
  description?: string;
} | null;

export type WorkflowTab = "board" | "history";

type Props = {
  project: ProjectInfo;
  projects?: ProjectOption[];
  projectId?: number;
  onProjectChange: (projectId: number) => void;
  onOpenCreate: () => void;
  activeTab: WorkflowTab;
  onTabChange: (tab: WorkflowTab) => void;
};

export default function WorkflowHeader({
  project,
  projects = [],
  projectId,
  onProjectChange,
  onOpenCreate,
  activeTab,
}: Props) {
  const projectKey = project?.code ?? project?.key ?? "N/A";
  const boardName = project?.boardName ?? "Board";

  return (
    <div className="workflow-header">
      {/* ✅ Top row: tất cả nằm 1 hàng ngang */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "12px 20px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {/* Trái: breadcrumb + meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div
              style={{
                fontSize: 12,
                color: "#888",
                marginBottom: 2,
              }}
            >
              Projects / {projectKey}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#444",
                fontWeight: 500,
              }}
            >
              {boardName} • Key: {projectKey}
            </div>
          </div>
        </div>

        {/* Phải: project switcher + create button — cùng hàng */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <WorkflowProjectSwitcher
            projects={projects}
            value={projectId}
            onChange={onProjectChange}
          />

          {activeTab === "board" && (
            <button
              type="button"
              className="workflow-btn workflow-btn--primary"
              onClick={onOpenCreate}
              disabled={!projectId}
            >
              + Create issue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
