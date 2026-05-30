import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Plus,
  ChevronRight,
  ChevronDown,
  Pencil,
  ShoppingCart,
  Warehouse,
  FolderSync,
  BarChart3,
  Shield,
  Users,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Briefcase,
  Play,
  Download,
  Megaphone,
  MessageCircle,
  UserPlus,
  Settings,
  Bell,
  HelpCircle,
  MoreHorizontal,
  Home,
  Search,
  Sparkles,
  Lightbulb,
  SlidersHorizontal,
  BookOpen,
} from "lucide-react";
import useThongKe from "../../hooks/useThongKe";
import { formatVND } from "../../utils/formatKeToan";

import "./KeToanLayout.css";

interface KeToanLayoutProps {
  children: React.ReactNode;
}

export default function KeToanLayout({ children }: KeToanLayoutProps) {
  const location = useLocation();
  const { stats, loading } = useThongKe();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState("Bán hàng");

  // Company groups state
  const [openCompany, setOpenCompany] = useState<Record<string, boolean>>({});
  const toggleCompany = (key: string) =>
    setOpenCompany((prev) => ({ ...prev, [key]: !prev[key] }));

  const COMPANIES = [
    {
      key: "mtshop", label: "MTSHOP",
      items: [
        { to: "/admin/ke-toan/mtshop/quy-trinh",          label: "1. Quy trình phòng kế toán" },
        { to: "/admin/ke-toan/mtshop/quy-tien-mat",       label: "2. Quỹ tiền mặt và ngân hàng" },
        { to: "/admin/ke-toan/mtshop/tong-hop-chi-phi",   label: "3. Tổng hợp các chi phí" },
        { to: "/admin/ke-toan/mtshop/cong-no-phai-thu",   label: "4. Công nợ phải thu" },
        { to: "/admin/ke-toan/mtshop/cong-no-phai-tra",   label: "5. Công nợ phải trả" },
        { to: "/admin/ke-toan/mtshop/kho-hang-hoa",       label: "6. Kho hàng hóa" },
        { to: "/admin/ke-toan/mtshop/bao-cao-tai-chinh",  label: "7. Báo cáo tài chính hàng tháng" },
        { to: "/admin/ke-toan/mtshop/bao-cao-vat",        label: "8. Báo cáo VAT(NBo)" },
      ],
    },
    {
      key: "mtpsi", label: "MTPSI",
      items: [
        { to: "/admin/ke-toan/mtpsi/quy-trinh",          label: "1. Quy trình phòng kế toán" },
        { to: "/admin/ke-toan/mtpsi/quy-tien-mat",       label: "2. Quỹ tiền mặt và ngân hàng" },
        { to: "/admin/ke-toan/mtpsi/tong-hop-chi-phi",   label: "3. Tổng hợp các chi phí" },
        { to: "/admin/ke-toan/mtpsi/cong-no-phai-thu",   label: "4. Công nợ phải thu" },
        { to: "/admin/ke-toan/mtpsi/cong-no-phai-tra",   label: "5. Công nợ phải trả" },
        { to: "/admin/ke-toan/mtpsi/kho-hang-hoa",       label: "6. Kho hàng hóa" },
        { to: "/admin/ke-toan/mtpsi/bao-cao-tai-chinh",  label: "7. Báo cáo tài chính hàng tháng" },
        { to: "/admin/ke-toan/mtpsi/bao-cao-vat",        label: "8. Báo cáo VAT(NBo)" },
        { to: "/admin/ke-toan/mtpsi/hop-dong-thi-cong",  label: "9. Các mẫu hợp đồng thi công" },
        { to: "/admin/ke-toan/mtpsi/theo-doi-cong-trinh",label: "10. Theo dõi các công trình" },
        { to: "/admin/ke-toan/mtpsi/thue",               label: "11. Thuế" },
      ],
    },
    {
      key: "mtparts", label: "MTPARTS",
      items: [
        { to: "/admin/ke-toan/mtparts/quy-trinh",         label: "1. Quy trình phòng kế toán" },
        { to: "/admin/ke-toan/mtparts/quy-tien-mat",      label: "2. Quỹ tiền mặt và ngân hàng" },
        { to: "/admin/ke-toan/mtparts/tong-hop-chi-phi",  label: "3. Tổng hợp các chi phí" },
        { to: "/admin/ke-toan/mtparts/cong-no-phai-thu",  label: "4. Công nợ phải thu" },
        { to: "/admin/ke-toan/mtparts/cong-no-phai-tra",  label: "5. Công nợ phải trả" },
        { to: "/admin/ke-toan/mtparts/kho-hang-hoa",      label: "6. Kho hàng hóa" },
        { to: "/admin/ke-toan/mtparts/bao-cao-tai-chinh", label: "7. Báo cáo tài chính hàng tháng" },
        { to: "/admin/ke-toan/mtparts/bao-cao-vat",       label: "8. Báo cáo VAT(NBo)" },
        { to: "/admin/ke-toan/mtparts/thue",              label: "9. Thuế" },
      ],
    },
    {
      key: "mth", label: "MTH Phòng kế toán",
      items: [
        { to: "/admin/ke-toan/mth/tu-tai-lieu",     label: "1. Tủ tài liệu phòng kế toán" },
        { to: "/admin/ke-toan/mth/dao-tao-kt",      label: "2. Đào tạo KT" },
        { to: "/admin/ke-toan/mth/cong-viec-ktv",   label: "3. Công việc của kế toán viên" },
        { to: "/admin/ke-toan/mth/tai-lieu-dao-tao",label: "4. Tài liệu đào tạo KTBH và Kho" },
        { to: "/admin/ke-toan/mth/hop-giao-ban",    label: "Họp giao ban" },
      ],
    },
    {
      key: "mt-paint", label: "MT Paint",
      items: [
        { to: "/admin/ke-toan/mt-paint/quy-trinh",          label: "1. Quy trình phòng kế toán MT" },
        { to: "/admin/ke-toan/mt-paint/quy-tien-mat",       label: "2. Quỹ tiền mặt và chuyển khoản" },
        { to: "/admin/ke-toan/mt-paint/tong-hop-chi-phi",   label: "3. Tổng hợp các chi phí" },
        { to: "/admin/ke-toan/mt-paint/cong-no-phai-thu",   label: "5. Công nợ phải thu" },
        { to: "/admin/ke-toan/mt-paint/kho-pha-le",         label: "6. Kho pha lẻ" },
        { to: "/admin/ke-toan/mt-paint/bao-cao-tai-chinh",  label: "7. Báo cáo tài chính hàng tháng" },
        { to: "/admin/ke-toan/mt-paint/kho-hang-hoa",       label: "8. Kho hàng hóa" },
        { to: "/admin/ke-toan/mt-paint/hoa-don-vat",        label: "9. Hóa đơn VAT" },
        { to: "/admin/ke-toan/mt-paint/cong-no-trong-nuoc", label: "10. Công nợ phải trả trong nước" },
        { to: "/admin/ke-toan/mt-paint/cong-no-nuoc-ngoai", label: "11. Công nợ phải trả nước ngoài" },
        { to: "/admin/ke-toan/mt-paint/ngan-sach",          label: "12. Ngân sách" },
        { to: "/admin/ke-toan/mt-paint/bao-cao-bi",         label: "13. Học làm báo cáo BI" },
        { to: "/admin/ke-toan/mt-paint/hang-hu-hong",       label: "14. Hồ sơ hàng hư hỏng hàng năm" },
        { to: "/admin/ke-toan/mt-paint/du-lieu-pm",         label: "15. Dữ liệu pm" },
        { to: "/admin/ke-toan/mt-paint/thue",               label: "16. Thuế MT Paint" },
        { to: "/admin/ke-toan/mt-paint/doi-chieu-136-336",  label: "17. Báo cáo đối chiếu 136 và 336" },
      ],
    },
    {
      key: "mhm", label: "MHM",
      items: [
        { to: "/admin/ke-toan/mhm/quy-trinh",           label: "1. Quy trình phòng kế toán" },
        { to: "/admin/ke-toan/mhm/quy-tien-mat",        label: "2. Quỹ tiền mặt và ngân hàng" },
        { to: "/admin/ke-toan/mhm/cong-no-phai-thu",    label: "3. Công nợ phải thu" },
        { to: "/admin/ke-toan/mhm/cong-no-phai-tra",    label: "4. Công nợ phải trả" },
        { to: "/admin/ke-toan/mhm/chi-phi-cong-cu",     label: "5. Chi phí đầu tư thiết bị công cụ" },
        { to: "/admin/ke-toan/mhm/chi-phi-kinh-doanh",  label: "6. Chi phí kinh doanh" },
        { to: "/admin/ke-toan/mhm/chi-phi-san-xuat",    label: "7. Chi phí sản xuất" },
        { to: "/admin/ke-toan/mhm/chi-phi-van-hanh",    label: "8. Chi phí vận hành" },
        { to: "/admin/ke-toan/mhm/kho",                 label: "9. Kho" },
        { to: "/admin/ke-toan/mhm/bao-cao-thue",        label: "10. Báo cáo thuế" },
        { to: "/admin/ke-toan/mhm/hoa-don",             label: "11. Hóa đơn đầu vào và đầu ra" },
        { to: "/admin/ke-toan/mhm/bao-cao-tai-chinh",   label: "12. Báo cáo tài chính hàng tháng" },
        { to: "/admin/ke-toan/mhm/ke-hoach-ban-hang",   label: "13. Kế hoạch bán hàng" },
        { to: "/admin/ke-toan/mhm/theo-doi-boc-tach",   label: "14. Theo dõi khác - bóc tách chi phí" },
        { to: "/admin/ke-toan/mhm/tinh-gia-von",        label: "15. Tính giá vốn MHM" },
        { to: "/admin/ke-toan/mhm/thue",                label: "16. Thuế" },
      ],
    },
    {
      key: "bao-cao", label: "Báo cáo tổng hợp",
      items: [
        { to: "/admin/ke-toan/bc-hop-nhat",  label: "BC hợp nhất MT Holdings" },
        { to: "/admin/ke-toan/bao-cao-360",  label: "Báo cáo 360" },
      ],
    },
  ];

  // Define sidebar menu items matching MISA style
  const sidebarItems = [
    {
      path: "/admin/ke-toan/ban-hang",
      label: "Bán hàng",
      icon: ShoppingCart,
    },
    {
      path: "/admin/ke-toan/kho",
      label: "Kho",
      icon: Warehouse,
    },
    {
      path: "/admin/ke-toan/tong-hop",
      label: "Tổng hợp",
      icon: FolderSync,
    },
    {
      path: "/admin/ke-toan/dashboard",
      label: "Báo cáo",
      icon: BarChart3,
    },
    {
      path: "/admin/ke-toan/bao-hiem",
      label: "Kết nối bảo hiểm",
      icon: Shield,
      badge: "Mới",
    },
    {
      path: "/admin/ke-toan/cong-dong",
      label: "Cộng đồng ",
      icon: Users,
    },
  ];

  const subTabs = [
    "Báo giá",
    "Đơn đặt hàng",
    "Bán hàng",
    "Trả lại hàng bán",
    "Báo cáo",
    "Công nợ",
    "Khách hàng",
    "Hàng hóa, dịch vụ",
  ];

  const isActiveRoute = (path: string) => {
    if (
      path === "/admin/ke-toan/dashboard" &&
      location.pathname === "/admin/ke-toan"
    ) {
      return true;
    }
    return location.pathname === path;
  };

  const doanhThuTangTruong =
    stats.doanhThuThangTruoc > 0
      ? ((stats.doanhThuBanHang - stats.doanhThuThangTruoc) /
          stats.doanhThuThangTruoc) *
        100
      : 0;

  const kpis = [
    {
      title: "Tổng Doanh Thu Bán Hàng",
      value: formatVND(stats.doanhThuBanHang),
      sub: `${doanhThuTangTruong >= 0 ? "+" : ""}${doanhThuTangTruong.toFixed(1)}% so với tháng trước`,
      isUp: doanhThuTangTruong >= 0,
      icon: TrendingUp,
      color: "#10b981",
      bgLight: "rgba(16, 185, 129, 0.08)",
    },
    {
      title: "Chi Phí Mua Hàng",
      value: formatVND(stats.chiPhiMuaHang),
      sub: "Đã bao gồm VAT khấu trừ",
      isUp: false,
      icon: TrendingDown,
      color: "#ef4444",
      bgLight: "rgba(239, 68, 68, 0.08)",
    },
    {
      title: "Số Dư Tiền & Ngân Hàng",
      value: formatVND(stats.quyTienMat + stats.quyNganHang),
      sub: `Mặt: ${formatVND(stats.quyTienMat)} | NH: ${formatVND(stats.quyNganHang)}`,
      isUp: true,
      icon: CreditCard,
      color: "#3b82f6",
      bgLight: "rgba(59, 130, 246, 0.08)",
    },
    {
      title: "Công Nợ Tổng Hợp",
      value: formatVND(stats.congNoPhaiThu),
      sub: `Phải thu: ${formatVND(stats.congNoPhaiThu)} | Trả: ${formatVND(stats.congNoPhaiTra)}`,
      isUp: false,
      icon: Briefcase,
      color: "#f59e0b",
      bgLight: "rgba(245, 158, 11, 0.08)",
    },
  ];

  const showKpiCards =
    location.pathname === "/admin/ke-toan/dashboard" ||
    location.pathname === "/admin/ke-toan";

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
      {/* ĐÃ XÓA THẺ <style> Ở ĐÂY ĐỂ CODE GỌN GÀNG HƠN */}

      {/* ── ENHANCED LARGER MISA TOP NAV BAR (Height: 64px) ── */}
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
        {/* Left Side: Branding & Selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            overflow: "hidden",
          }}
        >
          {/* Nine-dots menu button */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "6px",
              borderRadius: "6px",
            }}
          >
            <LayoutGrid size={22} color="#55697d" />
          </button>

          {/* MISA Conic Logo */}
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
                background:
                  "conic-gradient(#3b82f6 0deg 90deg, #f97316 90deg 180deg, #ef4444 180deg 270deg, #eab308 270deg 360deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#ffffff",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "16.5px",
                fontWeight: 900,
                color: "#1e293b",
                letterSpacing: "0.3px",
              }}
            >
              KẾ TOÁN
            </span>
          </div>

          {/* Company Dropdown Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: "6px",
              transition: "background 0.2s",
              fontSize: "14.5px",
              fontWeight: 800,
              color: "#1e293b",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "340px",
            }}
            className="misa-top-dropdown"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span>CÔNG TY CỔ PHẦN SƠN MT (5..Công ty MT paint - ...</span>
            <ChevronDown size={16} color="#64748b" style={{ flexShrink: 0 }} />
          </div>

          {/* Database Pill */}
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
              background: "#ffffff",
              flexShrink: 0,
              height: "32px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#10b981",
              }}
            />
            <span>KETOAN_MTPaint 011025</span>
          </div>

          {/* AI Search Bar */}
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
              background: "#ffffff",
              width: "180px",
              height: "32px",
              boxShadow: "0 0 6px rgba(192, 132, 252, 0.2)",
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
                background: "rgba(168, 85, 247, 0.1)",
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

        {/* Right Side: Utility Icons & User Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          {/* Guide Play Button */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 16px",
              border: "1.5px solid #cbd5e1",
              borderRadius: "18px",
              background: "#ffffff",
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
                background: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
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

          {/* Download Icon */}
          <button className="misa-topbar-icon-btn" title="Tải xuống">
            <Download size={20} />
          </button>

          {/* Megaphone (Orange) */}
          <button className="misa-topbar-icon-btn" title="Thông báo hệ thống">
            <Megaphone size={20} color="#f97316" />
          </button>

          {/* Chat (Blue) */}
          <button className="misa-topbar-icon-btn" title="Hỗ trợ/Trò chuyện">
            <MessageCircle size={20} color="#3b82f6" />
          </button>

          {/* User Add */}
          <button className="misa-topbar-icon-btn" title="Mời người dùng">
            <UserPlus size={20} />
          </button>

          {/* Settings */}
          <button className="misa-topbar-icon-btn" title="Cài đặt">
            <Settings size={20} />
          </button>

          {/* Notification Bell with red badge 7 */}
          <button className="misa-topbar-icon-btn" title="Thông báo">
            <Bell size={20} />
            <div className="misa-topbar-badge">7</div>
          </button>

          {/* Help */}
          <button className="misa-topbar-icon-btn" title="Trợ giúp">
            <HelpCircle size={20} />
          </button>

          {/* More options */}
          <button className="misa-topbar-icon-btn" title="Tiện ích khác">
            <MoreHorizontal size={20} />
          </button>

          {/* Shopping cart with red badge 2 */}
          <button className="misa-topbar-icon-btn" title="Giỏ hàng">
            <ShoppingCart size={20} color="#3b82f6" />
            <div className="misa-topbar-badge">2</div>
          </button>

          {/* Learning Book with red badge New */}
          <button className="misa-topbar-icon-btn" title="Đào tạo / Tài liệu">
            <BookOpen size={20} color="#f59e0b" />
            <div
              className="misa-topbar-badge"
              style={{
                background: "#ef4444",
                fontSize: "7px",
                padding: "0 2px",
              }}
            >
              New
            </div>
          </button>

          {/* Vertical Divider */}
          <div
            style={{
              width: "1px",
              height: "24px",
              background: "#cbd5e1",
              margin: "0 6px",
            }}
          />

          {/* User Profile VM Pink Badge (Larger: 32px) */}
          <div style={{ position: "relative", cursor: "pointer" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#ec4899",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 800,
                border: "2px solid #3b82f6",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}
            >
              VM
            </div>
            <div
              className="misa-topbar-badge"
              style={{ top: "-4px", right: "-4px" }}
            >
              2
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTAINER ── */}
      <div
        style={{ display: "flex", flex: 1, overflow: "hidden", width: "100%" }}
      >
        {/* ── LEFT SIDEBAR (Expanded to 275px) ── */}
        <aside
          style={{
            width: sidebarOpen ? "275px" : "70px",
            background: "#071618",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
            flexShrink: 0,
            zIndex: 5,
          }}
        >
          {/* oval Button "+ Thêm nhanh" */}
          <div style={{ padding: "10px 0", flexShrink: 0 }}>
            {sidebarOpen ? (
              <button className="misa-btn-them-nhanh">
                <Plus size={16} />
                <span>Thêm nhanh</span>
              </button>
            ) : (
              <button
                className="misa-btn-them-nhanh"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  margin: "0 auto",
                  padding: 0,
                }}
                title="Thêm nhanh"
              >
                <Plus size={18} />
              </button>
            )}
          </div>

          {/* Sidebar Menu items scroll container */}
          <div
            style={{ flex: 1, overflowY: "auto" }}
            className="hide-scrollbar"
          >
            {/* HAY DÙNG section */}
            {sidebarOpen ? (
              <div className="misa-sidebar-header">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span>HAY DÙNG</span>
                  <ChevronRight size={12} color="#627b8f" />
                </div>
                <Pencil size={13} style={{ cursor: "pointer" }} />
              </div>
            ) : (
              <div
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.06)",
                  margin: "12px 10px",
                }}
              />
            )}

            {/* PHÂN HỆ section */}
            {sidebarOpen ? (
              <div className="misa-sidebar-header">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span>PHÂN HỆ</span>
                  <ChevronDown size={12} color="#627b8f" />
                </div>
                <Pencil size={13} style={{ cursor: "pointer" }} />
              </div>
            ) : null}

            {/* Render Items */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                paddingBottom: "20px",
              }}
            >
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActiveRoute(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`misa-sidebar-item ${active ? "active" : ""}`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon
                      size={18}
                      style={{
                        flexShrink: 0,
                        color: active ? "#00b4c5" : "inherit",
                      }}
                    />
                    {sidebarOpen && (
                      <span style={{ flex: 1, whiteSpace: "nowrap" }}>
                        {item.label}
                      </span>
                    )}
                    {sidebarOpen && item.badge && (
                      <span
                        style={{
                          background: "#f97316",
                          color: "#ffffff",
                          fontSize: "9.5px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          lineHeight: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── CÔNG TY section ── */}
            {sidebarOpen && (
              <div className="misa-sidebar-header" style={{ marginTop: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>CÔNG TY</span>
                  <ChevronDown size={12} color="#627b8f" />
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingBottom: "20px" }}>
              {COMPANIES.map((company) => {
                const isAnyActive = company.items.some(
                  (item) => location.pathname === item.to
                );
                const isOpen = openCompany[company.key];
                return (
                  <div key={company.key}>
                    <button
                      onClick={() => toggleCompany(company.key)}
                      title={!sidebarOpen ? company.label : undefined}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "calc(100% - 16px)",
                        margin: "1px 8px",
                        padding: "7px 10px",
                        background: isAnyActive ? "rgba(0,180,197,0.12)" : "none",
                        border: "none",
                        borderRadius: "8px",
                        color: isAnyActive ? "#00b4c5" : "#a3b8cc",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                        transition: "background 0.15s",
                      }}
                    >
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {sidebarOpen ? company.label : company.label.slice(0, 2)}
                      </span>
                      {sidebarOpen && (
                        <span style={{ fontSize: "10px", flexShrink: 0, marginLeft: "4px" }}>
                          {isOpen ? "▼" : "▶"}
                        </span>
                      )}
                    </button>
                    {sidebarOpen && isOpen && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                        {company.items.map((item) => {
                          const active = location.pathname === item.to;
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              className={`misa-sidebar-item ${active ? "active" : ""}`}
                              style={{ paddingLeft: "28px", fontSize: "12px" }}
                            >
                              <ChevronRight size={11} style={{ flexShrink: 0, opacity: 0.4 }} />
                              <span style={{ flex: 1 }}>{item.label}</span>
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
          {/* Nút Home - Quay lại Module Dashboard */}
          <div
            style={{
              padding: "16px 0",
              display: "flex",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Link
              to="/admin"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "rgba(0, 180, 197, 0.15)",
                border: "2px solid #00b4c5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                outline: "none",
                textDecoration: "none",
              }}
              title="Quay lại Module Dashboard"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#00b4c5";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 180, 197, 0.15)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {/* Icon Home */}
              <Home size={20} color="#00b4c5" />
            </Link>
          </div>
          {/* Sidebar Collapse Toggle Button */}
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

        {/* ── RIGHT PANEL (CONTENT) ── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#f4f6f9",
          }}
        >
          {/* ── SECONDARY TAB BAR (Light Teal, Height: 42px) ── */}
          <div
            style={{
              height: "42px",
              background: "#dff1f2",
              borderBottom: "1.5px solid #00b4c5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              flexShrink: 0,
            }}
          >
            {/* Sub Tabs */}
            <div
              style={{ display: "flex", height: "100%", alignItems: "center" }}
            >
              {subTabs.map((tab) => {
                const active = activeSubTab === tab;
                return (
                  <div
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={`misa-sub-tab-item ${active ? "active" : ""}`}
                  >
                    {tab}
                  </div>
                );
              })}
            </div>

            {/* Right Action Icons in Secondary Tab bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Green circle Lightbulb */}
              <button
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#84cc16",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                }}
                title="Tính năng thông minh"
              >
                <Lightbulb size={16} fill="white" />
              </button>

              {/* Sliders / List Options Icon */}
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#55697d",
                  padding: "4px",
                }}
                title="Cấu hình hiển thị"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Actual Scrollable Page Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
            }}
          >
            {/* Header Title Area */}
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Hệ Thống Quản Trị Tài Chính
                </h1>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "13.5px",
                    color: "#64748b",
                  }}
                >
                  Phân hệ hoạch định kế toán doanh nghiệp, quỹ tiền mặt và kiểm
                  soạt công nợ liên thông
                </p>
              </div>
            </div>

            {/* Dynamic KPI Cards (only shown on accounting dashboard/báo cáo path) */}
            {showKpiCards && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "18px",
                  marginBottom: "24px",
                }}
              >
                {kpis.map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "20px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          background: kpi.bgLight,
                          width: "48px",
                          height: "48px",
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: kpi.color,
                        }}
                      >
                        <Icon size={22} />
                      </div>

                      <div>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            fontWeight: 600,
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          {kpi.title}
                        </span>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: 800,
                            color: "#0f172a",
                            display: "block",
                            letterSpacing: "-0.3px",
                          }}
                        >
                          {loading ? "..." : kpi.value}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: kpi.isUp ? "#059669" : "#ef4444",
                            fontWeight: 500,
                            marginTop: "3px",
                            display: "block",
                          }}
                        >
                          {kpi.sub}
                        </span>
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "3px",
                          background: kpi.color,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dynamic child view component */}
            <div style={{ flex: 1, animation: "fadeIn 0.25s ease-out" }}>
              {children}
            </div>
          </div>
        </main>

        {/* ── RIGHT DOCK / FLOATING UTILITY BAR ── */}
        <div
          style={{
            width: "44px",
            background: "#e1e7eb",
            borderLeft: "1px solid #cbd5e1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px 0 16px",
            gap: "16px",
            flexShrink: 0,
            zIndex: 5,
          }}
        >
          {/* Vertical Colorful indicator tabs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "8px",
                borderRadius: "4px",
                background: "#3b82f6",
                cursor: "pointer",
                transition: "transform 0.15s",
              }}
              title="Quản lý hóa đơn"
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
            <div
              style={{
                width: "24px",
                height: "8px",
                borderRadius: "4px",
                background: "#06b6d4",
                cursor: "pointer",
                transition: "transform 0.15s",
              }}
              title="Thu chi tiền"
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
            <div
              style={{
                width: "24px",
                height: "8px",
                borderRadius: "4px",
                background: "#a855f7",
                cursor: "pointer",
                transition: "transform 0.15s",
              }}
              title="Báo cáo thuế"
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
            <div
              style={{
                width: "24px",
                height: "8px",
                borderRadius: "4px",
                background: "#10b981",
                cursor: "pointer",
                transition: "transform 0.15s",
              }}
              title="Liên thông ngân hàng"
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
            <div
              style={{
                width: "24px",
                height: "8px",
                borderRadius: "4px",
                background: "#ec4899",
                cursor: "pointer",
                transition: "transform 0.15s",
              }}
              title="Cài đặt phân hệ"
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Pentagon Home button at the bottom */}
          <button
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#ffffff",
              border: "1.5px solid #cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
              transition: "all 0.2s",
              outline: "none",
            }}
            title="Bàn làm việc kế toán"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#00b4c5";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#cbd5e1";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2d3748"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 12h3v8h14v-8h3L12 2z" />
              <line x1="12" y1="12" x2="12" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
