import { BoardProject } from "../../hooks/useWorkflowBoard";

export type WorkflowTab = "board" | "history";

interface WorkflowHeaderProps {
  project: BoardProject | null;
  projects?: { id: number; name: string; code?: string; key?: string }[];
  projectId?: number;
  totalTasks?: number;
  onProjectChange?: (projectId: number) => void;
  activeTab: WorkflowTab;
  onTabChange: (tab: WorkflowTab) => void;
}

export default function WorkflowHeader({
  project,
  projects = [],
  projectId,
  totalTasks,
  onProjectChange,
  activeTab,
  onTabChange,
}: WorkflowHeaderProps) {
  return (
    <div className="wf-header">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 13, color: "#888" }}>
            <span>Projects</span>
            <span style={{ margin: "0 4px" }}>/</span>
            <span style={{ color: "#333", fontWeight: 500 }}>
              {project?.name ?? "N/A"}
            </span>
          </div>

          {project?.key && (
            <>
              <span style={{ color: "#ddd" }}>|</span>
              <span
                style={{
                  fontSize: 12,
                  color: "#888",
                  background: "#f3f4f6",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontWeight: 500,
                }}
              >
                Key: {project.key}
              </span>
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          {totalTasks !== undefined && (
            <span
              style={{
                fontSize: 12,
                color: "#6b7280",
                background: "#f3f4f6",
                padding: "3px 10px",
                borderRadius: 20,
                fontWeight: 500,
              }}
            >
              {totalTasks} tasks
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
