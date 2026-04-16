import "../styles/dashboard.css";
import DashboardStats from "../components/DashboardStats";
import DashboardChart from "../components/DashboardChart";
import DashboardRightPanel from "../components/DashboardRightPanel";
import DashboardBottomPanels from "../components/DashboardBottomPanels";

export default function DashboardPage() {
  return (
    <>
      <DashboardStats />

      <section className="dashboard-grid">
        <div className="dashboard-grid__left">
          <DashboardChart />
        </div>

        <div className="dashboard-grid__right">
          <DashboardRightPanel />
        </div>
      </section>

      <DashboardBottomPanels />
    </>
  );
}
