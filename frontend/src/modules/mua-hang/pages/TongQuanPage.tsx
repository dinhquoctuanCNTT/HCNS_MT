import React, { useState } from "react";
import {
  RefreshCw,
  ChevronDown,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Send,
  AlertCircle,
  ArrowDownUp,
} from "lucide-react";
import "./TongQuanPage.css";

/* ──────────────────────────────────────────────
   TYPES
   ────────────────────────────────────────────── */
interface StatusCircle {
  id: string;
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface TopProduct {
  maHang: string;
  tenHang: string;
  soLuong: number;
  giaTri: string;
}

/* ──────────────────────────────────────────────
   MOCK DATA
   ────────────────────────────────────────────── */
const statusCircles: StatusCircle[] = [
  {
    id: "all",
    label: "Tất cả",
    count: 42,
    icon: FileText,
    color: "#6366f1",
    bgColor: "rgba(99, 102, 241, 0.08)",
  },
  {
    id: "draft",
    label: "Nháp",
    count: 5,
    icon: FileText,
    color: "#94a3b8",
    bgColor: "rgba(148, 163, 184, 0.08)",
  },
  {
    id: "sent",
    label: "Đã gửi",
    count: 8,
    icon: Send,
    color: "#0ea5e9",
    bgColor: "rgba(14, 165, 233, 0.08)",
  },
  {
    id: "pending",
    label: "Chờ duyệt",
    count: 12,
    icon: Clock,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.08)",
  },
  {
    id: "approved",
    label: "Đã duyệt",
    count: 10,
    icon: CheckCircle,
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.08)",
  },
  {
    id: "rejected",
    label: "Từ chối",
    count: 3,
    icon: XCircle,
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.08)",
  },
  {
    id: "cancelled",
    label: "Đã huỷ",
    count: 4,
    icon: AlertCircle,
    color: "#78716c",
    bgColor: "rgba(120, 113, 108, 0.08)",
  },
];

const topProducts: TopProduct[] = [
  { maHang: "VT001", tenHang: "Sơn ngoại thất cao cấp 18L", soLuong: 520, giaTri: "1.560.000.000" },
  { maHang: "VT002", tenHang: "Bột trét tường nội thất 40kg", soLuong: 1200, giaTri: "960.000.000" },
  { maHang: "VT003", tenHang: "Sơn lót chống kiềm 18L", soLuong: 380, giaTri: "684.000.000" },
  { maHang: "VT004", tenHang: "Sơn phủ nội thất mịn 5L", soLuong: 950, giaTri: "475.000.000" },
  { maHang: "VT005", tenHang: "Chất chống thấm Polyurethane", soLuong: 210, giaTri: "420.000.000" },
  { maHang: "VT006", tenHang: "Bột bả ngoại thất 40kg", soLuong: 800, giaTri: "320.000.000" },
];

/* ──────────────────────────────────────────────
   COMPONENT: TongQuanPage (Dashboard)
   ────────────────────────────────────────────── */
export const TongQuanPage: React.FC = () => {
  const [currency] = useState("VND");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="mh-dashboard">
      {/* ── HEADER ── */}
      <header className="mh-dashboard__header">
        <h1 className="mh-dashboard__title">Mua hàng</h1>

        <div className="mh-dashboard__header-actions">
          {/* Currency dropdown */}
          <div className="mh-dashboard__currency-dropdown">
            <span className="mh-dashboard__currency-label">Loại tiền:</span>
            <button className="mh-dashboard__currency-btn">
              <span>{currency}</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Refresh button */}
          <button
            className={`mh-dashboard__refresh-btn${isRefreshing ? " mh-dashboard__refresh-btn--spinning" : ""}`}
            onClick={handleRefresh}
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* ── GRID LAYOUT ── */}
      <div className="mh-dashboard__grid">
        {/* ═══════ ROW 1 ═══════ */}

        {/* Card: Đề nghị mua hàng */}
        <div className="mh-card mh-dashboard__request-card">
          <div className="mh-card__header">
            <h2 className="mh-card__title">Đề nghị mua hàng</h2>
            <span className="mh-card__badge">Tháng này</span>
          </div>

          <div className="mh-card__body">
            <div className="mh-request__flow">
              {/* Left statuses */}
              <div className="mh-request__statuses mh-request__statuses--left">
                {statusCircles.slice(0, 3).map((status) => {
                  const Icon = status.icon;
                  return (
                    <div key={status.id} className="mh-status-item">
                      <div
                        className="mh-status-item__circle"
                        style={{
                          borderColor: status.color,
                          backgroundColor: status.bgColor,
                        }}
                      >
                        <Icon size={18} style={{ color: status.color }} />
                      </div>
                      <span className="mh-status-item__count" style={{ color: status.color }}>
                        {status.count}
                      </span>
                      <span className="mh-status-item__label">{status.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Center play button */}
              <div className="mh-request__play-wrapper">
                <button className="mh-request__play-btn" title="Bắt đầu quy trình">
                  <Play size={28} fill="white" color="white" style={{ marginLeft: "3px" }} />
                </button>
                <span className="mh-request__play-label">Bắt đầu</span>
              </div>

              {/* Right statuses */}
              <div className="mh-request__statuses mh-request__statuses--right">
                {statusCircles.slice(3).map((status) => {
                  const Icon = status.icon;
                  return (
                    <div key={status.id} className="mh-status-item">
                      <div
                        className="mh-status-item__circle"
                        style={{
                          borderColor: status.color,
                          backgroundColor: status.bgColor,
                        }}
                      >
                        <Icon size={18} style={{ color: status.color }} />
                      </div>
                      <span className="mh-status-item__count" style={{ color: status.color }}>
                        {status.count}
                      </span>
                      <span className="mh-status-item__label">{status.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card: Giá trị mua theo thời gian (Line Chart placeholder) */}
        <div className="mh-card mh-dashboard__chart-card">
          <div className="mh-card__header">
            <h2 className="mh-card__title">Giá trị mua theo thời gian</h2>
            <div className="mh-card__header-actions">
              <button className="mh-card__filter-btn mh-card__filter-btn--active">Tháng</button>
              <button className="mh-card__filter-btn">Quý</button>
              <button className="mh-card__filter-btn">Năm</button>
            </div>
          </div>

          <div className="mh-card__body">
            {/* Placeholder for Line Chart */}
            <div className="mh-chart-placeholder" id="line-chart-container">
              <div className="mh-chart-placeholder__visual">
                {/* Decorative mini-bars to hint at chart area */}
                <svg
                  className="mh-chart-placeholder__svg"
                  viewBox="0 0 400 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline
                    points="0,120 40,100 80,110 120,70 160,85 200,50 240,60 280,30 320,45 360,20 400,35"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
                  </linearGradient>
                  <polygon
                    points="0,120 40,100 80,110 120,70 160,85 200,50 240,60 280,30 320,45 360,20 400,35 400,160 0,160"
                    fill="url(#areaGradient)"
                  />
                  {/* X-axis labels */}
                  <text x="0" y="155" fontSize="10" fill="#94a3b8">T1</text>
                  <text x="72" y="155" fontSize="10" fill="#94a3b8">T3</text>
                  <text x="145" y="155" fontSize="10" fill="#94a3b8">T5</text>
                  <text x="218" y="155" fontSize="10" fill="#94a3b8">T7</text>
                  <text x="290" y="155" fontSize="10" fill="#94a3b8">T9</text>
                  <text x="360" y="155" fontSize="10" fill="#94a3b8">T11</text>
                </svg>
              </div>
              <p className="mh-chart-placeholder__text">
                Nhúng thư viện biểu đồ (Recharts / Chart.js) tại đây
              </p>
            </div>
          </div>
        </div>

        {/* ═══════ ROW 2 ═══════ */}

        {/* Card: Nhà cung cấp có giá trị mua lớn (Bar Chart placeholder) */}
        <div className="mh-card mh-dashboard__supplier-card">
          <div className="mh-card__header">
            <h2 className="mh-card__title">Nhà cung cấp có giá trị mua lớn</h2>
            <span className="mh-card__badge">Top 10</span>
          </div>

          <div className="mh-card__body">
            {/* Placeholder for Bar Chart */}
            <div className="mh-chart-placeholder" id="bar-chart-container">
              <div className="mh-chart-placeholder__visual">
                <svg
                  className="mh-chart-placeholder__svg"
                  viewBox="0 0 400 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Decorative horizontal bars */}
                  <rect x="80" y="10" width="300" height="20" rx="4" fill="#2563eb" opacity="0.85" />
                  <rect x="80" y="38" width="250" height="20" rx="4" fill="#3b82f6" opacity="0.7" />
                  <rect x="80" y="66" width="200" height="20" rx="4" fill="#60a5fa" opacity="0.6" />
                  <rect x="80" y="94" width="160" height="20" rx="4" fill="#93bbfd" opacity="0.5" />
                  <rect x="80" y="122" width="120" height="20" rx="4" fill="#bfdbfe" opacity="0.45" />
                  <rect x="80" y="150" width="90" height="20" rx="4" fill="#dbeafe" opacity="0.4" />
                  {/* Y-axis labels */}
                  <text x="0" y="24" fontSize="10" fill="#64748b" fontWeight="500">NCC A</text>
                  <text x="0" y="52" fontSize="10" fill="#64748b" fontWeight="500">NCC B</text>
                  <text x="0" y="80" fontSize="10" fill="#64748b" fontWeight="500">NCC C</text>
                  <text x="0" y="108" fontSize="10" fill="#64748b" fontWeight="500">NCC D</text>
                  <text x="0" y="136" fontSize="10" fill="#64748b" fontWeight="500">NCC E</text>
                  <text x="0" y="164" fontSize="10" fill="#64748b" fontWeight="500">NCC F</text>
                </svg>
              </div>
              <p className="mh-chart-placeholder__text">
                Nhúng thư viện biểu đồ (Recharts / Chart.js) tại đây
              </p>
            </div>
          </div>
        </div>

        {/* Card: Mặt hàng mua nhiều nhất */}
        <div className="mh-card mh-dashboard__products-card">
          <div className="mh-card__header">
            <h2 className="mh-card__title">Mặt hàng mua nhiều nhất</h2>
            <button className="mh-card__sort-btn" title="Sắp xếp">
              <ArrowDownUp size={16} />
              <span>Sắp xếp</span>
            </button>
          </div>

          <div className="mh-card__body mh-card__body--no-padding">
            <div className="mh-table-wrapper">
              <table className="mh-table">
                <thead className="mh-table__head">
                  <tr>
                    <th className="mh-table__th mh-table__th--stt">#</th>
                    <th className="mh-table__th">Mã hàng</th>
                    <th className="mh-table__th">Tên hàng</th>
                    <th className="mh-table__th mh-table__th--number">Số lượng</th>
                    <th className="mh-table__th mh-table__th--number">Giá trị (VND)</th>
                  </tr>
                </thead>
                <tbody className="mh-table__body">
                  {topProducts.map((product, index) => (
                    <tr key={product.maHang} className="mh-table__row">
                      <td className="mh-table__td mh-table__td--stt">
                        <span
                          className={`mh-table__rank${
                            index < 3 ? ` mh-table__rank--top${index + 1}` : ""
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="mh-table__td">
                        <code className="mh-table__code">{product.maHang}</code>
                      </td>
                      <td className="mh-table__td">{product.tenHang}</td>
                      <td className="mh-table__td mh-table__td--number">
                        {product.soLuong.toLocaleString("vi-VN")}
                      </td>
                      <td className="mh-table__td mh-table__td--number mh-table__td--value">
                        {product.giaTri}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TongQuanPage;
