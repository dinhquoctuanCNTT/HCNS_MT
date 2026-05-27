import { useEffect, useState } from "react";
import axiosClient from "@api/axiosClient";

type LeaveReq = {
  id: number; user_id: number; full_name: string; employee_code: string;
  department_name: string; leave_type: string; leave_category: string;
  from_date: string; to_date: string; total_days: number; reason: string;
  status: string; tbp_name: string; hcns_name: string;
  tbp_note: string; hcns_note: string; reject_reason: string;
  created_at: string;
};
type Balance = {
  user_id: number; full_name: string; employee_code: string;
  department_name: string; year: number;
  total_days: number; used_days: number; carried_over: number;
};

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  pending:      { text: "Chờ TBP duyệt",  color: "#92400e", bg: "#fef3c7" },
  tbp_approved: { text: "Chờ HCNS duyệt", color: "#1d4ed8", bg: "#dbeafe" },
  approved:     { text: "Đã duyệt",        color: "#166534", bg: "#dcfce7" },
  rejected:     { text: "Từ chối",         color: "#991b1b", bg: "#fee2e2" },
  cancelled:    { text: "Đã huỷ",          color: "#6b7280", bg: "#f3f4f6" },
};
const CAT_LABEL: Record<string, string> = {
  annual:    "Phép năm",
  unpaid:    "Không lương",
  emergency: "Bất khả kháng",
};
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("vi-VN") : "—";

export default function NgayPhepPage() {
  const [tab, setTab] = useState<"requests" | "balance">("requests");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [requests, setRequests] = useState<LeaveReq[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<LeaveReq | null>(null);
  const [note, setNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const year = new Date().getFullYear();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/leaves?status=${statusFilter}`);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch { setRequests([]); } finally { setLoading(false); }
  };

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const [balRes, statsRes] = await Promise.all([
        axiosClient.get(`/leaves/balances?year=${year}`),
        axiosClient.get(`/leaves/stats?year=${year}`),
      ]);
      setBalances(Array.isArray(balRes.data) ? balRes.data : []);
      setStats(statsRes.data);
    } catch { setBalances([]); } finally { setLoading(false); }
  };

  useEffect(() => { tab === "requests" ? fetchRequests() : fetchBalances(); }, [tab, statusFilter]);

  const doAction = async (action: string) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axiosClient.patch(`/leaves/${selected.id}/${action}`, { note });
      setSelected(null); setNote("");
      fetchRequests();
    } catch (e: any) {
      alert(e.response?.data?.message || "Lỗi");
    } finally { setActionLoading(false); }
  };

  const remaining = (b: Balance) => Math.max(0, b.total_days + b.carried_over - b.used_days);

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Quản lý nghỉ phép</h2>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>Phê duyệt đơn nghỉ phép & theo dõi số dư</p>
        </div>
        {stats && (
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Chờ TBP", val: stats.pending,      color: "#f59e0b" },
              { label: "Chờ HCNS", val: stats.waiting_hcns, color: "#3b82f6" },
              { label: "Đã duyệt", val: stats.approved,     color: "#22c55e" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 16px" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 8, padding: 4, width: "fit-content", marginBottom: 20 }}>
        {[{ key: "requests", label: "Đơn nghỉ phép" }, { key: "balance", label: "Số dư ngày phép" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding: "6px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
              background: tab === t.key ? "#fff" : "transparent",
              color: tab === t.key ? "#1d4ed8" : "#6b7280",
              boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Đơn nghỉ phép ── */}
      {tab === "requests" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {["pending", "tbp_approved", "approved", "rejected", ""].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                style={{ padding: "5px 14px", borderRadius: 20, border: "1px solid", cursor: "pointer", fontSize: 12, fontWeight: 600,
                  background: statusFilter === s ? "#1d4ed8" : "#fff",
                  color: statusFilter === s ? "#fff" : "#374151",
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
                    {["Nhân viên", "Bộ phận", "Loại", "Từ ngày", "Đến ngày", "Số ngày", "Lý do", "Trạng thái", ""].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan={9} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Không có đơn nào</td></tr>
                  ) : requests.map(r => {
                    const s = STATUS_LABEL[r.status] ?? { text: r.status, color: "#6b7280", bg: "#f3f4f6" };
                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 600 }}>{r.full_name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.employee_code}</div>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#374151" }}>{r.department_name || "—"}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: 11, background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: 12, fontWeight: 600 }}>
                            {CAT_LABEL[r.leave_category] ?? r.leave_type}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{fmtDate(r.from_date)}</td>
                        <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{fmtDate(r.to_date)}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>{r.total_days}</td>
                        <td style={{ padding: "10px 12px", color: "#6b7280", maxWidth: 160 }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason || "—"}</div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
                            {s.text}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          {(r.status === "pending" || r.status === "tbp_approved") && (
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

      {/* ── Tab: Số dư ngày phép ── */}
      {tab === "balance" && (
        <>
          {loading ? <p style={{ color: "#6b7280" }}>Đang tải...</p> : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    {["Nhân viên", "Bộ phận", "Tổng phép", "Chuyển kỳ", "Đã dùng", "Còn lại", "Trạng thái"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#6b7280" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {balances.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Không có dữ liệu</td></tr>
                  ) : balances.map(b => {
                    const rem = remaining(b);
                    return (
                      <tr key={b.user_id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 600 }}>{b.full_name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{b.employee_code}</div>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#374151" }}>{b.department_name || "—"}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>{b.total_days}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#6b7280" }}>{b.carried_over}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#ef4444", fontWeight: 600 }}>{b.used_days}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          <span style={{ fontWeight: 700, color: rem <= 1 ? "#ef4444" : rem <= 3 ? "#f59e0b" : "#22c55e", fontSize: 15 }}>{rem}</span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, fontWeight: 600,
                            background: rem === 0 ? "#fee2e2" : rem <= 2 ? "#fef3c7" : "#dcfce7",
                            color:      rem === 0 ? "#991b1b" : rem <= 2 ? "#92400e" : "#166534" }}>
                            {rem === 0 ? "Hết phép" : rem <= 2 ? "Sắp hết" : "Còn phép"}
                          </span>
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

      {/* ── Modal xử lý đơn ── */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => setSelected(null)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 480, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Xử lý đơn nghỉ phép</h3>
            <div style={{ background: "#f9fafb", borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 13 }}>
              <p style={{ margin: "0 0 6px" }}><strong>Nhân viên:</strong> {selected.full_name}</p>
              <p style={{ margin: "0 0 6px" }}><strong>Loại:</strong> {CAT_LABEL[selected.leave_category] ?? selected.leave_type}</p>
              <p style={{ margin: "0 0 6px" }}><strong>Thời gian:</strong> {fmtDate(selected.from_date)} → {fmtDate(selected.to_date)} ({selected.total_days} ngày)</p>
              <p style={{ margin: 0 }}><strong>Lý do:</strong> {selected.reason || "—"}</p>
            </div>

            {selected.status === "pending" && (
              <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Bạn đang duyệt với vai trò <strong>Trưởng bộ phận (bước 1)</strong></p>
            )}
            {selected.status === "tbp_approved" && (
              <>
                <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>TBP đã duyệt bước 1 {selected.tbp_name ? `(${selected.tbp_name})` : ""}</p>
                <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Bạn đang duyệt với vai trò <strong>HCNS (bước 2 - hoàn tất)</strong></p>
              </>
            )}

            <textarea placeholder="Ghi chú (tuỳ chọn)" value={note} onChange={e => setNote(e.target.value)}
              style={{ width: "100%", height: 72, padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, resize: "none", boxSizing: "border-box", marginBottom: 16 }} />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setSelected(null)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Huỷ</button>
              <button disabled={actionLoading}
                onClick={() => doAction(selected.status === "pending" ? "tbp-reject" : "hcns-reject")}
                style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", cursor: "pointer", fontWeight: 600 }}>
                Từ chối
              </button>
              <button disabled={actionLoading}
                onClick={() => doAction(selected.status === "pending" ? "tbp-approve" : "hcns-approve")}
                style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#1d4ed8", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                {actionLoading ? "Đang xử lý..." : selected.status === "pending" ? "Duyệt bước 1" : "Duyệt hoàn tất"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
