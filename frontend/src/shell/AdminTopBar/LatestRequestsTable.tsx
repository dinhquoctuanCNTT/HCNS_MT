import { useEffect, useState } from "react";
import { dashboardApi, type LatestRequest } from "../../../../api/dashboardApi";

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const STATUS_CLASS: Record<string, string> = {
  pending: "status--pending",
  approved: "status--active",
  rejected: "status--closed",
};

export default function LatestRequestsTable() {
  const [rows, setRows] = useState<LatestRequest[]>([]);

  useEffect(() => {
    dashboardApi.getLatestRequests(5).then(setRows).catch(() => {});
  }, []);

  return (
    <div className="card-panel">
      <div className="card-header">
        <h3>Đơn từ mới nhất</h3>
        <button style={{
          padding: "6px 12px",
          backgroundColor: "#5e72e4",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
        }}>
          Xem tất cả
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Loại đơn</th>
            <th>Ngày gửi</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.type}-${row.id}`}>
              <td style={{ fontWeight: 600, color: "#32325d" }}>{row.name}</td>
              <td>{row.type}</td>
              <td>{new Date(row.submitted_at).toLocaleDateString("vi-VN")}</td>
              <td>
                <span className={`status-badge ${STATUS_CLASS[row.status] ?? ""}`}>
                  {STATUS_LABEL[row.status] ?? row.status}
                </span>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", color: "#94a3b8", padding: "16px" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
