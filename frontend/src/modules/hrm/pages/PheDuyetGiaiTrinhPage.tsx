import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axiosClient from "@api/axiosClient";
import { triggerExplanationUpdate } from "@context/PendingCountContext";
import "../styles/pheDuyet.css";

interface Explanation {
  id: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
  corrected_check_in: string | null;
  corrected_check_out: string | null;
  admin_note: string | null;
  work_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  employee_name: string;
  employee_code: string;
  phone: string;
  created_at: string;
  reviewed_at: string | null;
}

type TabType = "all" | "pending" | "approved" | "rejected";

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  // Handle both "HH:MM:SS" TIME format and full ISO datetime
  const s = String(iso);
  if (s.includes("T")) {
    const d = new Date(s);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  return s.slice(0, 5); // "08:00:00" → "08:00"
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  const d = iso.split("T")[0].split("-");
  return `${d[2]}/${d[1]}/${d[0]}`;
}

function calcViolation(item: Explanation): string {
  const tags: string[] = [];
  if (!item.check_in_time) return "Vắng có lý do";
  if (item.check_in_time) {
    const [h, m] = fmtTime(item.check_in_time).split(":").map(Number);
    if (h > 8 || (h === 8 && m > 5)) tags.push("Đi muộn");
  }
  if (item.check_out_time) {
    const [h, m] = fmtTime(item.check_out_time).split(":").map(Number);
    if (h < 17 || (h === 17 && m < 30)) tags.push("Về sớm");
  }
  if (!item.check_out_time && item.check_in_time) tags.push("Quên check-out");
  return tags.length ? tags.join(", ") : "Giải trình khác";
}

const STATUS_MAP = {
  pending:  { label: "Chờ duyệt", color: "#b45309", bg: "#fef3c7" },
  approved: { label: "Đã duyệt",  color: "#15803d", bg: "#dcfce7" },
  rejected: { label: "Từ chối",   color: "#dc2626", bg: "#fee2e2" },
};

// ── Modal phê duyệt / từ chối ──────────────────────────────────────────────
interface ActionModalProps {
  item: Explanation;
  action: "approve" | "reject";
  onConfirm: (note: string) => void;
  onClose: () => void;
  loading: boolean;
}

function ActionModal({ item, action, onConfirm, onClose, loading }: ActionModalProps) {
  const [note, setNote] = useState("");
  const isApprove = action === "approve";

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 16,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", background: isApprove ? "#f0fdf4" : "#fff5f5",
          borderBottom: `2px solid ${isApprove ? "#22c55e" : "#ef4444"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: isApprove ? "#15803d" : "#dc2626" }}>
            {isApprove ? "✅ Phê duyệt đơn giải trình" : "❌ Từ chối đơn giải trình"}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#64748b" }}>×</button>
        </div>

        <div style={{ padding: 20 }}>
          {/* Thông tin nhân viên */}
          <div style={{ display: "flex", gap: 12, padding: 12, background: "#f8fafc", borderRadius: 10, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 16,
            }}>
              {item.employee_name?.[0]?.toUpperCase() ?? "N"}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#0f172a" }}>{item.employee_name}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {item.employee_code} · Ngày {fmtDate(item.work_date)} · {calcViolation(item)}
              </div>
            </div>
          </div>

          {/* So sánh giờ gốc vs đề xuất */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ padding: 12, background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>GIỜ THỰC TẾ</div>
              <div style={{ fontSize: 13, color: "#374151" }}>
                <div>↗ Vào: <b>{fmtTime(item.check_in_time)}</b></div>
                <div>↙ Ra: <b>{fmtTime(item.check_out_time)}</b></div>
              </div>
            </div>
            <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#15803d", marginBottom: 6 }}>ĐỀ XUẤT SỬA THÀNH</div>
              <div style={{ fontSize: 13, color: "#374151" }}>
                <div>↗ Vào: <b>{fmtTime(item.corrected_check_in) !== "—" ? fmtTime(item.corrected_check_in) : "Giữ nguyên"}</b></div>
                <div>↙ Ra: <b>{fmtTime(item.corrected_check_out) !== "—" ? fmtTime(item.corrected_check_out) : "Giữ nguyên"}</b></div>
              </div>
            </div>
          </div>

          {/* Lý do */}
          <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>LÝ DO GIẢI TRÌNH</div>
            <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{item.reason}</div>
          </div>

          {/* Ghi chú admin */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
              {isApprove ? "Ghi chú (tùy chọn)" : "Lý do từ chối *"}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={isApprove ? "Ghi chú thêm cho nhân viên..." : "Nêu rõ lý do từ chối để nhân viên biết..."}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8,
                border: `1.5px solid ${isApprove ? "#86efac" : "#fca5a5"}`,
                fontSize: 13, resize: "vertical", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                padding: "9px 20px", borderRadius: 8, border: "1px solid #e2e8f0",
                background: "#fff", cursor: "pointer", fontSize: 14, color: "#374151",
              }}
            >Huỷ</button>
            <button
              onClick={() => onConfirm(note)}
              disabled={loading || (!isApprove && !note.trim())}
              style={{
                padding: "9px 24px", borderRadius: 8, border: "none",
                background: isApprove ? "#22c55e" : "#ef4444",
                color: "#fff", cursor: loading ? "wait" : "pointer",
                fontSize: 14, fontWeight: 700,
                opacity: (!isApprove && !note.trim()) ? 0.5 : 1,
              }}
            >
              {loading ? "Đang xử lý..." : isApprove ? "Xác nhận duyệt" : "Xác nhận từ chối"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PheDuyetGiaiTrinhPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Explanation[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState<{ item: Explanation; action: "approve" | "reject" } | null>(null);

  const counts = {
    all: data.length,
    pending:  data.filter((d) => d.status === "pending").length,
    approved: data.filter((d) => d.status === "approved").length,
    rejected: data.filter((d) => d.status === "rejected").length,
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/explanations", {
        params: { status: activeTab === "all" ? null : activeTab, limit: 100 },
      });
      setData(res.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleConfirm = async (note: string) => {
    if (!modal) return;
    setActionLoading(true);
    try {
      await axiosClient.post(`/api/explanations/${modal.item.id}/${modal.action}`, {
        adminNote: note || (modal.action === "approve" ? "Đã xử lý từ hệ thống quản trị" : undefined),
      });
      triggerExplanationUpdate();
      setModal(null);
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Lỗi xử lý");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const s = search.toLowerCase();
    return data.filter(
      (item) =>
        item.employee_name?.toLowerCase().includes(s) ||
        item.employee_code?.toLowerCase().includes(s) ||
        (item.phone || "").includes(s),
    );
  }, [data, search]);

  const TABS: { key: TabType; label: string; color: string }[] = [
    { key: "all",      label: "Tất cả",   color: "#64748b" },
    { key: "pending",  label: "Chờ duyệt",color: "#b45309" },
    { key: "approved", label: "Đã duyệt", color: "#15803d" },
    { key: "rejected", label: "Từ chối",  color: "#dc2626" },
  ];

  return (
    <div className="pd-page">
      {/* Header */}
      <div className="pd-tabs-container">
        <div className="pd-tabs-header">
          <div className="pd-tabs-list">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`pd-tab ${activeTab === tab.key ? "pd-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span
                  className="pd-count"
                  style={{
                    background: activeTab === tab.key ? tab.color : "#e2e8f0",
                    color: activeTab === tab.key ? "#fff" : "#64748b",
                  }}
                >
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div className="pd-search-wrap" style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="pd-search-input"
                placeholder="Tên, mã NV, SĐT..."
                style={{ paddingLeft: 32 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="pd-btn-refresh" onClick={fetchData} disabled={loading} title="Làm mới">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="pd-table-wrap" style={{ marginTop: 20 }}>
        <table className="pd-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Nhân viên</th>
              <th>Ngày / Vi phạm</th>
              <th>
                Giờ thực tế
                <div style={{ fontSize: 10, fontWeight: 400, color: "#94a3b8" }}>Vào — Ra</div>
              </th>
              <th>
                Đề xuất sửa
                <div style={{ fontSize: 10, fontWeight: 400, color: "#94a3b8" }}>Vào — Ra</div>
              </th>
              <th style={{ maxWidth: 220 }}>Lý do giải trình</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Đang tải...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="pd-empty">
                    <div style={{ fontSize: 40 }}>📋</div>
                    <div className="pd-empty-title">Chưa có đơn giải trình nào</div>
                    <div className="pd-empty-sub">Khi nhân viên gửi đơn, chúng sẽ xuất hiện ở đây.</div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item, i) => {
                const st = STATUS_MAP[item.status];
                const violation = calcViolation(item);
                const isPending = item.status === "pending";
                return (
                  <tr key={item.id} style={{ background: isPending ? "#fffbeb" : undefined }}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="pd-nv-cell">
                        <div className="pd-avatar">{item.employee_name?.[0]?.toUpperCase() ?? "?"}</div>
                        <div>
                          <div className="pd-nv-name">{item.employee_name}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.employee_code}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{fmtDate(item.work_date)}</div>
                      <div style={{
                        fontSize: 11, marginTop: 3, padding: "2px 8px", borderRadius: 10, display: "inline-block",
                        background: "#fef3c7", color: "#b45309", fontWeight: 600,
                      }}>{violation}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: "#dc2626" }}>
                        <span>↗ {fmtTime(item.check_in_time)}</span>
                        <span style={{ margin: "0 4px", color: "#cbd5e1" }}>|</span>
                        <span>↙ {fmtTime(item.check_out_time)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: "#15803d", fontWeight: 700 }}>
                        <span>↗ {item.corrected_check_in ? fmtTime(item.corrected_check_in) : "—"}</span>
                        <span style={{ margin: "0 4px", color: "#cbd5e1" }}>|</span>
                        <span>↙ {item.corrected_check_out ? fmtTime(item.corrected_check_out) : "—"}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: 220 }}>
                      <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
                        {item.reason}
                      </div>
                      {item.admin_note && (
                        <div style={{
                          marginTop: 6, fontSize: 11, padding: "4px 8px",
                          background: "#fff7ed", borderLeft: "3px solid #f97316",
                          borderRadius: "0 6px 6px 0", color: "#9a3412",
                        }}>
                          <b>Admin:</b> {item.admin_note}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>{fmtDate(item.created_at)}</td>
                    <td>
                      <span style={{
                        padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                        background: st.bg, color: st.color,
                      }}>{st.label}</span>
                      {item.reviewed_at && (
                        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>
                          {fmtDate(item.reviewed_at)}
                        </div>
                      )}
                    </td>
                    <td>
                      {isPending ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <button
                            onClick={() => setModal({ item, action: "approve" })}
                            style={{
                              padding: "6px 14px", borderRadius: 6, border: "none",
                              background: "#22c55e", color: "#fff", cursor: "pointer",
                              fontSize: 13, fontWeight: 700,
                            }}
                          >✓ Duyệt</button>
                          <button
                            onClick={() => setModal({ item, action: "reject" })}
                            style={{
                              padding: "6px 14px", borderRadius: 6, border: "none",
                              background: "#fff", color: "#dc2626", cursor: "pointer",
                              fontSize: 13, fontWeight: 700,
                              border: "1.5px solid #fca5a5",
                            } as any}
                          >✕ Từ chối</button>
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <ActionModal
          item={modal.item}
          action={modal.action}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
