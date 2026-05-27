import { useEffect, useState } from "react";
import { Users, BarChart2, ThumbsUp, Briefcase } from "lucide-react";
import { dashboardApi } from "../../../../api/dashboardApi";

interface Stats {
  total_nv: number;
  da_cham: number;
  nghi_phep: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<number>(0);

  useEffect(() => {
    dashboardApi.getStats().then((d) => setStats(d.kpi)).catch(() => {});
    dashboardApi.getPendingCount().then((d) => setPending(d.total)).catch(() => {});
  }, []);

  const attendancePct =
    stats && stats.total_nv > 0
      ? Math.round((stats.da_cham / stats.total_nv) * 100)
      : 0;

  return (
    <div className="dashboard-stats">
      <div className="kpi-card" style={{ backgroundColor: "#2dce89" }}>
        <div className="kpi-card__info">
          <h4>Nhân sự</h4>
          <div className="value">{stats ? stats.total_nv.toLocaleString() : "—"}</div>
        </div>
        <div className="kpi-card__icon">
          <Users size={24} color="#fff" />
        </div>
      </div>

      <div className="kpi-card" style={{ backgroundColor: "#11cdef" }}>
        <div className="kpi-card__info">
          <h4>Chấm công</h4>
          <div className="value">{stats ? `${attendancePct}%` : "—"}</div>
        </div>
        <div className="kpi-card__icon">
          <BarChart2 size={24} color="#fff" />
        </div>
      </div>

      <div className="kpi-card" style={{ backgroundColor: "#f5365c" }}>
        <div className="kpi-card__info">
          <h4>Đơn chờ duyệt</h4>
          <div className="value">{pending}</div>
        </div>
        <div className="kpi-card__icon">
          <ThumbsUp size={24} color="#fff" />
        </div>
      </div>

      <div className="kpi-card" style={{ backgroundColor: "#8898aa" }}>
        <div className="kpi-card__info">
          <h4>Lượt nghỉ</h4>
          <div className="value">{stats ? stats.nghi_phep : "—"}</div>
        </div>
        <div className="kpi-card__icon">
          <Briefcase size={24} color="#fff" />
        </div>
      </div>
    </div>
  );
}
