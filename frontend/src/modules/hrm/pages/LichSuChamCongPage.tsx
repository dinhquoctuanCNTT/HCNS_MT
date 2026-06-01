import { useState, useEffect, useCallback } from "react";
import axiosClient from "@api/axiosClient";
import "../styles/lsChamCong.css";
import AttendanceDetailModal from "../components/AttendanceDetailModal";

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
  check_in_address: string | null;
  check_out_address: string | null;
  latitude: number | null;
  longitude: number | null;
}

function getStatuses(row: AttendanceRecord): string[] {
  if (!row.check_in) return ["absent"];
  const tags: string[] = [];
  if (!row.check_out) tags.push("missing");
  if (row.late_minutes > 0) tags.push("late");
  if (row.early_minutes > 0) tags.push("early");
  return tags.length ? tags : ["ontime"];
}

const PAGE_SIZE = 20;

// Xuất CSV (mở được trong Excel)
function exportToCSV(rows: AttendanceRecord[]) {
  const headers = ["STT","Mã NV","Họ tên","Ngày","Vào ca","Ra ca","Địa điểm vào","Địa điểm ra","Tọa độ","Muộn (phút)","Về sớm (phút)","Trạng thái"];
  const fmt = (dt: string | null) => dt ? new Date(dt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";
  const fmtDate = (dt: string) => dt.slice(0,10).split("-").reverse().join("/");
  const statusLabel = (row: AttendanceRecord) => {
    if (!row.check_in) return "Vắng mặt";
    const s: string[] = [];
    if (!row.check_out) s.push("Thiếu ra");
    if (row.late_minutes > 0) s.push("Đi muộn");
    if (row.early_minutes > 0) s.push("Về sớm");
    return s.length ? s.join(", ") : "Đúng giờ";
  };
  const csvRows = [
    headers.join(","),
    ...rows.map((r, i) => [
      i + 1, r.employee_code, `"${r.full_name}"`, fmtDate(r.date),
      fmt(r.check_in), fmt(r.check_out),
      `"${r.check_in_address ?? ""}"`, `"${r.check_out_address ?? ""}"`,
      r.latitude ? `${r.latitude},${r.longitude}` : "",
      r.late_minutes || "", r.early_minutes || "",
      `"${statusLabel(r)}"`,
    ].join(","))
  ].join("\n");

  const BOM = "﻿"; // UTF-8 BOM để Excel hiển thị tiếng Việt đúng
  const blob = new Blob([BOM + csvRows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cham-cong-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LichSuChamCongPage() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [detailRecord, setDetailRecord] = useState<AttendanceRecord | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [from, setFrom] = useState("2026-05-01");
  const [to, setTo] = useState("2026-05-31");
  const [search, setSearch] = useState("");
  const [deptId, setDeptId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    axiosClient.get("/api/report/departments").then((r) => setDepartments(r.data)).catch(() => {});
    axiosClient.get("/api/report/branches").then((r) => setBranches(r.data)).catch(() => {});
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/attendance/history/admin", {
        params: {
          from, to,
          page,
          limit: PAGE_SIZE,
          ...(deptId    && { departmentId: deptId }),
          ...(branchId  && { branchId }),
          ...(search.trim() && { search: search.trim() }),
        },
      });
      setData(res.data.data || []);
      setTotal(res.data.pagination?.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [from, to, page, deptId, branchId, search]);

  // Reset về trang 1 khi filter thay đổi (không phải khi page thay đổi)
  useEffect(() => { setPage(1); }, [from, to, deptId, branchId, search, activeTab]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const stats = {
    all: total,
    ontime: data.filter((r) => getStatuses(r).includes("ontime")).length,
    late: data.filter((r) => getStatuses(r).includes("late")).length,
    early: data.filter((r) => getStatuses(r).includes("early")).length,
    absent: data.filter((r) => getStatuses(r).includes("absent")).length,
    missing: data.filter((r) => getStatuses(r).includes("missing")).length,
  };

  const filteredData = data
    .filter((r) => activeTab === "all" || getStatuses(r).includes(activeTab));

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

        <button className="ls-btn-excel" onClick={() => exportToCSV(filteredData)}>
          📥 Xuất Excel
        </button>
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
                <th>
                  Vào ca
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>Quy định 08:00</div>
                </th>
                <th>
                  Ra ca
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>Quy định 17:30</div>
                </th>
                <th>Địa điểm</th>
                <th>Hình ảnh</th>
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
                      {/* Vào ca */}
                      <td>
                        {row.check_in ? (() => {
                          const t = new Date(row.check_in);
                          const hhmm = t.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
                          const isLate = (row.late_minutes ?? 0) > 0;
                          return (
                            <div>
                              <span style={{
                                fontSize: 15, fontWeight: 700, fontVariant: "tabular-nums",
                                color: isLate ? "#dc2626" : "#15803d",
                              }}>{hhmm}</span>
                              {isLate && (
                                <div style={{ fontSize: 11, color: "#dc2626", marginTop: 1 }}>
                                  ⚠ muộn {row.late_minutes} phút
                                </div>
                              )}
                              {!isLate && (
                                <div style={{ fontSize: 11, color: "#15803d", marginTop: 1 }}>✓ đúng giờ</div>
                              )}
                            </div>
                          );
                        })() : (
                          <span style={{ color: "#94a3b8", fontSize: 13 }}>Chưa vào</span>
                        )}
                      </td>
                      {/* Ra ca */}
                      <td>
                        {row.check_out ? (() => {
                          const t = new Date(row.check_out);
                          const hhmm = t.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
                          const isEarly = (row.early_minutes ?? 0) > 0;
                          return (
                            <div>
                              <span style={{
                                fontSize: 15, fontWeight: 700, fontVariant: "tabular-nums",
                                color: isEarly ? "#7c3aed" : "#0369a1",
                              }}>{hhmm}</span>
                              {isEarly && (
                                <div style={{ fontSize: 11, color: "#7c3aed", marginTop: 1 }}>
                                  ⚠ sớm {row.early_minutes} phút
                                </div>
                              )}
                              {!isEarly && (
                                <div style={{ fontSize: 11, color: "#0369a1", marginTop: 1 }}>✓ đủ giờ</div>
                              )}
                            </div>
                          );
                        })() : (
                          <span style={{ color: "#f59e0b", fontSize: 13 }}>Chưa ra</span>
                        )}
                      </td>
                      <td style={{ maxWidth: 220, minWidth: 160 }}>
                        {/* Địa chỉ vào ca (từ check-in mới) */}
                        {row.check_in_address && (
                          <div style={{ fontSize: 11, color: "#374151", marginBottom: 3, lineHeight: 1.4 }}>
                            <span style={{ color: "#22c55e", fontWeight: 700, marginRight: 2 }}>↗</span>
                            {row.check_in_address}
                          </div>
                        )}
                        {/* Địa chỉ ra ca */}
                        {row.check_out_address && (
                          <div style={{ fontSize: 11, color: "#374151", marginBottom: 3, lineHeight: 1.4 }}>
                            <span style={{ color: "#ef4444", fontWeight: 700, marginRight: 2 }}>↙</span>
                            {row.check_out_address}
                          </div>
                        )}
                        {/* Tọa độ GPS → link Google Maps */}
                        {row.latitude && row.longitude && (
                          <a
                            href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            title={`Xem trên bản đồ: ${row.latitude}, ${row.longitude}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 11,
                              color: "#3b82f6",
                              textDecoration: "none",
                              marginTop: row.check_in_address || row.check_out_address ? 2 : 0,
                            }}
                          >
                            📍 {Number(row.latitude).toFixed(4)}, {Number(row.longitude).toFixed(4)}
                          </a>
                        )}
                        {!row.check_in_address && !row.check_out_address && !row.latitude && (
                          <span style={{ color: "#94a3b8" }}>—</span>
                        )}
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
                          <button className="ls-btn-action ls-btn-view" onClick={() => setDetailRecord(row)}>Xem</button>
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

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 0" }}>
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e2e8f0", cursor: page === 1 ? "not-allowed" : "pointer", background: "#fff", color: page === 1 ? "#cbd5e1" : "#374151" }}
          >«</button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e2e8f0", cursor: page === 1 ? "not-allowed" : "pointer", background: "#fff", color: page === 1 ? "#cbd5e1" : "#374151" }}
          >‹</button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
            const p = start + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  padding: "5px 12px", borderRadius: 6, border: "1px solid",
                  borderColor: p === page ? "#3b82f6" : "#e2e8f0",
                  background: p === page ? "#3b82f6" : "#fff",
                  color: p === page ? "#fff" : "#374151",
                  cursor: "pointer", fontWeight: p === page ? 700 : 400,
                }}
              >{p}</button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e2e8f0", cursor: page === totalPages ? "not-allowed" : "pointer", background: "#fff", color: page === totalPages ? "#cbd5e1" : "#374151" }}
          >›</button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e2e8f0", cursor: page === totalPages ? "not-allowed" : "pointer", background: "#fff", color: page === totalPages ? "#cbd5e1" : "#374151" }}
          >»</button>

          <span style={{ fontSize: 13, color: "#64748b", marginLeft: 4 }}>
            Trang {page}/{totalPages} · {total} bản ghi
          </span>
        </div>
      )}

      {previewImg && (
        <div className="ls-photo-overlay" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="preview" className="ls-photo-overlay-img" />
        </div>
      )}

      {detailRecord && (
        <AttendanceDetailModal record={detailRecord} onClose={() => setDetailRecord(null)} />
      )}
    </div>
  );
}
