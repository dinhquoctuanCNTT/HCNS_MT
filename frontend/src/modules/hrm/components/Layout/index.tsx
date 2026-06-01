import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Home,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Download,
  Play,
  Users,
  GitBranch,
} from "lucide-react";
import { usePendingCount } from "@context/PendingCountContext";
import "./HRMLayout.css";

interface HRMLayoutProps {
  children: React.ReactNode;
}

const MENU_ITEMS = [
  {
    key: "tai-khoan",
    label: "1. Thông tin tài khoản",
    to: "/admin/nhan-su/tai-khoan",
    sub: [],
  },
  {
    key: "hoa-nhap",
    label: "2. Thông tin hòa nhập",
    sub: [
      { to: "/admin/nhan-su/hoa-nhap/he-sinh-thai", label: "- Hệ sinh thái" },
      { to: "/admin/nhan-su/hoa-nhap/so-do", label: "- Sơ đồ tổ chức" },
    ],
  },
  {
    key: "driver",
    label: "3. Dữ liệu Driver",
    to: "/admin/nhan-su/driver/cau-truc",
    sub: [],
  },
  {
    key: "phuc-loi",
    label: "4. Phúc lợi",
    sub: [
      { to: "/admin/nhan-su/phuc-loi/8-3", label: "- Ngày 8/3" },
      { to: "/admin/nhan-su/phuc-loi/20-10", label: "- Ngày 20/10" },
      { to: "/admin/nhan-su/phuc-loi/tet", label: "- Tết Nguyên Đán" },
    ],
  },
  {
    key: "bmtcv",
    label: "5. Bảng mô tả CV & kỹ năng",
    to: "/admin/nhan-su/bmtcv/danh-sach",
    sub: [],
  },
  {
    key: "luong-3p",
    label: "6. Cấu trúc lương 3P",
    sub: [
      { to: "/admin/nhan-su/luong-3p/p1", label: "- P1" },
      { to: "/admin/nhan-su/luong-3p/p2", label: "- P2" },
      { to: "/admin/nhan-su/luong-3p/p3", label: "- P3" },
    ],
  },
  {
    key: "lo-trinh",
    label: "7. Lộ trình phát triển",
    to: "/admin/nhan-su/lo-trinh/thu-viec",
    sub: [],
  },
  {
    key: "ban-tin",
    label: "8. Bản tin nội bộ",
    to: "/admin/nhan-su/ban-tin/ngoai-cty",
    sub: [],
  },
  {
    key: "lich",
    label: "9. Lịch",
    sub: [
      { to: "/admin/nhan-su/lich/nam", label: "- Năm" },
      { to: "/admin/nhan-su/lich/thang", label: "- Tháng" },
      { to: "/admin/nhan-su/ngay-le", label: "- Ngày lễ" },
    ],
  },
  {
    key: "cong-viec",
    label: "10. Công việc",
    sub: [
      {
        to: "/admin/nhan-su/cong-viec/muc-tieu-nam",
        label: "- 10.1 Mục tiêu năm",
      },
      {
        to: "/admin/nhan-su/cong-viec/muc-tieu-quy",
        label: "- 10.2 Mục tiêu quý",
      },
      {
        to: "/admin/nhan-su/cong-viec/muc-tieu-thang",
        label: "- 10.3 Mục tiêu tháng",
      },
      {
        to: "/admin/nhan-su/cong-viec/muc-tieu-tuan",
        label: "- 10.4 Mục tiêu tuần",
      },
    ],
  },
  {
    key: "bao-cao",
    label: "11. Hệ thống báo cáo",
    sub: [
      { to: "/admin/nhan-su/bao-cao/ngay", label: "- 11.1 Báo cáo ngày" },
      { to: "/admin/nhan-su/bao-cao/tuan", label: "- 11.2 Báo cáo tuần" },
      { to: "/admin/nhan-su/bao-cao/thang", label: "- 11.3 Báo cáo tháng" },
      {
        to: "/admin/nhan-su/bao-cao/hop-giao-ban",
        label: "- 11.4 Báo cáo họp giao ban",
      },
    ],
  },
  {
    key: "luong-thuong",
    label: "12. Lương thưởng",
    to: "/admin/nhan-su/luong-thuong",
    sub: [],
  },
  {
    key: "don-tu",
    label: "13. Đơn từ",
    sub: [
      { to: "/admin/nhan-su/nghi-phep", label: "- 13.1 Nghỉ phép" },
      { to: "/admin/nhan-su/lam-them-gio", label: "- 13.2 Làm thêm giờ" },
      { to: "/admin/nhan-su/cai-tien", label: "- 13.3 Cải tiến" },
      {
        to: "/admin/nhan-su/dao-tao-nang-cao",
        label: "- 13.4 Đào tạo nâng cao",
      },
    ],
  },
  {
    key: "cham-cong",
    label: "14. Chấm công",
    sub: [
      { to: "/admin/nhan-su/cham-cong", label: "- Bảng chấm công" },
      { to: "/admin/nhan-su/lich-su", label: "- Lịch sử chấm công" },
      { to: "/admin/nhan-su/ca-lam-viec", label: "- Ca làm việc" },
      { to: "/admin/nhan-su/nhan-vien", label: "- Nhân viên" },
    ],
  },
  {
    key: "dinh-tuyen",
    label: "15. Định tuyến",
    to: "/admin/nhan-su/dinh-tuyen",
    sub: [],
  },
];

const WORKFLOW_ITEMS = [
  { to: "/admin/workflow", label: "Board" },
  { to: "/admin/workflow?tab=history", label: "History" },
];

export default function HRMLayout({ children }: HRMLayoutProps) {
  const location = useLocation();
  const { pendingCount } = usePendingCount();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (item: (typeof MENU_ITEMS)[0]) =>
    item.sub.some((s) => location.pathname === s.to) ||
    (item.to ? location.pathname === item.to : false);

  const isWorkflowActive = location.pathname.includes("/admin/workflow");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#f4f6f9",
      }}
    >
      {/* ── TOP HEADER ── */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            overflow: "hidden",
          }}
        >
          <Link to="/admin" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", textDecoration: "none" }} title="Quay về Dashboard">
            <Home size={22} color="#3b82f6" />
          </Link>

          {/* Logo + label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginRight: "10px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              }}
            >
              <Users size={16} color="#fff" />
            </div>
            <span
              style={{
                fontSize: "16.5px",
                fontWeight: 900,
                color: "#1e293b",
                letterSpacing: "0.3px",
              }}
            >
              NHÂN SỰ
            </span>
          </div>

          {/* Company pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              border: "1.5px solid #cbd5e1",
              borderRadius: "18px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#334155",
              background: "#fff",
              flexShrink: 0,
              height: "32px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#3b82f6",
              }}
            />
            <span>MT Holdings</span>
          </div>

          {/* AI Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              border: "1.5px solid #c084fc",
              borderRadius: "18px",
              fontSize: "13px",
              color: "#6b7280",
              background: "#fff",
              width: "180px",
              height: "32px",
              boxShadow: "0 0 6px rgba(192,132,252,0.2)",
              flexShrink: 0,
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <Search size={14} color="#a855f7" />
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              Tìm kiếm thông tin
            </span>
            <div
              style={{
                background: "rgba(168,85,247,0.1)",
                color: "#a855f7",
                fontSize: "9px",
                fontWeight: 900,
                padding: "1px 5px",
                borderRadius: "4px",
                position: "absolute",
                right: "10px",
                top: "6px",
              }}
            >
              AI
            </div>
          </div>
        </div>

        {/* Right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 16px",
              border: "1.5px solid #cbd5e1",
              borderRadius: "18px",
              background: "#fff",
              fontSize: "13px",
              fontWeight: 800,
              color: "#334155",
              cursor: "pointer",
              height: "32px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Play
                size={10}
                fill="white"
                color="white"
                style={{ marginLeft: "1px" }}
              />
            </div>
            <span>Hướng dẫn</span>
          </button>

          <button className="hrm-topbar-icon-btn" title="Tải xuống">
            <Download size={20} />
          </button>
          <button className="hrm-topbar-icon-btn" title="Thông báo">
            <Bell size={20} />
            {pendingCount > 0 && (
              <div className="hrm-topbar-badge">
                {pendingCount > 99 ? "99+" : pendingCount}
              </div>
            )}
          </button>
          <button className="hrm-topbar-icon-btn" title="Cài đặt">
            <Settings size={20} />
          </button>
          <button className="hrm-topbar-icon-btn" title="Trợ giúp">
            <HelpCircle size={20} />
          </button>

          <div
            style={{
              width: "1px",
              height: "24px",
              background: "#cbd5e1",
              margin: "0 6px",
            }}
          />

          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            HR
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <div
        style={{ display: "flex", flex: 1, overflow: "hidden", width: "100%" }}
      >
        {/* ── LEFT SIDEBAR ── */}
        <aside
          style={{
            width: sidebarOpen ? "260px" : "70px",
            background: "#071618",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden",
            flexShrink: 0,
            zIndex: 5,
          }}
        >
          {/* Menu scroll */}
          <div
            style={{ flex: 1, overflowY: "auto" }}
            className="hrm-hide-scrollbar"
          >
            {/* Workflow section */}
            {sidebarOpen && (
              <div className="hrm-sidebar-header">
                <span>WORKFLOW</span>
              </div>
            )}
            <div style={{ paddingBottom: 8 }}>
              {WORKFLOW_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`hrm-sidebar-item${isWorkflowActive && location.pathname === item.to.split("?")[0] && (!item.to.includes("tab=history") || location.search.includes("tab=history")) ? " active" : ""}`}
                >
                  <GitBranch
                    size={15}
                    style={{ flexShrink: 0, opacity: 0.6 }}
                  />
                  {sidebarOpen && <span style={{ flex: 1 }}>{item.label}</span>}
                </Link>
              ))}
            </div>

            {/* HRM items */}
            {sidebarOpen && (
              <div className="hrm-sidebar-header" style={{ marginTop: 4 }}>
                <span>MENU</span>
                <ChevronDown size={12} color="#627b8f" />
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                paddingBottom: "20px",
              }}
            >
              {MENU_ITEMS.map((item) => {
                const groupActive = isGroupActive(item);
                const isOpen = openGroups[item.key];

                if (item.sub.length === 0 && item.to) {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.key}
                      to={item.to}
                      title={!sidebarOpen ? item.label : undefined}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        className={`hrm-group-btn${active ? " active" : ""}`}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {sidebarOpen ? item.label : item.label.slice(0, 4)}
                        </span>
                      </div>
                    </Link>
                  );
                }

                // Group with children
                return (
                  <div key={item.key}>
                    <button
                      className={`hrm-group-btn${groupActive ? " active" : ""}`}
                      onClick={() => toggleGroup(item.key)}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textAlign: "left",
                        }}
                      >
                        {sidebarOpen ? item.label : item.label.slice(0, 4)}
                      </span>
                      {sidebarOpen && (
                        <span style={{ fontSize: "10px", flexShrink: 0 }}>
                          {isOpen ? "▼" : "▶"}
                        </span>
                      )}
                    </button>
                    {sidebarOpen && isOpen && (
                      <div className="hrm-group-items">
                        {item.sub.map((s) => {
                          // Pending count badge cho Phê duyệt giải trình
                          const isPheduyet =
                            s.to === "/admin/nhan-su/phe-duyet";
                          return (
                            <Link
                              key={s.to}
                              to={s.to}
                              className={`hrm-sidebar-item${isActive(s.to) ? " active" : ""}`}
                              style={{
                                paddingLeft: "32px",
                                fontSize: "12.5px",
                              }}
                            >
                              <ChevronRight
                                size={12}
                                style={{ flexShrink: 0, opacity: 0.4 }}
                              />
                              <span style={{ flex: 1 }}>{s.label}</span>
                              {isPheduyet && pendingCount > 0 && (
                                <span
                                  style={{
                                    background: "#ef4444",
                                    color: "#fff",
                                    fontSize: 9,
                                    fontWeight: 800,
                                    minWidth: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0 4px",
                                  }}
                                >
                                  {pendingCount > 99 ? "99+" : pendingCount}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Home button — removed (moved to top) */}
          <div style={{ display: "none" }}>
            <Link to="/admin" onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3b82f6";
            }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(59,130,246,0.15)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Home size={20} color="#3b82f6" />
            </Link>
          </div>

          {/* Collapse toggle */}
          <div
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              height: "44px",
              background: "#182a2c",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              color: "#627b8f",
              cursor: "pointer",
              fontSize: "13.5px",
              fontWeight: 500,
              gap: "12px",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft size={16} color="#a3b8cc" />
                <span style={{ color: "#a3b8cc" }}>Thu gọn</span>
              </>
            ) : (
              <ChevronRight
                size={16}
                color="#a3b8cc"
                style={{ margin: "0 auto" }}
              />
            )}
          </div>
        </aside>

        {/* ── CONTENT AREA ── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#f4f6f9",
          }}
        >
          {/* Sub tab bar */}
          <div
            style={{
              height: "42px",
              background: "#dbeafe",
              borderBottom: "1.5px solid #3b82f6",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              flexShrink: 0,
            }}
          >
            {["Tổng quan", "Chấm công", "Đơn từ", "Báo cáo"].map((tab) => (
              <div key={tab} className="hrm-sub-tab-item">
                {tab}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
