import React, { useState } from "react";
import { Play, RefreshCw, Settings, Info, ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const chartData = [
  { week: "Tuần 1", value: 52 },
  { week: "Tuần 2", value: 30 },
  { week: "Tuần 3", value: 38 },
  { week: "Tuần 4", value: 58 },
  { week: "Tuần 5", value: 12 },
  { week: "Tuần 6", value: 65 },
];

const topSuppliers = [
  { name: "NCC 0001", value: 70 },
  { name: "NCC 0002", value: 50 },
  { name: "NCC 0003", value: 30 },
];

const topItems = [
  { name: "Sản phẩm A", qty: 120, value: 4800000 },
  { name: "Sản phẩm B", qty: 95, value: 3800000 },
  { name: "Sản phẩm C", qty: 70, value: 3150000 },
];

const CardHeader = ({ title, onRefresh }) => (
  <div className="dashboard__card-header">
    <h2 className="dashboard__card-title">{title}</h2>
    <div className="dashboard__card-filters">
      <span className="dashboard__filter-label">
        Tháng này <ChevronDown size={12} />
      </span>
      <RefreshCw
        size={14}
        className="dashboard__icon"
        onClick={onRefresh}
        style={{ cursor: "pointer" }}
      />
      <Settings
        size={14}
        className="dashboard__icon"
        style={{ cursor: "pointer" }}
      />
    </div>
  </div>
);

export const Dashboard = () => {
  const [currency, setCurrency] = useState("VND");

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard__header">
        <h4 className="dashboard__title">Tổng quan</h4>
        <div className="dashboard__controls">
          <label className="dashboard__label" htmlFor="currency-select">
            Loại tiền
          </label>
          <Info size={16} className="dashboard__icon" />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <select
              id="currency-select"
              className="dashboard__select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </header>

      {/* Grid */}
      <section className="dashboard__grid">
        {/* Card 1 – Đề nghị mua hàng */}
        <div className="dashboard__card">
          <CardHeader title="Đề nghị mua hàng" />
          <div
            className="dashboard__card-body"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "8px 0",
            }}
          >
            {/* Status list */}
            <ul
              className="dashboard__list"
              style={{ flex: 1, margin: 0, padding: 0, listStyle: "none" }}
            >
              {[
                "Tất cả",
                "Đã lập",
                "Chờ duyệt",
                "Đã duyệt",
                "Từ chối",
                "Đã hủy",
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: "6px 0",
                    fontSize: 14,
                    color: i === 0 ? "#1e293b" : "#64748b",
                    fontWeight: i === 0 ? 600 : 400,
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {item}
                  <span
                    style={{
                      display: "inline-block",
                      width: 60,
                      height: 6,
                      background: "#e2e8f0",
                      borderRadius: 4,
                    }}
                  />
                </li>
              ))}
            </ul>

            {/* Play button */}
            <button
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#2563eb",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                flexShrink: 0,
              }}
            >
              <Play size={28} color="#fff" style={{ marginLeft: 4 }} />
            </button>
          </div>
        </div>

        {/* Card 2 – Giá trị mua theo thời gian */}
        <div className="dashboard__card">
          <CardHeader title="Giá trị mua theo thời gian" />
          <div className="dashboard__card-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3 – Nhà cung cấp */}
        <div className="dashboard__card">
          <CardHeader title="Nhà cung cấp có giá trị mua lớn" />
          <div
            className="dashboard__card-body"
            style={{
              padding: "8px 0",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {topSuppliers.map((sup, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {sup.name}
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    background: "#f1f5f9",
                    borderRadius: 9999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${sup.value}%`,
                      background:
                        "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
                      borderRadius: 9999,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4 – Mặt hàng mua nhiều nhất */}
        <div className="dashboard__card">
          <CardHeader title="Mặt hàng mua nhiều nhất" />
          <div className="dashboard__card-body" style={{ padding: 0 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13.5,
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      color: "#64748b",
                      fontWeight: 600,
                      borderBottom: "1.5px solid #e2e8f0",
                    }}
                  >
                    Tên
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "right",
                      color: "#64748b",
                      fontWeight: 600,
                      borderBottom: "1.5px solid #e2e8f0",
                    }}
                  >
                    Số lượng
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "right",
                      color: "#64748b",
                      fontWeight: 600,
                      borderBottom: "1.5px solid #e2e8f0",
                    }}
                  >
                    Giá trị
                  </th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        i < topItems.length - 1 ? "1px solid #f1f5f9" : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#1e293b",
                        fontWeight: 500,
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        color: "#1e293b",
                        fontWeight: 700,
                      }}
                    >
                      {item.qty}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        color: "#0f172a",
                        fontWeight: 700,
                      }}
                    >
                      {currency === "VND"
                        ? item.value.toLocaleString("vi-VN")
                        : (item.value / 25000).toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
