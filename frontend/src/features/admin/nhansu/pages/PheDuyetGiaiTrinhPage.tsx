import { useState, useEffect, useCallback, useMemo } from "react";
import axiosClient from "../../../../api/axiosClient";
import { triggerExplanationUpdate } from "../../../../context/PendingCountContext";
import "../styles/pheDuyet.css";

interface Explanation {
  id: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
  corrected_check_in: string | null;
  corrected_check_out: string | null;
  work_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  employee_name: string;
  phone: string;
  created_at: string;
}

type TabType = "all" | "pending" | "approved" | "rejected";

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch (e) {
    return "—";
  }
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
}

export default function PheDuyetGiaiTrinhPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Explanation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        status: activeTab === "all" ? null : activeTab,
        limit: 100,
      };
      const res = await axiosClient.get("/api/explanations", { params });
      setData(res.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn ${action === "approve" ? "duyệt" : "từ chối"} đơn này?`,
      )
    )
      return;
    try {
      await axiosClient.post(`/api/explanations/${id}/${action}`, {
        adminNote: "Đã xử lý từ hệ thống quản trị",
      });
      triggerExplanationUpdate();
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Lỗi xử lý");
    }
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const s = search.toLowerCase();
    return data.filter(
      (item) =>
        item.employee_name.toLowerCase().includes(s) ||
        (item.phone || "").includes(s),
    );
  }, [data, search]);

  return (
    <div className="pd-page">
      <div className="pd-tabs-container">
        {/* Header chuẩn theo thiết kế mẫu */}
        <div className="pd-tabs-header">
          <div className="pd-tabs-list">
            <button
              className={`pd-tab ${activeTab === "all" ? "pd-tab--active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: 4 }}
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Tất cả
              <span className="pd-count count-all">{data.length}</span>
            </button>

            <button
              className={`pd-tab ${activeTab === "pending" ? "pd-tab--active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: 4 }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Chờ duyệt
              <span className="pd-count count-pending">
                {data.filter((d) => d.status === "pending").length}
              </span>
            </button>

            <button
              className={`pd-tab ${activeTab === "approved" ? "pd-tab--active" : ""}`}
              onClick={() => setActiveTab("approved")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: 4 }}
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Đã duyệt
              <span className="pd-count count-approved">
                {data.filter((d) => d.status === "approved").length}
              </span>
            </button>

            <div className="pd-tab-divider"></div>

            <button
              className={`pd-tab ${activeTab === "rejected" ? "pd-tab--active" : ""}`}
              onClick={() => setActiveTab("rejected")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: 4 }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
              </svg>
              Từ chối
              <span className="pd-count count-rejected">
                {data.filter((d) => d.status === "rejected").length}
              </span>
            </button>
          </div>

          <div className="pd-search-wrap">
            <svg
              className="pd-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="14"
              height="14"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
              }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              className="pd-search-input"
              placeholder="Tên, mã nhân viên..."
              style={{ paddingLeft: 36 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Khu vực lọc phía dưới Tabs */}
        <div className="pd-filter-area">
          <button
            className="pd-btn-refresh"
            onClick={fetchData}
            disabled={loading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            Làm mới
          </button>

          <div className="pd-filter-group">
            <div className="pd-select-box">
              <select className="pd-select">
                <option>Tất cả, Kinh doanh, v.v.</option>
              </select>
            </div>

            <div className="pd-select-box">
              <select className="pd-select">
                <option>Hôm nay, Tuần này, v.v.</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section chuẩn theo mẫu */}
      <div className="pd-table-wrap" style={{ marginTop: "24px" }}>
        <table className="pd-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>
                <div className="pd-th-content">
                  Nhân viên
                  <span className="pd-sort-icons">
                    <span>▲</span>
                    <span>▼</span>
                  </span>
                </div>
              </th>
              <th>
                <div className="pd-th-content">
                  Ngày giải trình
                  <span className="pd-sort-icons">
                    <span>▲</span>
                    <span>▼</span>
                  </span>
                </div>
              </th>
              <th>
                <div className="pd-th-content">
                  Loại vi phạm
                  <span className="pd-sort-icons">
                    <span>▲</span>
                    <span>▼</span>
                  </span>
                </div>
              </th>
              <th>
                <div className="pd-th-content">
                  Giờ gốc
                  <span className="pd-sort-icons">
                    <span>▲</span>
                    <span>▼</span>
                  </span>
                </div>
              </th>
              <th>
                <div className="pd-th-content">
                  Giờ đề xuất
                  <span className="pd-sort-icons">
                    <span>▲</span>
                    <span>▼</span>
                  </span>
                </div>
              </th>
              <th>Lý do giải trình</th>
              <th>
                <div className="pd-th-content">
                  Ngày gửi
                  <span className="pd-sort-icons">
                    <span>▲</span>
                    <span>▼</span>
                  </span>
                </div>
              </th>
              <th>Phê duyệt của cấp trên</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={10}
                  style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <div className="pd-empty">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/6598/6598519.png"
                      alt="empty"
                      className="pd-empty-img"
                    />
                    <div className="pd-empty-title">
                      Chưa có đơn giải trình nào được gửi.
                    </div>
                    <div className="pd-empty-sub">
                      Khi nhân viên gửi đơn giải trình chấm công, chúng sẽ xuất
                      hiện ở đây để bạn xử lý.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>
                    <div className="pd-nv-cell">
                      <div className="pd-avatar">
                        {item.employee_name
                          ? item.employee_name.split(" ").slice(-1)[0][0]
                          : "?"}
                      </div>
                      <span className="pd-nv-name">{item.employee_name}</span>
                    </div>
                  </td>
                  <td>{fmtDate(item.work_date)}</td>
                  <td>Muộn/Sớm</td>
                  <td className="pd-time-cell">
                    {fmtTime(item.check_in_time)}
                  </td>
                  <td className="pd-time-cell" style={{ fontWeight: 700 }}>
                    {fmtTime(item.corrected_check_in)}
                  </td>
                  <td style={{ color: "#64748b" }}>{item.reason || ""}</td>
                  <td>{fmtDate(item.created_at)}</td>
                  <td>
                    <span className="pd-status-text">
                      {item.status === "pending" ? "Chờ duyệt" : "Duyệt"}
                    </span>
                  </td>
                  <td>
                    {item.status === "pending" ? (
                      <div className="pd-action-links">
                        <button
                          className="pd-action-link"
                          onClick={() => handleAction(item.id, "approve")}
                        >
                          Duyệt
                        </button>
                        <span>/</span>
                        <button
                          className="pd-action-link"
                          onClick={() => handleAction(item.id, "reject")}
                        >
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
