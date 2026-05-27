import { useState, useEffect, useCallback } from "react";
import axiosClient from "@api/axiosClient";
import "../styles/lsChamCong.css";

interface AttendanceRecord {
  id: number;
  full_name: string;
  employee_code: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  late_minutes: number;
  early_minutes: number;
  status: string;
  check_in_image_url: string | null;
  check_out_image_url: string | null;
}

function getStatuses(row: AttendanceRecord): string[] {
  if (!row.check_in) return ["absent"];
  const tags: string[] = [];
  if (!row.check_out) tags.push("missing");
  if (row.late_minutes > 0) tags.push("late");
  if (row.early_minutes > 0) tags.push("early");
  return tags.length ? tags : ["ontime"];
}

export default function LichSuChamCongPage() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [from, setFrom] = useState("2026-05-01");
  const [to, setTo] = useState("2026-05-31");
  const [search, setSearch] = useState("");
  const [deptId, setDeptId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    axiosClient.get("/api/report/departments").then((r) => setDepartments(r.data)).catch(() => {});
    axiosClient.get("/api/report/branches").then((r) => setBranches(r.data)).catch(() => {});
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/attendance/history/admin", {
        params: {
          from,
          to,
          limit: 200,
          ...(deptId && { departmentId: deptId }),
          ...(branchId && { branchId }),
        },
      });
      setData(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [from, to, deptId, branchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = {
    all: data.length,
    ontime: data.filter((r) => getStatuses(r).includes("ontime")).length,
    late: data.filter((r) => getStatuses(r).includes("late")).length,
    early: data.filter((r) => getStatuses(r).includes("early")).length,
    absent: data.filter((r) => getStatuses(r).includes("absent")).length,
    missing: data.filter((r) => getStatuses(r).includes("missing")).length,
  };

  const filteredData = data
    .filter((r) => activeTab === "all" || getStatuses(r).includes(activeTab))
    .filter((r) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        r.full_name?.toLowerCase().includes(q) ||
        r.employee_code?.toLowerCase().includes(q)
      );
    });

  return (
    <div className="ls-page">
      <div className="ls-tabs-row">
        <div className="ls-tabs">
          <button
            className={`ls-tab ${activeTab === "all" ? "ls-tab--active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Tất cả <span className="ls-tab-count">({stats.all})</span>
          </button>
          <button
            className={`ls-tab ${activeTab === "ontime" ? "ls-tab--active" : ""}`}
            onClick={() => setActiveTab("ontime")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Đúng giờ <span className="ls-tab-count">({stats.ontime})</span>
          </button>
          <button
            className={`ls-tab ${activeTab === "late" ? "ls-tab--active" : ""}`}
            onClick={() => setActiveTab("late")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Đi muộn <span className="ls-tab-count">({stats.late})</span>
          </button>
          <button
            className={`ls-tab ${activeTab === "early" ? "ls-tab--active" : ""}`}
            onClick={() => setActiveTab("early")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 18 12 12 8 10"></polyline>
            </svg>
            Về sớm <span className="ls-tab-count">({stats.early})</span>
          </button>
          <button
            className={`ls-tab ${activeTab === "absent" ? "ls-tab--active" : ""}`}
            onClick={() => setActiveTab("absent")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Vắng mặt <span className="ls-tab-count">({stats.absent})</span>
          </button>
          <button
            className={`ls-tab ${activeTab === "missing" ? "ls-tab--active" : ""}`}
            onClick={() => setActiveTab("missing")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Thiếu ra/vào <span className="ls-tab-count">({stats.missing})</span>
          </button>
        </div>

        <button className="ls-btn-excel">Xuất Excel</button>
      </div>

      <div className="ls-card">
        <div className="ls-filter-container">
          <div className="ls-filter-group">
            <label className="ls-label">Từ ngày</label>
            <input
              type="date"
              className="ls-input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="ls-filter-group">
            <label className="ls-label">Đến ngày</label>
            <input
              type="date"
              className="ls-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="ls-filter-group">
            <label className="ls-label">Chi nhánh</label>
            <select
              className="ls-select"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            >
              <option value="">Tất cả</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="ls-filter-group">
            <label className="ls-label">Phòng ban</label>
            <select
              className="ls-select"
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
            >
              <option value="">Tất cả</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="ls-filter-group">
            <label className="ls-label">Tìm kiếm</label>
            <div className="ls-input-wrap">
              <svg className="ls-icon-svg ls-icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="ls-input"
                style={{ paddingLeft: 38 }}
                placeholder="Tìm tên, mã NV..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="ls-table-wrap">
          <table className="ls-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>STT</th>
                <th>Mã NV</th>
                <th>Họ tên</th>
                <th>Ngày</th>
                <th>Vào ca</th>
                <th>Ra ca</th>
                <th>Hình ảnh</th>
                <th>Muộn</th>
                <th>Trạng thái</th>
                <th>Giải trình</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: 40 }}>Đang tải...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: 40 }}>Không có dữ liệu</td>
                </tr>
              ) : (
                filteredData.map((row, i) => {
                  const tags = getStatuses(row);
                  return (
                    <tr key={row.id}>
                      <td>{i + 1}</td>
                      <td>{row.employee_code || `NV${1001 + i}`}</td>
                      <td style={{ fontWeight: 600 }}>{row.full_name}</td>
                      <td>{row.date.split("T")[0].split("-").reverse().join("/")}</td>
                      <td>
                        {row.check_in
                          ? new Date(row.check_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "—"}
                      </td>
                      <td>
                        {row.check_out
                          ? new Date(row.check_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "—"}
                      </td>
                      <td>
                        <div className="ls-photos">
                          {row.check_in_image_url && (
                            <img
                              className="ls-photo-thumb"
                              src={row.check_in_image_url}
                              alt="Vào ca"
                              title="Ảnh vào ca"
                              onClick={() => setPreviewImg(row.check_in_image_url)}
                            />
                          )}
                          {row.check_out_image_url && (
                            <img
                              className="ls-photo-thumb"
                              src={row.check_out_image_url}
                              alt="Ra ca"
                              title="Ảnh ra ca"
                              onClick={() => setPreviewImg(row.check_out_image_url)}
                            />
                          )}
                          {!row.check_in_image_url && !row.check_out_image_url && (
                            <span style={{ color: "#94a3b8" }}>—</span>
                          )}
                        </div>
                      </td>
                      <td>{row.late_minutes > 0 ? `${row.late_minutes} phút` : "—"}</td>
                      <td>
                        <div className="ls-status-group">
                          {tags.includes("ontime")  && <span className="ls-status ls-status--dunggio">Đúng giờ</span>}
                          {tags.includes("late")    && <span className="ls-status ls-status--dimuon">Đi muộn</span>}
                          {tags.includes("early")   && <span className="ls-status ls-status--vesom">Về sớm</span>}
                          {tags.includes("absent")  && <span className="ls-status ls-status--vangmat">Vắng mặt</span>}
                          {tags.includes("missing") && <span className="ls-status ls-status--missing">Thiếu ra</span>}
                        </div>
                      </td>
                      <td style={{ color: "#94a3b8" }}>--</td>
                      <td>
                        <div className="ls-actions">
                          <button className="ls-btn-action ls-btn-view">Xem</button>
                          {(tags.includes("late") || tags.includes("early") || tags.includes("absent")) && (
                            <button className="ls-btn-action ls-btn-request">Gửi yêu cầu</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {previewImg && (
        <div className="ls-photo-overlay" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="preview" className="ls-photo-overlay-img" />
        </div>
      )}
    </div>
  );
}
