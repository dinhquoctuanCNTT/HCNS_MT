import { useEffect, useState } from "react";
import axiosClient from "../../../../api/axiosClient";

type OTReq = {
  id: number; user_id: number; full_name: string; employee_code: string;
  department_name: string; work_date: string; start_time: string; end_time: string;
  hours: number; reason: string; coefficient: number; status: string;
  approver_name: string; reject_note: string; created_at: string;
};
type Summary = {
  full_name: string; employee_code: string; department_name: string;
  total_hours: number; weighted_hours: number; sessions: number;
};

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  pending:  { text: "Chờ duyệt", color: "#92400e", bg: "#fef3c7" },
  approved: { text: "Đã duyệt",  color: "#166534", bg: "#dcfce7" },
  rejected: { text: "Từ chối",   color: "#991b1b", bg: "#fee2e2" },
};
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("vi-VN") : "—";

export default function LamThemGioPage() {
  const now = new Date();
  const [tab, setTab] = useState<"list" | "summary">("list");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());
  const [requests, setRequests] = useState<OTReq[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OTReq | null>(null);
  const [note, setNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/overtime?status=${statusFilter}&month=${month}&year=${year}`);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch { setRequests([]); } finally { setLoading(false); }
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/overtime/summary?month=${month}&year=${year}`);
      setSummary(Array.isArray(res.data) ? res.data : []);
    } catch { setSummary([]); } finally { setLoading(false); }
  };

  useEffect(() => { tab === "list" ? fetchList() : fetchSummary(); }, [tab, statusFilter, month]);

  const doAction = async (action: "approve" | "reject") => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axiosClient.patch(`/overtime/${selected.id}/${action}`, { note });
      setSelected(null); setNote("");
      fetchList();
    } catch (e: any) {
      alert(e.response?.data?.message || "Lỗi");
    } finally { setActionLoading(false); }
  };

  const totalHours    = summary.reduce((s, r) => s + (r.total_hours ?? 0), 0);
  const totalWeighted = summary.reduce((s, r) => s + (r.weighted_hours ?? 0), 0);

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Quản lý làm thêm giờ</h2>
        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>Phê duyệt & tổng hợp OT — hệ số 150%</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 8, padding: 4, width: "fit-content", marginBottom: 20 }}>
        {[{ key: "list", label: "Danh sách đơn" }, { key: "summary", label: "Tổng hợp tháng" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding: "6px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
              background: tab === t.key ? "#fff" : "transparent",
              color: tab === t.key ? "#1d4ed8" : "#6b7280",
              boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Bộ lọc tháng */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Tháng:</span>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
          <button key={m} onClick={() => setMonth(m)}
            style={{ padding: "4px 12px", borderRadius: 16, border: "1px solid", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: month === m ? "#1d4ed8" : "#fff",
              color:      month === m ? "#fff"    : "#374151",
              borderColor: month === m ? "#1d4ed8" : "#d1d5db" }}>
            T{m}
          </button>
        ))}
      </div>

      {/* ── Tab: Danh sách ── */}
      {tab === "list" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["pending", "approved", "rejected", ""].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                style={{ padding: "5px 14px", borderRadius: 20, border: "1px solid", cursor: "pointer", fontSize: 12, fontWeight: 600,
                  background: statusFilter === s ? "#1d4ed8" : "#fff",
                  color:      statusFilter === s ? "#fff"    : "#374151",
                  borderColor: statusFilter === s ? "#1d4ed8" : "#d1d5db" }}>
                {s === "" ? "Tất cả" : STATUS_LABEL[s]?.text ?? s}
              </button>
            ))}
          </div>

          {loading ? <p style={{ color: "#6b7280" }}>Đang tải...</p> : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    {["Nhân viên", "Bộ phận", "Ngày làm", "Từ giờ", "Đến giờ", "Số giờ", "Hệ số", "Lý do", "Trạng thái", ""].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan={10} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Không có dữ liệu</td></tr>
                  ) : requests.map(r => {
                    const s = STATUS_LABEL[r.status] ?? { text: r.status, color: "#6b7280", bg: "#f3f4f6" };
                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 600 }}>{r.full_name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.employee_code}</div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>{r.department_name || "—"}</td>
                        <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{fmtDate(r.work_date)}</td>
                        <td style={{ padding: "10px 12px" }}>{r.start_time?.slice(0, 5)}</td>
                        <td style={{ padding: "10px 12px" }}>{r.end_time?.slice(0, 5)}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center", color: "#1d4ed8" }}>{r.hours}h</td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          <span style={{ fontSize: 11, background: r.coefficient === 1.5 ? "#eff6ff" : "#f3f4f6", color: r.coefficient === 1.5 ? "#1d4ed8" : "#374151", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                            x{r.coefficient}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#6b7280", maxWidth: 140 }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason || "—"}</div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>{s.text}</span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          {r.status === "pending" && (
                            <button onClick={() => { setSelected(r); setNote(""); }}
                              style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #3b82f6", background: "#eff6ff", color: "#1d4ed8", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                              Xử lý
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Tab: Tổng hợp ── */}
      {tab === "summary" && (
        <>
          {loading ? <p style={{ color: "#6b7280" }}>Đang tải...</p> : (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                {[
                  { label: "Tổng giờ OT", val: `${totalHours}h`, color: "#3b82f6" },
                  { label: "Giờ quy đổi (×hệ số)", val: `${totalWeighted.toFixed(1)}h`, color: "#8b5cf6" },
                  { label: "Nhân viên OT", val: summary.length, color: "#22c55e" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                      {["Nhân viên", "Bộ phận", "Số buổi", "Tổng giờ", "Giờ quy đổi (x150%)"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#6b7280" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {summary.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Không có dữ liệu tháng {month}/{year}</td></tr>
                    ) : summary.map((s, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 600 }}>{s.full_name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.employee_code}</div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>{s.department_name || "—"}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>{s.sessions}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, color: "#3b82f6" }}>{s.total_hours}h</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, color: "#8b5cf6" }}>{Number(s.weighted_hours).toFixed(1)}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {/* ── Modal xử lý ── */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => setSelected(null)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 440, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Xử lý đăng ký OT</h3>
            <div style={{ background: "#f9fafb", borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 13 }}>
              <p style={{ margin: "0 0 6px" }}><strong>Nhân viên:</strong> {selected.full_name}</p>
              <p style={{ margin: "0 0 6px" }}><strong>Ngày:</strong> {fmtDate(selected.work_date)}</p>
              <p style={{ margin: "0 0 6px" }}><strong>Giờ:</strong> {selected.start_time?.slice(0,5)} → {selected.end_time?.slice(0,5)} ({selected.hours}h × {selected.coefficient})</p>
              <p style={{ margin: 0 }}><strong>Lý do:</strong> {selected.reason || "—"}</p>
            </div>
            <textarea placeholder="Ghi chú (tuỳ chọn)" value={note} onChange={e => setNote(e.target.value)}
              style={{ width: "100%", height: 72, padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, resize: "none", boxSizing: "border-box", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setSelected(null)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Huỷ</button>
              <button disabled={actionLoading} onClick={() => doAction("reject")}
                style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", cursor: "pointer", fontWeight: 600 }}>
                Từ chối
              </button>
              <button disabled={actionLoading} onClick={() => doAction("approve")}
                style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#1d4ed8", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                {actionLoading ? "Đang xử lý..." : "Duyệt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
