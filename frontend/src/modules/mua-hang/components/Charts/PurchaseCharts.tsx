import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  Legend,
} from "recharts";

// Sample data for line chart – weekly purchase values
const lineData = [
  { week: "Tuần 1", value: 12000 },
  { week: "Tuần 2", value: 15000 },
  { week: "Tuần 3", value: 18000 },
  { week: "Tuần 4", value: 13000 },
  { week: "Tuần 5", value: 17000 },
  { week: "Tuần 6", value: 20000 },
];

// Sample data for bar chart – top suppliers
const barData = [
  { name: "Nhà cung cấp A", value: 35000 },
  { name: "Nhà cung cấp B", value: 27000 },
  { name: "Nhà cung cấp C", value: 22000 },
];

/**
 * PurchaseLineChart – displays purchase value over weeks.
 * Uses a smooth monotone line, cyan color, and circular markers.
 */
export const PurchaseLineChart: React.FC = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      {/* Hide unnecessary grid lines */}
      <CartesianGrid vertical={false} horizontal={false} />
      <XAxis dataKey="week" tick={{ fill: "#555" }} />
      <YAxis tick={{ fill: "#555" }} />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#00d0e6"
        strokeWidth={2}
        dot={{ stroke: "#00d0e6", strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

/**
 * TopSuppliersBarChart – horizontal bar chart showing top suppliers.
 * Bars are dark blue with rounded end caps.
 */
export const TopSuppliersBarChart: React.FC = () => (
  <ResponsiveContainer width="100%" height={250}>
    <ReBarChart
      layout="vertical"
      data={barData}
      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
    >
      {/* Hide grid lines for a clean look */}
      <CartesianGrid vertical={false} horizontal={false} />
      <XAxis type="number" tick={{ fill: "#555" }} />
      <YAxis dataKey="name" type="category" tick={{ fill: "#555" }} />
      <Tooltip />
      <Bar
        dataKey="value"
        fill="#3b82f6"
        radius={[4, 4, 4, 4]}
        barSize={20}
      />
    </ReBarChart>
  </ResponsiveContainer>
);

/**
 * Export both charts as a grouped object for convenient import.
 */
export const PurchaseCharts = {
  PurchaseLineChart,
  TopSuppliersBarChart,
};

export default PurchaseCharts;
