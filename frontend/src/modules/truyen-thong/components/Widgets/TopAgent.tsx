import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function TopAgent() {
  const [activeTab, setActiveTab] = useState<"internal" | "external">(
    "internal",
  );

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>
          Top Agent hiệu quả
        </h3>
        <button
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            border: "none",
            background: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} color="#64748b" />
        </button>
      </div>

      {/* Toggle */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          background: "#f1f5f9",
          padding: "4px",
          borderRadius: "8px",
        }}
      >
        {[
          { key: "internal", label: "Nội bộ" },
          { key: "external", label: "Bên ngoài" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "internal" | "external")}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              background: activeTab === tab.key ? "#ffffff" : "transparent",
              color: activeTab === tab.key ? "#0284c7" : "#64748b",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Agent Item */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          🐆
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
            AVA Bán hàng (Beta)
          </div>
          <div style={{ fontSize: "13px", color: "#64748b" }}>
            5,602 Hoạt động bán hàng
          </div>
        </div>
      </div>
    </div>
  );
}
