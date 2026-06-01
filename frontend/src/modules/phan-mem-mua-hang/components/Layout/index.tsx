import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid, Plus, ChevronRight, ChevronDown, ChevronLeft,
  Home, Search, Bell, Settings, HelpCircle, Download, Play,
  Users, Package, ShoppingCart, CreditCard, DollarSign, TrendingDown, Building2,
} from "lucide-react";
import "./PhanMemMuaHangLayout.css";

interface PhanMemMuaHangLayoutProps {
  children: React.ReactNode;
}

const MENU_GROUPS = [
  {
    key: "ncc",
    label: "1. Thông tin NCC",
    icon: Building2,
    items: [
      { to: "/admin/phan-mem-mua-hang/ncc/thong-tin", label: "1.1. Thông tin nhà cung cấp" },
      { to: "/admin/phan-mem-mua-hang/ncc/danh-gia",  label: "1.2. Đánh giá NCC" },
    ],
  },
  {
    key: "nhan-su",
    label: "2. Nhân sự",
    icon: Users,
    items: [
      { to: "/admin/phan-mem-mua-hang/nhan-su/thong-tin",       label: "2.1. Thông tin nhân sự" },
      { to: "/admin/phan-mem-mua-hang/nhan-su/bmtcv-thuong",    label: "2.2. BMTCV + thưởng P3" },
      { to: "/admin/phan-mem-mua-hang/nhan-su/he-thong-bc",     label: "2.3. Hệ thống Báo cáo" },
      { to: "/admin/phan-mem-mua-hang/nhan-su/chien-luoc",      label: "2.4. Chiến lược, mục tiêu" },
      { to: "/admin/phan-mem-mua-hang/nhan-su/cl-muc-tieu-nam", label: "2.4.0. Chiến lược, mục tiêu năm" },
      { to: "/admin/phan-mem-mua-hang/nhan-su/ke-hoach-nam",    label: "2.4.1. Kế hoạch, hành động năm" },
      { to: "/admin/phan-mem-mua-hang/nhan-su/p3-nam",          label: "2.4.2. P3 năm" },
      { to: "/admin/phan-mem-mua-hang/nhan-su/dao-tao",         label: "2.5. Đào tạo" },
      { to: "/admin/phan-mem-mua-hang/nhan-su/s5",              label: "2.6. S5" },
    ],
  },
  {
    key: "san-pham",
    label: "3. Sản phẩm",
    icon: Package,
    items: [
      { to: "/admin/phan-mem-mua-hang/san-pham/ke-hoach-sp-moi", label: "3.1. Kế hoạch triển khai SP mới" },
      { to: "/admin/phan-mem-mua-hang/san-pham/bang-gia-von",    label: "3.2. Bảng giá vốn lợi nhuận" },
      { to: "/admin/phan-mem-mua-hang/san-pham/thong-tin-sp",    label: "3.3. Thông tin sản phẩm" },
      { to: "/admin/phan-mem-mua-hang/san-pham/top-ban-nhieu",   label: "3.4. Top SP bán nhiều đột biến" },
      { to: "/admin/phan-mem-mua-hang/san-pham/top-ban-cham",    label: "3.5. Top SP bán chậm" },
      { to: "/admin/phan-mem-mua-hang/san-pham/canh-bao-kho",   label: "3.6. Cảnh báo hàng tồn kho" },
    ],
  },
  {
    key: "dat-hang",
    label: "4. Đặt hàng",
    icon: ShoppingCart,
    items: [
      { to: "/admin/phan-mem-mua-hang/dat-hang/ke-hoach-nam",   label: "4.1. Kế hoạch đặt hàng theo năm" },
      { to: "/admin/phan-mem-mua-hang/dat-hang/ke-hoach-thang", label: "4.2. Kế hoạch đặt hàng theo tháng" },
      { to: "/admin/phan-mem-mua-hang/dat-hang/theo-doi-don",   label: "4.3. Theo dõi đơn đặt hàng" },
      { to: "/admin/phan-mem-mua-hang/dat-hang/giam-gia-ncc",   label: "4.4. Giảm giá mua từ NCC" },
      { to: "/admin/phan-mem-mua-hang/dat-hang/khieu-nai",      label: "4.5. Khiếu nại đơn hàng" },
    ],
  },
  {
    key: "thanh-toan",
    label: "5. Thanh toán",
    icon: CreditCard,
    items: [
      { to: "/admin/phan-mem-mua-hang/thanh-toan/ke-hoach-ncc", label: "5.1. Kế hoạch thanh toán NCC" },
      { to: "/admin/phan-mem-mua-hang/thanh-toan/cong-no",      label: "5.2. Đảm bảo thanh toán công nợ" },
    ],
  },
  {
    key: "chi-phi",
    label: "6. Chi phí mua hàng",
    icon: DollarSign,
    items: [
      { to: "/admin/phan-mem-mua-hang/chi-phi", label: "6. Chi phí mua hàng" },
    ],
  },
  {
    key: "ty-gia",
    label: "7. Tỷ giá ngoại tệ",
    icon: TrendingDown,
    items: [
      { to: "/admin/phan-mem-mua-hang/ty-gia", label: "7. Tỷ giá ngoại tệ biến thiên" },
    ],
  },
];

export default function PhanMemMuaHangLayout({ children }: PhanMemMuaHangLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "ncc": true,
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
            <Home size={22} color="#f59e0b" />
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "10px", flexShrink: 0 }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg,#f59e0b,#b45309)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            }}>
              <ShoppingCart size={16} color="#fff" />
            </div>
            <span style={{ fontSize: "16.5px", fontWeight: 900, color: "#1e293b", letterSpacing: "0.3px" }}>
              MUA HÀNG
            </span>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", border: "1.5px solid #cbd5e1", borderRadius: "18px",
            fontSize: "13px", fontWeight: 700, color: "#334155", background: "#ffffff",
            flexShrink: 0, height: "32px",
          }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f59e0b" }} />
            <span>MT Holdings</span>
          </div>

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
              width: "16px", height: "16px", borderRadius: "50%", background: "#f59e0b",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Play size={10} fill="white" color="white" style={{ marginLeft: "1px" }} />
            </div>
            <span>Hướng dẫn</span>
          </button>

          <button className="pmm-topbar-icon-btn" title="Tải xuống"><Download size={20} /></button>
          <button className="pmm-topbar-icon-btn" title="Thông báo">
            <Bell size={20} />
            <div className="pmm-topbar-badge">3</div>
          </button>
          <button className="pmm-topbar-icon-btn" title="Cài đặt"><Settings size={20} /></button>
          <button className="pmm-topbar-icon-btn" title="Trợ giúp"><HelpCircle size={20} /></button>

          <div style={{ width: "1px", height: "24px", background: "#cbd5e1", margin: "0 6px" }} />

          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "linear-gradient(135deg,#f59e0b,#b45309)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 800, cursor: "pointer",
          }}>MH</div>
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
          {/* Home removed - now in header */}
          <div style={{ display: "none" }}>
            <Link to="/admin"
          </div>

          <div style={{ flex: 1, overflowY: "auto" }} className="pmm-hide-scrollbar">
            {sidebarOpen && (
              <div className="pmm-sidebar-header">
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
                      className={`pmm-group-btn${groupActive ? " active" : ""}`}
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
                      <div className="pmm-group-items">
                        {group.items.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={`pmm-sidebar-item${isActive(item.to) ? " active" : ""}`}
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

          {/* Home removed - moved to top */}
          <div style={{ display: "none" }}>
            <Link to="/admin"
              style={{
                width: "38px", height: "38px", borderRadius: "50%",
                background: "rgba(245,158,11,0.15)", border: "2px solid #f59e0b",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s", outline: "none", textDecoration: "none",
              }}
              title="Quay lại Module Dashboard"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f59e0b";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(245,158,11,0.15)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Home size={20} color="#f59e0b" />
            </Link>
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
          <div style={{
            height: "42px", background: "#fef3c7",
            borderBottom: "1.5px solid #f59e0b",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 20px", flexShrink: 0,
          }}>
            <div style={{ display: "flex", height: "100%", alignItems: "center" }}>
              {["Tổng quan", "Đặt hàng", "Nhà cung cấp", "Báo cáo"].map((tab) => (
                <div key={tab} className="pmm-sub-tab-item">{tab}</div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
                Hệ Thống Phần Mềm Mua Hàng
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#64748b" }}>
                Quản lý nhà cung cấp, đặt hàng, thanh toán và kiểm soát chi phí mua hàng toàn hệ thống
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
