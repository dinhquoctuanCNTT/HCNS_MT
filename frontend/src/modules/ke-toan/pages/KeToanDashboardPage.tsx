import ProcessFlow from "../components/ProcessFlow";
import ReportList from "../components/ReportList";

export default function KeToanDashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <ProcessFlow />
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        <ReportList />
      </div>
    </div>
  );
}
