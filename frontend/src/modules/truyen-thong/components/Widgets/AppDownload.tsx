import React from "react";
import { Download, Smartphone } from "lucide-react";

export default function AppDownload() {
  const apps = [
    { name: "MISA AMIS", subtitle: "Quản lý DN toàn diện" },
    { name: "AMIS Phòng họp", subtitle: "Đặt phòng họp dễ dàng" },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h3
        style={{
          margin: "0 0 12px 0",
          fontSize: "15px",
          fontWeight: 700,
        }}
      >
        Tải ứng dụng mobile
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {apps.map((app) => (
          <div
            key={app.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Smartphone size={20} color="#ffffff" />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}
              >
                {app.name}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                {app.subtitle}
              </div>
            </div>
            <Download size={18} color="#64748b" />
          </div>
        ))}
      </div>
    </div>
  );
}
