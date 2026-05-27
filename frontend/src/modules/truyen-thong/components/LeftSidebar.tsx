import React, { useState } from "react";
import {
  Home,
  Newspaper,
  Lightbulb,
  Vote,
  Users,
  Bookmark,
  UserPlus,
  Plus,
} from "lucide-react";

export default function LeftSidebar() {
  const [activeMenu, setActiveMenu] = useState("Bảng tin");

  const menuItems = [
    { icon: Home, label: "Bảng tin", active: true },
    { icon: Newspaper, label: "Tin tức", active: false },
    { icon: Lightbulb, label: "Sáng kiến", active: false },
    { icon: Vote, label: "Bình chọn", active: false },
    { icon: Users, label: "Nhóm", active: false },
    { icon: Bookmark, label: "Đã lưu", active: false },
    { icon: UserPlus, label: "Giới thiệu ứng viên", active: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* User Profile Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            ĐQT
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              ĐINH QUỐC TUẤN
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#64748b",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Trang cá nhân
            </div>
          </div>
        </div>
      </div>

      {/* Menu Navigation Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.label;
          return (
            <div
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
                background: isActive ? "#e0f2fe" : "transparent",
                marginBottom: "2px",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#f1f5f9";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <Icon
                size={20}
                color={isActive ? "#0284c7" : "#64748b"}
                style={{ flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#0284c7" : "#334155",
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* My Groups Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Nhóm của tôi
          </span>
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
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e2e8f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
            }}
          >
            <Plus size={16} color="#64748b" />
          </button>
        </div>
      </div>
    </div>
  );
}
