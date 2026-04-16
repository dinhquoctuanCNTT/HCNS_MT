import { useParams } from "react-router-dom";
import WorkflowHistory from "./WorkflowHistory";

export default function WorkflowHistoryPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const id = Number(projectId);

  if (!id) {
    return (
      <div style={{ padding: 32, color: "#6b7280" }}>Project không hợp lệ.</div>
    );
  }

  return <WorkflowHistory projectId={id} members={[]} statuses={[]} />;
}
