import React from "react";
import "../styles/dashboard.css";
import DashboardStats from "../components/DashboardStats";
import DashboardChart from "../components/DashboardChart";
import LatestRequestsTable from "../components/LatestRequestsTable";

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      {/* ── KPI Row ── */}
      <DashboardStats />

      {/* ── Main Content Grid ── */}
      <section className="dashboard-main-grid">
        <div className="grid-left">
          <LatestRequestsTable />
        </div>

        <div className="grid-right">
          <div className="card-panel">
            <div className="card-header">
              <h3>Biểu đồ xu hướng</h3>
            </div>
            <div style={{ padding: '20px' }}>
              <DashboardChart />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
