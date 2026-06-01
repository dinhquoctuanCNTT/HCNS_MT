import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid, Plus, ChevronRight, ChevronDown, ChevronLeft,
  Home, Search, Bell, Settings, HelpCircle, Download,
  GraduationCap, Users, FolderOpen, BookOpen, Activity,
  BarChart2, Link2, Play,
} from "lucide-react";
import "./DaoTaoLayout.css";

interface DaoTaoLayoutProps {
  children: React.ReactNode;
}

const MENU_GROUPS = [
  {
    key: "so-do-to-chuc",
    label: "1. Sơ đồ tổ chức",
    icon: LayoutGrid,
    items: [
      { to: "/admin/dao-tao/so-do-to-chuc/he-sinh-thai",   label: "1.1. Hệ sinh thái MTH" },
      { to: "/admin/dao-tao/so-do-to-chuc/danh-muc-cty",   label: "1.2. Danh mục công ty, chi nhánh" },
      { to: "/admin/dao-tao/so-do-to-chuc/ho-so-nang-luc", label: "1.3. Hồ sơ năng lực các công ty" },
      { to: "/admin/dao-tao/so-do-to-chuc/chuc-nang-pb",   label: "1.4. Chức năng nhiệm vụ phòng ban" },
    ],
  },
  {
    key: "nhan-su-360",
    label: "2. Nhân sự 360",
    icon: Users,
    items: [
      { to: "/admin/dao-tao/nhan-su-360/danh-sach",      label: "2.1. Danh sách nhân sự" },
      { to: "/admin/dao-tao/nhan-su-360/bmtcv-kpi",      label: "2.2. BMTCV + KPI" },
      { to: "/admin/dao-tao/nhan-su-360/khung-nang-luc", label: "2.3. Khung năng lực" },
      { to: "/admin/dao-tao/nhan-su-360/lo-trinh",       label: "2.4. Lộ trình phát triển" },
    ],
  },
  {
    key: "quy-trinh",
    label: "3. Quy trình, biểu mẫu",
    icon: FolderOpen,
    items: [
      { to: "/admin/dao-tao/quy-trinh/quy-trinh-chung",    label: "1. Quy trình chung PĐT" },
      { to: "/admin/dao-tao/quy-trinh/bien-ban-hop",        label: "Biên bản họp hàng tháng" },
      { to: "/admin/dao-tao/quy-trinh/ke-hoach-tuan-thang", label: "2. Kế hoạch tuần/tháng PĐT" },
      { to: "/admin/dao-tao/quy-trinh/bao-cao-ngay",        label: "3. Báo cáo ngày/tuần/tháng" },
      { to: "/admin/dao-tao/quy-trinh/bao-cao-hoat-dong",   label: "4. Báo cáo tháng hoạt động ĐT" },
      { to: "/admin/dao-tao/quy-trinh/giay-to-hc",          label: "5. Giấy tờ hành chính" },
    ],
  },
  {
    key: "tai-lieu",
    label: "4. Quản lý tài liệu",
    icon: BookOpen,
    items: [
      { to: "/admin/dao-tao/tai-lieu/mth",        label: "1. MTH" },
      { to: "/admin/dao-tao/tai-lieu/mtpaints",   label: "2. MTPaints" },
      { to: "/admin/dao-tao/tai-lieu/mhm",        label: "3. MHM" },
      { to: "/admin/dao-tao/tai-lieu/mtparts",    label: "4. MTparts" },
      { to: "/admin/dao-tao/tai-lieu/mtshop",     label: "5. MTShop" },
      { to: "/admin/dao-tao/tai-lieu/mtpsi",      label: "6. MTPSI" },
      { to: "/admin/dao-tao/tai-lieu/mteducation",label: "7. MTEducation" },
      { to: "/admin/dao-tao/tai-lieu/mtsoft",     label: "8. MTSoft" },
    ],
  },
  {
    key: "hoat-dong",
    label: "5. Hoạt động đào tạo",
    icon: Activity,
    items: [
      { to: "/admin/dao-tao/hoat-dong/chuong-trinh",     label: "1. Chương trình đào tạo" },
      { to: "/admin/dao-tao/hoat-dong/nhu-cau",          label: "Nhu cầu đào tạo toàn hệ thống" },
      { to: "/admin/dao-tao/hoat-dong/ke-hoach",         label: "Kế hoạch, lịch đào tạo" },
      { to: "/admin/dao-tao/hoat-dong/hoi-nhap",         label: "2. Đào tạo hội nhập" },
      { to: "/admin/dao-tao/hoat-dong/chuyen-mon",       label: "3. Đào tạo chuyên môn" },
      { to: "/admin/dao-tao/hoat-dong/nang-cao",         label: "4. Đào tạo nâng cao" },
      { to: "/admin/dao-tao/hoat-dong/thue-ngoai",       label: "5. Đào tạo thuê ngoài" },
      { to: "/admin/dao-tao/hoat-dong/san-pham-moi",     label: "6. Đào tạo sản phẩm mới" },
      { to: "/admin/dao-tao/hoat-dong/nhac-lai",         label: "7. Đào tạo nhắc lại" },
      { to: "/admin/dao-tao/hoat-dong/bao-cao-tong-hop", label: "8. Báo cáo tổng hợp" },
    ],
  },
  {
    key: "danh-gia",
    label: "6. Đánh giá / kết quả",
    icon: BarChart2,
    items: [
      { to: "/admin/dao-tao/danh-gia/ket-qua-toan-he-thong", label: "1. Kết quả đào tạo toàn hệ thống" },
      { to: "/admin/dao-tao/danh-gia/khao-sat",               label: "2. Khảo sát sau đào tạo" },
      { to: "/admin/dao-tao/danh-gia/tong-hop-phan-tich",     label: "3. Tổng hợp, phân tích kết quả" },
    ],
  },
  {
    key: "lien-ket",
    label: "7. MTH - Đào tạo liên kết",
    icon: Link2,
    items: [
      { to: "/admin/dao-tao/lien-ket/oem",               label: "1. OEM" },
      { to: "/admin/dao-tao/lien-ket/truong",            label: "2. Trường" },
      { to: "/admin/dao-tao/lien-ket/hoi-thi-tay-nghe", label: "3. Hội thi tay nghề" },
    ],
  },
];

export default function DaoTaoLayout({ children }: DaoTaoLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "so-do-to-chuc": true,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (group: typeof MENU_GROUPS[0]) =>
    group.items.some((item) => location.pathname === item.to);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        background: "#f4f6f9",
      }}
    >
      {/* ── TOP NAV BAR ── */}
      <header
        style={{
          height: "64px",
          background: "#ffffff",
          borderBottom: "1px solid #cbd5e1",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", overflow: "hidden" }}>
          <Link to="/admin" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", textDecoration: "none" }} title="Quay về Dashboard">
            <Home size={22} color="#22c55e" />
          </Link>

          {/* Logo + label */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "10px", flexShrink: 0 }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg,#22c55e,#15803d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            }}>
              <GraduationCap size={16} color="#fff" />
            </div>
            <span style={{ fontSize: "16.5px", fontWeight: 900, color: "#1e293b", letterSpacing: "0.3px" }}>
              ĐÀO TẠO
            </span>
          </div>

          {/* Company pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", border: "1.5px solid #cbd5e1", borderRadius: "18px",
            fontSize: "13px", fontWeight: 700, color: "#334155", background: "#ffffff",
            flexShrink: 0, height: "32px",
          }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }} />
            <span>MT Holdings</span>
          </div>

          {/* Search bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", border: "1.5px solid #c084fc", borderRadius: "18px",
            fontSize: "13px", color: "#6b7280", background: "#ffffff",
            width: "180px", height: "32px",
            boxShadow: "0 0 6px rgba(192,132,252,0.2)", flexShrink: 0,
            position: "relative", boxSizing: "border-box",
          }}>
            <Search size={14} color="#a855f7" />
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>Tìm kiếm thông tin</span>
            <div style={{
              background: "rgba(168,85,247,0.1)", color: "#a855f7",
              fontSize: "9px", fontWeight: 900, padding: "1px 5px", borderRadius: "4px",
              position: "absolute", right: "10px", top: "6px",
            }}>AI</div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "4px 16px", border: "1.5px solid #cbd5e1", borderRadius: "18px",
            background: "#ffffff", fontSize: "13px", fontWeight: 800, color: "#334155",
            cursor: "pointer", height: "32px",
          }}>
            <div style={{
              width: "16px", height: "16px", borderRadius: "50%", background: "#22c55e",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Play size={10} fill="white" color="white" style={{ marginLeft: "1px" }} />
            </div>
            <span>Hướng dẫn</span>
          </button>

          <button className="dt-topbar-icon-btn" title="Tải xuống"><Download size={20} /></button>
          <button className="dt-topbar-icon-btn" title="Thông báo">
            <Bell size={20} />
            <div className="dt-topbar-badge">3</div>
          </button>
          <button className="dt-topbar-icon-btn" title="Cài đặt"><Settings size={20} /></button>
          <button className="dt-topbar-icon-btn" title="Trợ giúp"><HelpCircle size={20} /></button>

          <div style={{ width: "1px", height: "24px", background: "#cbd5e1", margin: "0 6px" }} />

          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "linear-gradient(135deg,#22c55e,#15803d)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 800, cursor: "pointer",
          }}>DT</div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", width: "100%" }}>

        {/* ── LEFT SIDEBAR ── */}
        <aside style={{
          width: sidebarOpen ? "260px" : "70px",
          background: "#071618",
          display: "flex", flexDirection: "column",
          transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden", flexShrink: 0, zIndex: 5,
        }}>
          {/* Menu groups */}
          <div style={{ flex: 1, overflowY: "auto" }} className="dt-hide-scrollbar">
            {sidebarOpen && (
              <div className="dt-sidebar-header">
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>PHÂN MỤC</span>
                  <ChevronDown size={12} color="#627b8f" />
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingBottom: "20px" }}>
              {MENU_GROUPS.map((group) => {
                const Icon = group.icon;
                const groupActive = isGroupActive(group);
                const isOpen = openGroups[group.key];

                return (
                  <div key={group.key}>
                    <button
                      className={`dt-group-btn${groupActive ? " active" : ""}`}
                      onClick={() => toggleGroup(group.key)}
                      title={!sidebarOpen ? group.label : undefined}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Icon size={16} style={{ flexShrink: 0 }} />
                        {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{group.label}</span>}
                      </span>
                      {sidebarOpen && (
                        <span style={{ fontSize: "10px", flexShrink: 0 }}>
                          {isOpen ? "▼" : "▶"}
                        </span>
                      )}
                    </button>

                    {sidebarOpen && isOpen && (
                      <div className="dt-group-items">
                        {group.items.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={`dt-sidebar-item${isActive(item.to) ? " active" : ""}`}
                            style={{ paddingLeft: "32px", fontSize: "12.5px" }}
                          >
                            <ChevronRight size={12} style={{ flexShrink: 0, opacity: 0.5 }} />
                            <span style={{ flex: 1 }}>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


          {/* Collapse toggle */}
          <div
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              height: "44px", background: "#182a2c",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", padding: "0 16px",
              color: "#627b8f", cursor: "pointer", fontSize: "13.5px",
              fontWeight: 500, gap: "12px", transition: "all 0.2s", flexShrink: 0,
            }}
          >
            {sidebarOpen ? (
              <><ChevronLeft size={16} color="#a3b8cc" /><span style={{ color: "#a3b8cc" }}>Thu gọn</span></>
            ) : (
              <ChevronRight size={16} color="#a3b8cc" style={{ margin: "0 auto" }} />
            )}
          </div>
        </aside>

        {/* ── CONTENT AREA ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f4f6f9" }}>
          {/* Secondary tab bar */}
          <div style={{
            height: "42px", background: "#dcfce7",
            borderBottom: "1.5px solid #22c55e",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 20px", flexShrink: 0,
          }}>
            <div style={{ display: "flex", height: "100%", alignItems: "center" }}>
              {["Tổng quan", "Kế hoạch", "Báo cáo", "Tài liệu"].map((tab) => (
                <div key={tab} className="dt-sub-tab-item">{tab}</div>
              ))}
            </div>
          </div>

          {/* Scrollable page area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
                Hệ Thống Quản Trị Đào Tạo
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#64748b" }}>
                Phân hệ quản lý hoạt động đào tạo, phát triển năng lực và quản lý tài liệu nội bộ
              </p>
            </div>
            <div style={{ flex: 1, animation: "fadeIn 0.25s ease-out" }}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
