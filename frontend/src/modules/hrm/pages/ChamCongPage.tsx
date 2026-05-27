import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../features/admin/dashboard/styles/chamCong.css";
import axiosClient from "@api/axiosClient";

// ── Types ─────────────────────────────────────────────────────────────────────
interface KpiData {
  total_nv: number;
  da_cham: number;
  di_muon: number;
  chua_ra: number;
  nghi_phep: number;
}
interface ChartPoint {
  ngay: string;
  da_cham: number;
  da_checkout: number;
  di_muon: number;
  chua_ra: number;
}
interface Branch {
  id: number;
  name: string;
}
interface TopLateItem {
  full_name: string;
  employee_code: string;
  so_lan_muon: number;
  tong_phut_muon: number;
}

const CURRENT_YEAR = new Date().getFullYear();

const NAV_TABS = [
  { key: "ky-cong",   label: "Ký công lương",      bg: "#e8394a" },
  { key: "xep-ca",    label: "Xếp ca làm việc",     bg: "#14b8a6" },
  { key: "du-lieu",   label: "Dữ liệu vào ra",      bg: "#3b82f6" },
  { key: "tong-hop",  label: "Tổng hợp công máy",   bg: "#f97316" },
  { key: "bang-cong", label: "Bảng công tổng hợp",  bg: "#8b5cf6" },
];
const DAY_FULL = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

function smoothPath(pts: { x: number; y: number }[], bottom: number) {
  if (pts.length < 2) return { line: "", area: "" };
  let line = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i], cx = (p0.x + p1.x) / 2;
    line += ` C ${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
  }
  const last = pts[pts.length - 1];
  return { line, area: `${line} L ${last.x},${bottom} L ${pts[0].x},${bottom} Z` };
}

function niceMax(v: number) {
  if (v <= 5)   return 5;
  if (v <= 10)  return 10;
  if (v <= 20)  return 20;
  if (v <= 50)  return 50;
  if (v <= 100) return Math.ceil(v / 25) * 25;
  return Math.ceil(v / 50) * 50;
}

function buildWeekSlots(data: ChartPoint[], endDate: string): ChartPoint[] {
  const end = new Date(endDate + "T12:00:00");
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(end);
    d.setDate(d.getDate() - (6 - i));
    const ngay = d.toISOString().slice(0, 10);
    return data.find((p) => p.ngay.slice(0, 10) === ngay) ?? {
      ngay, da_cham: 0, da_checkout: 0, di_muon: 0, chua_ra: 0,
    };
  });
}

// ── Grouped bar chart ─────────────────────────────────────────────────────────
function GroupedBarChart({ data, endDate }: { data: ChartPoint[]; endDate: string }) {
  const slots = buildWeekSlots(data, endDate);
  const W = 900, H = 260, PL = 44, PR = 20, PT = 16, PB = 42;
  const cH = H - PT - PB;
  const maxV = Math.max(...slots.flatMap((d) => [d.da_cham, d.da_checkout ?? 0]), 1);
  const yMax = niceMax(maxV);
  const gW = (W - PL - PR) / 7;
  const bW = Math.min(34, gW * 0.35);
  const gap = 3;
  const yP = (v: number) => PT + cH * (1 - v / yMax);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(yMax * t));

  return (
    <div className="hd-chart-wrap">
      <div className="hd-legend">
        <span><span className="hd-dot" style={{ background: "#38bdf8" }} />Chấm công vào</span>
        <span><span className="hd-dot" style={{ background: "#f97316" }} />Chấm công ra</span>
      </div>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", flex: 1 }}>
        {ticks.map((v, i) => (
          <g key={i}>
            <line x1={PL} y1={yP(v)} x2={W - PR} y2={yP(v)} stroke="#e8edf3" strokeWidth="1" />
            <text x={PL - 6} y={yP(v) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{v}</text>
          </g>
        ))}
        {slots.map((d, i) => {
          const cx = PL + i * gW + gW / 2;
          const hasIn  = d.da_cham > 0;
          const hasOut = (d.da_checkout ?? 0) > 0;
          const hIn  = hasIn  ? Math.max((d.da_cham / yMax) * cH, 4) : 0;
          const hOut = hasOut ? Math.max(((d.da_checkout ?? 0) / yMax) * cH, 4) : 0;
          const dayLabel = DAY_FULL[new Date(d.ngay.slice(0, 10) + "T12:00:00").getDay()];
          return (
            <g key={i}>
              {hasIn  && <rect x={cx - bW - gap} y={yP(d.da_cham)}         width={bW} height={hIn}  fill="#38bdf8" rx="3" />}
              {hasOut && <rect x={cx + gap}       y={yP(d.da_checkout ?? 0)} width={bW} height={hOut} fill="#f97316" rx="3" />}
              <text x={cx} y={H - 14} textAnchor="middle" fontSize="12" fill="#64748b">{dayLabel}</text>
            </g>
          );
        })}
        <line x1={PL} y1={PT} x2={PL} y2={H - PB} stroke="#e2e8f0" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ── Smooth line chart ─────────────────────────────────────────────────────────
function SmoothLineChart({
  data,
  valueKey,
  color = "#3b82f6",
}: {
  data: ChartPoint[];
  valueKey: keyof ChartPoint;
  color?: string;
}) {
  const W = 280, H = 120, PL = 28, PR = 10, PT = 8, PB = 26;
  const cH = H - PT - PB;
  const vals = data.map((d) => Number(d[valueKey]) || 0);
  const maxV = Math.max(...vals, 1);
  const yMax = Math.max(Math.ceil(maxV / 10) * 10, 10);
  const xS = (W - PL - PR) / Math.max(data.length - 1, 1);
  const yP  = (v: number) => PT + cH * (1 - v / yMax);
  const pts = data.map((d, i) => ({ x: PL + i * xS, y: yP(Number(d[valueKey]) || 0) }));
  const { line, area } = smoothPath(pts, PT + cH);
  const gid = `g-${String(valueKey)}`;

  if (!data.length) return <div className="hd-no-data">Không có dữ liệu</div>;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", flex: 1 }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t, i) => {
        const v = Math.round(yMax * t), y = yP(v);
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            <text x={PL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
          </g>
        );
      })}
      {area && <path d={area} fill={`url(#${gid})`} />}
      {line && <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />}
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke="#fff" strokeWidth="1.5" />)}
      {data.map((d, i) => (
        <text key={i} x={PL + i * xS} y={H - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">
          {DAY_FULL[new Date(d.ngay.slice(0, 10) + "T12:00:00").getDay()]}
        </text>
      ))}
    </svg>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  date,
  loading,
  onDetail,
}: {
  title: string;
  value: number | string;
  date: string;
  loading?: boolean;
  onDetail?: () => void;
}) {
  return (
    <div className="hd-stat-card">
      <div className="hd-stat-card__top">
        <div>
          <div className="hd-stat-card__title">{title}</div>
          <div className="hd-stat-card__date">Ngày {date.split("-").reverse().join("/")}</div>
        </div>
        <div className="hd-stat-card__badge">Hôm nay ▾</div>
      </div>
      <div className="hd-stat-card__value">{loading ? "…" : value}</div>
      <div className="hd-stat-card__footer">
        <span className="hd-stat-card__link" onClick={onDetail}>Xem chi tiết</span>
      </div>
    </div>
  );
}

// ── Top 5 đi muộn ─────────────────────────────────────────────────────────────
function TopLateTable({ data }: { data: TopLateItem[] }) {
  if (!data.length) {
    return <div className="hd-no-data" style={{ fontSize: 12 }}>Không có dữ liệu đi muộn trong tháng</div>;
  }
  return (
    <table className="hd-late-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Họ và tên</th>
          <th>Mã NV</th>
          <th>Số lần muộn</th>
          <th>Tổng phút muộn</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{r.full_name}</td>
            <td style={{ color: "#64748b" }}>{r.employee_code}</td>
            <td style={{ color: "#ef4444", fontWeight: 700 }}>{r.so_lan_muon}</td>
            <td>{r.tong_phut_muon} phút</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ChamCongPage() {
  const navigate = useNavigate();

  const [activeNav,     setActiveNav]     = useState("du-lieu");
  const [globalBranch,  setGlobalBranch]  = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear,  setSelectedYear]  = useState(CURRENT_YEAR);

  // Ngày cuối tháng đã chọn (hoặc hôm nay nếu là tháng hiện tại)
  const selectedDate = useMemo(() => {
    const today = new Date();
    const isCurrentPeriod =
      selectedYear  === today.getFullYear() &&
      selectedMonth === today.getMonth() + 1;
    if (isCurrentPeriod) return today.toISOString().slice(0, 10);
    return new Date(selectedYear, selectedMonth, 0).toISOString().slice(0, 10);
  }, [selectedMonth, selectedYear]);
  const [kpi,          setKpi]          = useState<KpiData | null>(null);
  const [chartData,    setChartData]    = useState<ChartPoint[]>([]);
  const [topLate,      setTopLate]      = useState<TopLateItem[]>([]);
  const [branches,     setBranches]     = useState<Branch[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  useEffect(() => {
    axiosClient.get("/api/report/branches").then((r) => setBranches(r.data)).catch(() => {});
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const p: Record<string, string> = { date: selectedDate };
      if (globalBranch !== "all") p.branchId = globalBranch;
      const res = await axiosClient.get("/api/dashboard/stats", { params: p });
      setKpi(res.data.kpi);
      setChartData(res.data.chart   || []);
      setTopLate(res.data.topLate   || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, globalBranch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const monthLabel = selectedDate.slice(0, 7).replace("-", "/");

  const handleExport = () => {
    const p = new URLSearchParams({ month: selectedDate.slice(0, 7) });
    if (globalBranch !== "all") p.append("branchId", globalBranch);
    window.open(
      `${axiosClient.defaults.baseURL}/report/export/attendance?${p}&token=${localStorage.getItem("token")}`,
      "_blank",
    );
  };

  return (
    <div className="hd-page">

      {/* ── Filter bar ── */}
      <div className="hd-filter">
        <div className="hd-fg">
          <label>Chi nhánh</label>
          <select value={globalBranch} onChange={(e) => setGlobalBranch(e.target.value)}>
            <option value="all">Tất cả chi nhánh</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="hd-fg">
          <label>Tháng</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </select>
        </div>
        <div className="hd-fg">
          <label>Năm</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {[CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="hd-actions">
          <button className="hd-btn hd-btn--outline" onClick={handleExport}>
            📥 Xuất Excel
          </button>
          <button className="hd-btn hd-btn--outline" onClick={() => navigate("/admin/nhan-su/lich-su")}>
            ✏️ Điều chỉnh
          </button>
          <button className="hd-btn hd-btn--dark" onClick={() => navigate("/admin/nhan-su/bao-cao")}>
            📄 Tổng hợp công
          </button>
        </div>
      </div>

      {error && <div className="hd-error">{error}</div>}

      <div className="hd-main">

        {/* ── Row 1: 5 tabs ── */}
        <div className="hd-tabs">
          {NAV_TABS.map((t) => (
            <button
              key={t.key}
              className={`hd-tab${activeNav === t.key ? " hd-tab--active" : ""}`}
              style={{ background: t.bg }}
              onClick={() => setActiveNav(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Row 2: Bar chart ── */}
        <div className="hd-card hd-bar-card">
          <div className="hd-card__title">Tần suất chấm công</div>
          <GroupedBarChart data={chartData} endDate={selectedDate} />
        </div>

        {/* ── Row 3: Twin line charts ── */}
        <div className="hd-twins">
          <div className="hd-card hd-line-card">
            <div className="hd-card__title">Tần suất đi muộn về sớm</div>
            <div className="hd-card__sub">Kỳ lương Tháng {monthLabel}</div>
            <SmoothLineChart
              data={buildWeekSlots(chartData, selectedDate)}
              valueKey="di_muon"
              color="#3b82f6"
            />
          </div>
          <div className="hd-card hd-line-card">
            <div className="hd-card__title">Tần suất chưa check-out</div>
            <div className="hd-card__sub">Kỳ lương Tháng {monthLabel}</div>
            <SmoothLineChart
              data={buildWeekSlots(chartData, selectedDate)}
              valueKey="chua_ra"
              color="#f97316"
            />
          </div>
        </div>

        {/* ── Row 4: Top 5 đi muộn ── */}
        <div className="hd-card hd-top-late">
          <div className="hd-card__title">
            Top 5 nhân sự đi muộn nhiều nhất — Tháng {monthLabel}
          </div>
          <TopLateTable data={topLate} />
        </div>

        {/* ── Cột phải: 3 stat cards (span 4 rows) ── */}
        <div className="hd-right">
          <StatCard
            title="Nhân sự nghỉ phép"
            value={kpi?.nghi_phep ?? 0}
            date={selectedDate}
            loading={loading}
            onDetail={() => navigate("/admin/nhan-su/phe-duyet")}
          />
          <StatCard
            title="Nhân sự đi muộn về sớm"
            value={kpi?.di_muon ?? 0}
            date={selectedDate}
            loading={loading}
            onDetail={() => navigate("/admin/nhan-su/lich-su")}
          />
          <StatCard
            title="Nhân sự chưa check-out"
            value={kpi?.chua_ra ?? 0}
            date={selectedDate}
            loading={loading}
            onDetail={() => navigate("/admin/nhan-su/lich-su")}
          />
        </div>

      </div>
    </div>
  );
}
