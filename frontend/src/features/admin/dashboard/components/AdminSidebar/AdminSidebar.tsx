import { NavLink, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import logoMT from "../../../../../assets/Logo MT Holdings New-01.png";
import { usePendingCount } from "../../../../../context/PendingCountContext";
import {
  GitBranch,
  Users,
  Settings,
  Calculator,
  GraduationCap,
  ShoppingCart,
  Radio,
  Store,
} from "lucide-react";
import "./AdminSidebar.css";

type AdminSidebarProps = {
  isOpen: boolean;
};

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const location = useLocation();
  const { pendingCount } = usePendingCount();

  const isWorkflowGroupActive = useMemo(() => {
    return location.pathname.includes("/admin/workflow");
  }, [location.pathname]);

  const isNhanSuGroupActive = useMemo(() => {
    return location.pathname.startsWith("/admin/nhan-su");
  }, [location.pathname]);

  const isKeToanGroupActive = useMemo(() => {
    return location.pathname.startsWith("/admin/ke-toan");
  }, [location.pathname]);

  const isDaoTaoGroupActive = useMemo(() => {
    return location.pathname.startsWith("/admin/dao-tao");
  }, [location.pathname]);

  const isTruyenThongGroupActive = useMemo(() => {
    return location.pathname.startsWith("/admin/truyen-thong");
  }, [location.pathname]);

  const isPhanMemGroupActive = useMemo(() => {
    return location.pathname.startsWith("/admin/phan-mem-mua-hang");
  }, [location.pathname]);

  const isBanHangGroupActive = useMemo(() => {
    return location.pathname.startsWith("/admin/ban-hang");
  }, [location.pathname]);

  const [openWorkflow, setOpenWorkflow] = useState(isWorkflowGroupActive);
  const [openNhanSu, setOpenNhanSu] = useState(false);
  const [openKeToan, setOpenKeToan] = useState(false);
  const [openDaoTao, setOpenDaoTao] = useState(false);
  const [openTruyenThong, setOpenTruyenThong] = useState(false);
  const [openTTNhanSu, setOpenTTNhanSu] = useState(false);
  const [openTTChienLuoc, setOpenTTChienLuoc] = useState(false);
  const [openTTNguyenLieu, setOpenTTNguyenLieu] = useState(false);
  const [openTTCongCu, setOpenTTCongCu] = useState(false);
  const [openTTThuongHieu, setOpenTTThuongHieu] = useState(false);
  const [openTTThietBi, setOpenTTThietBi] = useState(false);

  const [openDaoTaoSoDo, setOpenDaoTaoSoDo] = useState(false);
  const [openDaoTaoNhanSu, setOpenDaoTaoNhanSu] = useState(false);
  const [openDaoTaoQuyTrinh, setOpenDaoTaoQuyTrinh] = useState(false);
  const [openDaoTaoTaiLieu, setOpenDaoTaoTaiLieu] = useState(false);
  const [openDaoTaoHoatDong, setOpenDaoTaoHoatDong] = useState(false);
  const [openDaoTaoDanhGia, setOpenDaoTaoDanhGia] = useState(false);
  const [openDaoTaoLienKet, setOpenDaoTaoLienKet] = useState(false);
  const [openBanHang, setOpenBanHang] = useState(false);
  const [openBanHang1, setOpenBanHang1] = useState(false);
  const [openPhanMem, setOpenPhanMem] = useState(false);
  const [openPMMH1, setOpenPMMH1] = useState(false);
  const [openPMMH2, setOpenPMMH2] = useState(false);
  const [openPMMH3, setOpenPMMH3] = useState(false);
  const [openPMMH4, setOpenPMMH4] = useState(false);
  const [openPMMH5, setOpenPMMH5] = useState(false);
  const [openKeToanMTShop, setOpenKeToanMTShop] = useState(false);
  const [openKeToanMTPSI, setOpenKeToanMTPSI] = useState(false);
  const [openKeToanMTPARTS, setOpenKeToanMTPARTS] = useState(false);
  const [openKeToanMTH, setOpenKeToanMTH] = useState(false);
  const [openKeToanMTPaint, setOpenKeToanMTPaint] = useState(false);
  const [openKeToanMHM, setOpenKeToanMHM] = useState(false);

  useEffect(() => {
    if (isWorkflowGroupActive) setOpenWorkflow(true);
  }, [isWorkflowGroupActive]);

  const isBoardActive =
    isWorkflowGroupActive && !location.search.includes("tab=history");
  const isHistoryActive =
    isWorkflowGroupActive && location.search.includes("tab=history");

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="admin-sidebar__brand">
        <img src={logoMT} alt="MT Holding" className="sidebar-logo" />
      </div>

      <nav className="admin-sidebar__content sidebar-nav-scroll">
        {isOpen && <p className="admin-sidebar__section-label">MENU</p>}
        <div className="admin-sidebar__nav">
          {/* ── WORKFLOW ── */}
          <button
            type="button"
            className={
              isWorkflowGroupActive
                ? "admin-sidebar__groupTrigger admin-sidebar__groupTrigger--active"
                : "admin-sidebar__groupTrigger"
            }
            onClick={() => setOpenWorkflow((prev) => !prev)}
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon">
                <GitBranch size={18} />
              </span>
              {isOpen && <span>Workflow</span>}
            </span>
            {isOpen && (
              <span className="admin-sidebar__caret">
                {openWorkflow ? "▼" : "▶"}
              </span>
            )}
          </button>

          {isOpen && openWorkflow && (
            <div className="admin-sidebar__submenu">
              <NavLink
                to="/admin/workflow"
                className={() =>
                  isBoardActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Board
              </NavLink>
              <NavLink
                to="/admin/workflow?tab=history"
                className={() =>
                  isHistoryActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                History
              </NavLink>
            </div>
          )}

          {/* ── NHÂN SỰ ── */}
          <button
            type="button"
            className={
              isNhanSuGroupActive
                ? "admin-sidebar__groupTrigger admin-sidebar__groupTrigger--active"
                : "admin-sidebar__groupTrigger"
            }
            onClick={() => setOpenNhanSu((prev) => !prev)}
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon">
                <Users size={18} />
              </span>
              {isOpen && <span>Nhân sự</span>}
            </span>
            {isOpen && (
              <span className="admin-sidebar__caret">
                {openNhanSu ? "▼" : "▶"}
              </span>
            )}
          </button>

          {isOpen && openNhanSu && (
            <div className="admin-sidebar__submenu">
              <NavLink
                to="/admin/nhan-su/cham-cong"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Chấm công
              </NavLink>
              <NavLink
                to="/admin/nhan-su/nhan-vien"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Nhân viên
              </NavLink>
              <NavLink
                to="/admin/nhan-su/lich-su"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Lịch sử chấm công
              </NavLink>
              <NavLink
                to="/admin/nhan-su/ngay-le"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Ngày lễ
              </NavLink>
              <NavLink
                to="/admin/nhan-su/nghi-phep"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Nghỉ phép
              </NavLink>
              <NavLink
                to="/admin/nhan-su/lam-them-gio"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Làm thêm giờ
              </NavLink>
              <NavLink
                to="/admin/nhan-su/phe-duyet"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  Phê duyệt giải trình
                  {pendingCount > 0 && (
                    <span
                      style={{
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 5px",
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      {pendingCount > 99 ? "99+" : pendingCount}
                    </span>
                  )}
                </span>
              </NavLink>
              <NavLink
                to="/admin/nhan-su/ca-lam-viec"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Ca làm việc
              </NavLink>
              <NavLink
                to="/admin/nhan-su/bao-cao"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Báo cáo
              </NavLink>
            </div>
          )}

          {/* ── KẾ TOÁN & TÀI CHÍNH ── */}
          <button
            type="button"
            className={
              isKeToanGroupActive
                ? "admin-sidebar__groupTrigger admin-sidebar__groupTrigger--active"
                : "admin-sidebar__groupTrigger"
            }
            onClick={() => setOpenKeToan((prev) => !prev)}
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon">
                <Calculator size={18} />
              </span>
              {isOpen && <span>Kế toán & Tài chính</span>}
            </span>
            {isOpen && (
              <span className="admin-sidebar__caret">
                {openKeToan ? "▼" : "▶"}
              </span>
            )}
          </button>

          {isOpen && openKeToan && (
            <div className="admin-sidebar__submenu">
              {/* MTSHOP có sub-items */}
              <button
                type="button"
                className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenKeToanMTShop((p) => !p)}
              >
                <span>MTSHOP</span>
                <span className="sidebar-caret-sm">
                  {openKeToanMTShop ? "▼" : "▶"}
                </span>
              </button>

              {openKeToanMTShop && (
                <div className="sidebar-sublevel">
                  {[
                    {
                      to: "/admin/ke-toan/mtshop/quy-trinh",
                      label: "1. Quy trình phòng kế toán",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/quy-tien-mat",
                      label: "2. Quỹ tiền mặt và ngân hàng",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/tong-hop-chi-phi",
                      label: "3. Tổng hợp các chi phí",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/cong-no-phai-thu",
                      label: "4. Công nợ phải thu",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/cong-no-phai-tra",
                      label: "5. Công nợ phải trả",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/kho-hang-hoa",
                      label: "6. Kho hàng hóa",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/bao-cao-tai-chinh",
                      label: "7. Báo cáo tài chính hàng tháng",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/bao-cao-vat",
                      label: "8. Báo cáo VAT(NBo)",
                    },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                          : "admin-sidebar__sublink"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}

              {openKeToanMTShop && (
                <div className="sidebar-sublevel">
                  {[
                    {
                      to: "/admin/ke-toan/mtshop/quy-trinh",
                      label: "1. Quy trình phòng kế toán",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/quy-tien-mat",
                      label: "2. Quỹ tiền mặt và ngân hàng",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/tong-hop-chi-phi",
                      label: "3. Tổng hợp các chi phí",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/cong-no-phai-thu",
                      label: "4. Công nợ phải thu",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/cong-no-phai-tra",
                      label: "5. Công nợ phải trả",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/kho-hang-hoa",
                      label: "6. Kho hàng hóa",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/bao-cao-tai-chinh",
                      label: "7. Báo cáo tài chính hàng tháng",
                    },
                    {
                      to: "/admin/ke-toan/mtshop/bao-cao-vat",
                      label: "8. Báo cáo VAT(NBo)",
                    },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                          : "admin-sidebar__sublink"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* MTPSI */}
              <button
                type="button"
                className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenKeToanMTPSI((p) => !p)}
              >
                <span>MTPSI</span>
                <span className="sidebar-caret-sm">
                  {openKeToanMTPSI ? "▼" : "▶"}
                </span>
              </button>

              {openKeToanMTPSI && (
                <div className="sidebar-sublevel">
                  {[
                    {
                      to: "/admin/ke-toan/mtpsi/quy-trinh",
                      label: "1. Quy trình phòng kế toán",
                    },
                    {
                      to: "/admin/ke-toan/mtpsi/quy-tien-mat",
                      label: "2. Quỹ tiền mặt và ngân hàng",
                    },
                    {
                      to: "/admin/ke-toan/mtpsi/tong-hop-chi-phi",
                      label: "3. Tổng hợp các chi phí",
                    },
                    {
                      to: "/admin/ke-toan/mtpsi/cong-no-phai-thu",
                      label: "4. Công nợ phải thu",
                    },
                    {
                      to: "/admin/ke-toan/mtpsi/cong-no-phai-tra",
                      label: "5. Công nợ phải trả",
                    },
                    {
                      to: "/admin/ke-toan/mtpsi/kho-hang-hoa",
                      label: "6. Kho hàng hóa",
                    },
                    {
                      to: "/admin/ke-toan/mtpsi/bao-cao-tai-chinh",
                      label: "7. Báo cáo tài chính hàng tháng",
                    },
                    {
                      to: "/admin/ke-toan/mtpsi/bao-cao-vat",
                      label: "8. Báo cáo VAT(NBo)",
                    },
                    {
                      to: "/admin/ke-toan/mtpsi/hop-dong-thi-cong",
                      label: "9. Các mẫu hợp đồng thi công",
                    },
                    {
                      to: "/admin/ke-toan/mtpsi/theo-doi-cong-trinh",
                      label: "10. Theo dõi các công trình",
                    },
                    { to: "/admin/ke-toan/mtpsi/thue", label: "11. Thuế" },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                          : "admin-sidebar__sublink"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* MTPARTS */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenKeToanMTPARTS((p) => !p)}>
                <span>MTPARTS</span>
                <span className="sidebar-caret-sm">{openKeToanMTPARTS ? "▼" : "▶"}</span>
              </button>
              {openKeToanMTPARTS && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/ke-toan/mtparts/quy-trinh",        label: "1. Quy trình phòng kế toán" },
                    { to: "/admin/ke-toan/mtparts/quy-tien-mat",      label: "2. Quỹ tiền mặt và ngân hàng" },
                    { to: "/admin/ke-toan/mtparts/tong-hop-chi-phi",  label: "3. Tổng hợp các chi phí" },
                    { to: "/admin/ke-toan/mtparts/cong-no-phai-thu",  label: "4. Công nợ phải thu" },
                    { to: "/admin/ke-toan/mtparts/cong-no-phai-tra",  label: "5. Công nợ phải trả" },
                    { to: "/admin/ke-toan/mtparts/kho-hang-hoa",      label: "6. Kho hàng hóa" },
                    { to: "/admin/ke-toan/mtparts/bao-cao-tai-chinh", label: "7. Báo cáo tài chính hàng tháng" },
                    { to: "/admin/ke-toan/mtparts/bao-cao-vat",       label: "8. Báo cáo VAT(NBo)" },
                    { to: "/admin/ke-toan/mtparts/thue",              label: "9. Thuế" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* MTH Phòng kế toán */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenKeToanMTH((p) => !p)}>
                <span>MTH Phòng kế toán</span>
                <span className="sidebar-caret-sm">{openKeToanMTH ? "▼" : "▶"}</span>
              </button>
              {openKeToanMTH && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/ke-toan/mth/tu-tai-lieu",   label: "1. Tủ tài liệu phòng kế toán" },
                    { to: "/admin/ke-toan/mth/dao-tao-kt",    label: "2. Đào tạo KT" },
                    { to: "/admin/ke-toan/mth/cong-viec-ktv", label: "3. Công việc của kế toán viên" },
                    { to: "/admin/ke-toan/mth/tai-lieu-dao-tao", label: "4. Tài liệu đào tạo KTBH và Kho" },
                    { to: "/admin/ke-toan/mth/hop-giao-ban",  label: "Họp giao ban" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* MT Paint */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenKeToanMTPaint((p) => !p)}>
                <span>MT Paint</span>
                <span className="sidebar-caret-sm">{openKeToanMTPaint ? "▼" : "▶"}</span>
              </button>
              {openKeToanMTPaint && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/ke-toan/mt-paint/quy-trinh",          label: "1. Quy trình phòng kế toán MT" },
                    { to: "/admin/ke-toan/mt-paint/quy-tien-mat",        label: "2. Quỹ tiền mặt và chuyển khoản" },
                    { to: "/admin/ke-toan/mt-paint/tong-hop-chi-phi",    label: "3. Tổng hợp các chi phí" },
                    { to: "/admin/ke-toan/mt-paint/cong-no-phai-thu",    label: "5. Công nợ phải thu" },
                    { to: "/admin/ke-toan/mt-paint/kho-pha-le",          label: "6. Kho pha lẻ" },
                    { to: "/admin/ke-toan/mt-paint/bao-cao-tai-chinh",   label: "7. Báo cáo tài chính hàng tháng" },
                    { to: "/admin/ke-toan/mt-paint/kho-hang-hoa",        label: "8. Kho hàng hóa" },
                    { to: "/admin/ke-toan/mt-paint/hoa-don-vat",         label: "9. Hóa đơn VAT" },
                    { to: "/admin/ke-toan/mt-paint/cong-no-trong-nuoc",  label: "10. Công nợ phải trả trong nước" },
                    { to: "/admin/ke-toan/mt-paint/cong-no-nuoc-ngoai",  label: "11. Công nợ phải trả nước ngoài" },
                    { to: "/admin/ke-toan/mt-paint/ngan-sach",           label: "12. Ngân sách" },
                    { to: "/admin/ke-toan/mt-paint/bao-cao-bi",          label: "13. Học làm báo cáo BI" },
                    { to: "/admin/ke-toan/mt-paint/hang-hu-hong",        label: "14. Hồ sơ hàng hư hỏng hàng năm" },
                    { to: "/admin/ke-toan/mt-paint/du-lieu-pm",          label: "15. Dữ liệu pm" },
                    { to: "/admin/ke-toan/mt-paint/thue",                label: "16. Thuế MT Paint" },
                    { to: "/admin/ke-toan/mt-paint/doi-chieu-136-336",   label: "17. Báo cáo đối chiếu 136 và 336" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* MHM */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenKeToanMHM((p) => !p)}>
                <span>MHM</span>
                <span className="sidebar-caret-sm">{openKeToanMHM ? "▼" : "▶"}</span>
              </button>
              {openKeToanMHM && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/ke-toan/mhm/quy-trinh",        label: "1. Quy trình phòng kế toán" },
                    { to: "/admin/ke-toan/mhm/quy-tien-mat",      label: "2. Quỹ tiền mặt và ngân hàng" },
                    { to: "/admin/ke-toan/mhm/cong-no-phai-thu",  label: "3. Công nợ phải thu" },
                    { to: "/admin/ke-toan/mhm/cong-no-phai-tra",  label: "4. Công nợ phải trả" },
                    { to: "/admin/ke-toan/mhm/chi-phi-cong-cu",   label: "5. Chi phí đầu tư thiết bị công cụ" },
                    { to: "/admin/ke-toan/mhm/chi-phi-kinh-doanh",label: "6. Chi phí kinh doanh" },
                    { to: "/admin/ke-toan/mhm/chi-phi-san-xuat",  label: "7. Chi phí sản xuất" },
                    { to: "/admin/ke-toan/mhm/chi-phi-van-hanh",  label: "8. Chi phí vận hành" },
                    { to: "/admin/ke-toan/mhm/kho",               label: "9. Kho" },
                    { to: "/admin/ke-toan/mhm/bao-cao-thue",      label: "10. Báo cáo thuế" },
                    { to: "/admin/ke-toan/mhm/hoa-don",           label: "11. Hóa đơn đầu vào và đầu ra" },
                    { to: "/admin/ke-toan/mhm/bao-cao-tai-chinh", label: "12. Báo cáo tài chính hàng tháng" },
                    { to: "/admin/ke-toan/mhm/ke-hoach-ban-hang", label: "13. Kế hoạch bán hàng" },
                    { to: "/admin/ke-toan/mhm/theo-doi-boc-tach", label: "14. Theo dõi khác - bóc tách chi phí" },
                    { to: "/admin/ke-toan/mhm/tinh-gia-von",      label: "15. Tính giá vốn MHM" },
                    { to: "/admin/ke-toan/mhm/thue",              label: "16. Thuế" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {[
                {
                  to: "/admin/ke-toan/bc-hop-nhat",
                  label: "BC hợp nhất MT Holdings",
                },
                { to: "/admin/ke-toan/bao-cao-360", label: "Báo cáo 360" },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                      : "admin-sidebar__sublink"
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}

          {/* ── ĐÀO TẠO ── */}
          <button
            type="button"
            className={
              isDaoTaoGroupActive
                ? "admin-sidebar__groupTrigger admin-sidebar__groupTrigger--active"
                : "admin-sidebar__groupTrigger"
            }
            onClick={() => setOpenDaoTao((prev) => !prev)}
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon">
                <GraduationCap size={18} />
              </span>
              {isOpen && <span>Đào tạo</span>}
            </span>
            {isOpen && (
              <span className="admin-sidebar__caret">
                {openDaoTao ? "▼" : "▶"}
              </span>
            )}
          </button>

          {isOpen && openDaoTao && (
            <div className="admin-sidebar__submenu">

              {/* 1. Sơ đồ tổ chức */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenDaoTaoSoDo((p) => !p)}>
                <span>1. Sơ đồ tổ chức</span>
                <span className="sidebar-caret-sm">{openDaoTaoSoDo ? "▼" : "▶"}</span>
              </button>
              {openDaoTaoSoDo && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/dao-tao/so-do-to-chuc/he-sinh-thai",   label: "1.1. Hệ sinh thái MTH" },
                    { to: "/admin/dao-tao/so-do-to-chuc/danh-muc-cty",   label: "1.2. Danh mục công ty, chi nhánh, phòng ban" },
                    { to: "/admin/dao-tao/so-do-to-chuc/ho-so-nang-luc", label: "1.3. Hồ sơ năng lực các công ty" },
                    { to: "/admin/dao-tao/so-do-to-chuc/chuc-nang-pb",   label: "1.4. Chức năng nhiệm vụ phòng ban" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* 2. Nhân sự 360 */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenDaoTaoNhanSu((p) => !p)}>
                <span>2. Nhân sự 360</span>
                <span className="sidebar-caret-sm">{openDaoTaoNhanSu ? "▼" : "▶"}</span>
              </button>
              {openDaoTaoNhanSu && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/dao-tao/nhan-su-360/danh-sach",   label: "2.1. Danh sách nhân sự" },
                    { to: "/admin/dao-tao/nhan-su-360/bmtcv-kpi",   label: "2.2. BMTCV + KPI" },
                    { to: "/admin/dao-tao/nhan-su-360/khung-nang-luc", label: "2.3. Khung năng lực" },
                    { to: "/admin/dao-tao/nhan-su-360/lo-trinh",    label: "2.4. Lộ trình phát triển" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* 3. Quy trình, biểu mẫu */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenDaoTaoQuyTrinh((p) => !p)}>
                <span>3. Quy trình, biểu mẫu</span>
                <span className="sidebar-caret-sm">{openDaoTaoQuyTrinh ? "▼" : "▶"}</span>
              </button>
              {openDaoTaoQuyTrinh && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/dao-tao/quy-trinh/quy-trinh-chung",   label: "1. Quy trình chung PĐT" },
                    { to: "/admin/dao-tao/quy-trinh/bien-ban-hop",       label: "Biên bản họp hàng tháng" },
                    { to: "/admin/dao-tao/quy-trinh/ke-hoach-tuan-thang",label: "2. Kế hoạch tuần/tháng PĐT" },
                    { to: "/admin/dao-tao/quy-trinh/bao-cao-ngay",       label: "3. Báo cáo ngày/tuần/tháng" },
                    { to: "/admin/dao-tao/quy-trinh/bao-cao-hoat-dong",  label: "4. Báo cáo tháng hoạt động đào tạo" },
                    { to: "/admin/dao-tao/quy-trinh/giay-to-hc",         label: "5. Giấy tờ hành chính" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* 4. Quản lý tài liệu */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenDaoTaoTaiLieu((p) => !p)}>
                <span>4. Quản lý tài liệu</span>
                <span className="sidebar-caret-sm">{openDaoTaoTaiLieu ? "▼" : "▶"}</span>
              </button>
              {openDaoTaoTaiLieu && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/dao-tao/tai-lieu/mth",        label: "1. MTH" },
                    { to: "/admin/dao-tao/tai-lieu/mtpaints",   label: "2. MTPaints" },
                    { to: "/admin/dao-tao/tai-lieu/mhm",        label: "3. MHM" },
                    { to: "/admin/dao-tao/tai-lieu/mtparts",    label: "4. MTparts" },
                    { to: "/admin/dao-tao/tai-lieu/mtshop",     label: "5. MTShop" },
                    { to: "/admin/dao-tao/tai-lieu/mtpsi",      label: "6. MTPSI" },
                    { to: "/admin/dao-tao/tai-lieu/mteducation",label: "7. MTEducation" },
                    { to: "/admin/dao-tao/tai-lieu/mtsoft",     label: "8. MTSoft" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* 5. Hoạt động đào tạo */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenDaoTaoHoatDong((p) => !p)}>
                <span>5. Hoạt động đào tạo</span>
                <span className="sidebar-caret-sm">{openDaoTaoHoatDong ? "▼" : "▶"}</span>
              </button>
              {openDaoTaoHoatDong && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/dao-tao/hoat-dong/chuong-trinh",    label: "1. Chương trình đào tạo theo công ty" },
                    { to: "/admin/dao-tao/hoat-dong/nhu-cau",         label: "Nhu cầu đào tạo toàn hệ thống" },
                    { to: "/admin/dao-tao/hoat-dong/ke-hoach",        label: "Kế hoạch, lịch đào tạo trong tháng" },
                    { to: "/admin/dao-tao/hoat-dong/hoi-nhap",        label: "2. Đào tạo hội nhập" },
                    { to: "/admin/dao-tao/hoat-dong/chuyen-mon",      label: "3. Đào tạo chuyên môn" },
                    { to: "/admin/dao-tao/hoat-dong/nang-cao",        label: "4. Đào tạo nâng cao (theo khung năng lực)" },
                    { to: "/admin/dao-tao/hoat-dong/thue-ngoai",      label: "5. Đào tạo thuê ngoài" },
                    { to: "/admin/dao-tao/hoat-dong/san-pham-moi",    label: "6. Đào tạo sản phẩm mới" },
                    { to: "/admin/dao-tao/hoat-dong/nhac-lai",        label: "7. Đào tạo nhắc lại" },
                    { to: "/admin/dao-tao/hoat-dong/bao-cao-tong-hop",label: "8. Báo cáo tổng hợp" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* 6. Đánh giá/kết quả */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenDaoTaoDanhGia((p) => !p)}>
                <span>6. Đánh giá/kết quả</span>
                <span className="sidebar-caret-sm">{openDaoTaoDanhGia ? "▼" : "▶"}</span>
              </button>
              {openDaoTaoDanhGia && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/dao-tao/danh-gia/ket-qua-toan-he-thong", label: "1. Kết quả đào tạo toàn hệ thống" },
                    { to: "/admin/dao-tao/danh-gia/khao-sat",              label: "2. Khảo sát sau đào tạo" },
                    { to: "/admin/dao-tao/danh-gia/tong-hop-phan-tich",    label: "3. Tổng hợp, phân tích kết quả" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* 7. MTH - Đào tạo liên kết */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenDaoTaoLienKet((p) => !p)}>
                <span>7. MTH - Đào tạo liên kết</span>
                <span className="sidebar-caret-sm">{openDaoTaoLienKet ? "▼" : "▶"}</span>
              </button>
              {openDaoTaoLienKet && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/dao-tao/lien-ket/oem",          label: "1. OEM" },
                    { to: "/admin/dao-tao/lien-ket/truong",        label: "2. Trường" },
                    { to: "/admin/dao-tao/lien-ket/hoi-thi-tay-nghe", label: "3. Hội thi tay nghề" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ── TRUYỀN THÔNG ── */}
          <button
            type="button"
            className={
              isTruyenThongGroupActive
                ? "admin-sidebar__groupTrigger admin-sidebar__groupTrigger--active"
                : "admin-sidebar__groupTrigger"
            }
            onClick={() => setOpenTruyenThong((prev) => !prev)}
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon">
                <Radio size={18} />
              </span>
              {isOpen && <span>Truyền thông</span>}
            </span>
            {isOpen && (
              <span className="admin-sidebar__caret">
                {openTruyenThong ? "▼" : "▶"}
              </span>
            )}
          </button>

          {isOpen && openTruyenThong && (
            <div className="admin-sidebar__submenu">
              {/* cấp 2: Nhân sự 360 */}
              <button
                type="button"
                className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenTTNhanSu((p) => !p)}
              >
                <span>1. Nhân sự 360</span>
                <span className="sidebar-caret-sm">
                  {openTTNhanSu ? "▼" : "▶"}
                </span>
              </button>

              {openTTNhanSu && (
                <div className="sidebar-sublevel">
                  {[
                    {
                      to: "/admin/truyen-thong/nhan-su-360/thong-tin",
                      label: "1.1 Thông tin nhân sự",
                    },
                    {
                      to: "/admin/truyen-thong/nhan-su-360/bmtcv-luong",
                      label: "1.2 BMTCV và lương P3",
                    },
                    {
                      to: "/admin/truyen-thong/nhan-su-360/p3",
                      label: "1.3 P3",
                    },
                    {
                      to: "/admin/truyen-thong/nhan-su-360/ke-hoach-nam",
                      label: "1.4 Kế hoạch năm",
                    },
                    {
                      to: "/admin/truyen-thong/nhan-su-360/dao-tao",
                      label: "1.5 Đào tạo",
                    },
                    {
                      to: "/admin/truyen-thong/nhan-su-360/bao-cao-ngay",
                      label: "1.6 Báo cáo ngày",
                    },
                    {
                      to: "/admin/truyen-thong/nhan-su-360/ke-hoach-tuan",
                      label: "1.7 Kế hoạch tuần",
                    },
                    {
                      to: "/admin/truyen-thong/nhan-su-360/ke-hoach-thang",
                      label: "1.8 Kế hoạch tháng",
                    },
                    {
                      to: "/admin/truyen-thong/nhan-su-360/bao-cao-360",
                      label: "1.9 Báo cáo 360",
                    },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                          : "admin-sidebar__sublink"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* cấp 2: Chiến lược - Chiến dịch */}
              <button
                type="button"
                className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenTTChienLuoc((p) => !p)}
              >
                <span>2. Chiến lược - Chiến dịch</span>
                <span className="sidebar-caret-sm">
                  {openTTChienLuoc ? "▼" : "▶"}
                </span>
              </button>

              {openTTChienLuoc && (
                <div className="sidebar-sublevel">
                  {[
                    {
                      to: "/admin/truyen-thong/chien-luoc/phan-tich-insight",
                      label: "2.1 Phân tích Insight khách hàng",
                    },
                    {
                      to: "/admin/truyen-thong/chien-luoc/chien-luoc",
                      label: "2.2 Chiến lược",
                    },
                    {
                      to: "/admin/truyen-thong/chien-luoc/chien-dich",
                      label: "2.3 Chiến dịch",
                    },
                    {
                      to: "/admin/truyen-thong/chien-luoc/du-an",
                      label: "2.4 Dự án",
                    },
                    {
                      to: "/admin/truyen-thong/chien-luoc/bao-cao-360",
                      label: "2.5 Báo cáo 360",
                    },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                          : "admin-sidebar__sublink"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* cấp 2: Quản lý nguyên liệu */}
              <button
                type="button"
                className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenTTNguyenLieu((p) => !p)}
              >
                <span>3. Quản lý nguyên liệu</span>
                <span className="sidebar-caret-sm">
                  {openTTNguyenLieu ? "▼" : "▶"}
                </span>
              </button>

              {openTTNguyenLieu && (
                <div className="sidebar-sublevel">
                  {[
                    {
                      to: "/admin/truyen-thong/nguyen-lieu/video",
                      label: "3.1 Video",
                    },
                    {
                      to: "/admin/truyen-thong/nguyen-lieu/hinh-anh",
                      label: "3.2 Hình ảnh",
                    },
                    {
                      to: "/admin/truyen-thong/nguyen-lieu/content",
                      label: "3.3 Content",
                    },
                    {
                      to: "/admin/truyen-thong/nguyen-lieu/su-kien",
                      label: "3.4 Sự kiện",
                    },
                    {
                      to: "/admin/truyen-thong/nguyen-lieu/tem-nhan",
                      label: "3.5 Tem nhãn, bao bì",
                    },
                    {
                      to: "/admin/truyen-thong/nguyen-lieu/bao-cao-360",
                      label: "3.6 Báo cáo 360",
                    },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                          : "admin-sidebar__sublink"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* cấp 2: Quản lý công cụ truyền thông */}
              <button
                type="button"
                className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenTTCongCu((p) => !p)}
              >
                <span>4. Quản lý công cụ truyền thông</span>
                <span className="sidebar-caret-sm">
                  {openTTCongCu ? "▼" : "▶"}
                </span>
              </button>

              {openTTCongCu && (
                <div className="sidebar-sublevel">
                  {[
                    {
                      to: "/admin/truyen-thong/cong-cu/kenh-truyen-thong",
                      label: "4.1 Kênh truyền thông",
                    },
                    {
                      to: "/admin/truyen-thong/cong-cu/website-seo",
                      label: "4.2 Website và SEO",
                    },
                    {
                      to: "/admin/truyen-thong/cong-cu/mang-xa-hoi",
                      label: "4.3 Mạng xã hội",
                    },
                    {
                      to: "/admin/truyen-thong/cong-cu/zalo-oa",
                      label: "4.4 Zalo OA",
                    },
                    {
                      to: "/admin/truyen-thong/cong-cu/email-marketing",
                      label: "4.5 Email Marketing",
                    },
                    {
                      to: "/admin/truyen-thong/cong-cu/khach-hang-tiem-nang",
                      label: "4.6 Khách hàng tiềm năng",
                    },
                    {
                      to: "/admin/truyen-thong/cong-cu/bao-cao-360",
                      label: "4.7 Báo cáo 360",
                    },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                          : "admin-sidebar__sublink"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* cấp 2: Quản lý thương hiệu */}
              <button
                type="button"
                className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenTTThuongHieu((p) => !p)}
              >
                <span>5. Quản lý thương hiệu</span>
                <span className="sidebar-caret-sm">
                  {openTTThuongHieu ? "▼" : "▶"}
                </span>
              </button>

              {openTTThuongHieu && (
                <div className="sidebar-sublevel">
                  {[
                    {
                      to: "/admin/truyen-thong/thuong-hieu/thuong-hieu",
                      label: "5.1 Thương hiệu",
                    },
                    {
                      to: "/admin/truyen-thong/thuong-hieu/bao-cao-360",
                      label: "5.2 Báo cáo 360",
                    },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                          : "admin-sidebar__sublink"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* cấp 2: Quản lý thiết bị dụng cụ */}
              <button
                type="button"
                className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenTTThietBi((p) => !p)}
              >
                <span>6. Quản lý thiết bị dụng cụ</span>
                <span className="sidebar-caret-sm">
                  {openTTThietBi ? "▼" : "▶"}
                </span>
              </button>

              {openTTThietBi && (
                <div className="sidebar-sublevel">
                  {[
                    {
                      to: "/admin/truyen-thong/thiet-bi-dung-cu/quan-ly",
                      label: "6.1 Quản lý thiết bị dụng cụ",
                    },
                    {
                      to: "/admin/truyen-thong/thiet-bi-dung-cu/bao-cao-360",
                      label: "6.2 Báo cáo 360",
                    },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                          : "admin-sidebar__sublink"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}

              <NavLink
                to="/admin/truyen-thong/cai-dat-quan-tri"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                7. Cài đặt quản trị
              </NavLink>
            </div>
          )}

          {/* ── PHẦN MỀM MUA HÀNG SERVER ── */}
          <button
            type="button"
            className={
              isPhanMemGroupActive
                ? "admin-sidebar__groupTrigger admin-sidebar__groupTrigger--active"
                : "admin-sidebar__groupTrigger"
            }
            onClick={() => setOpenPhanMem((prev) => !prev)}
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon">
                <ShoppingCart size={18} />
              </span>
              {isOpen && <span>Phần mềm mua hàng</span>}
            </span>
            {isOpen && (
              <span className="admin-sidebar__caret">
                {openPhanMem ? "▼" : "▶"}
              </span>
            )}
          </button>

          {isOpen && openPhanMem && (
            <div className="admin-sidebar__submenu">

              {/* 1. Thông tin NCC */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenPMMH1((p) => !p)}>
                <span>1. Thông tin NCC</span>
                <span className="sidebar-caret-sm">{openPMMH1 ? "▼" : "▶"}</span>
              </button>
              {openPMMH1 && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/phan-mem-mua-hang/ncc/thong-tin", label: "1.1. Thông tin nhà cung cấp" },
                    { to: "/admin/phan-mem-mua-hang/ncc/danh-gia",  label: "1.2. Đánh giá NCC" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* 2. Nhân sự */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenPMMH2((p) => !p)}>
                <span>2. Nhân sự</span>
                <span className="sidebar-caret-sm">{openPMMH2 ? "▼" : "▶"}</span>
              </button>
              {openPMMH2 && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/phan-mem-mua-hang/nhan-su/thong-tin",    label: "2.1. Thông tin nhân sự" },
                    { to: "/admin/phan-mem-mua-hang/nhan-su/bmtcv-thuong", label: "2.2. BMTCV + thưởng P3" },
                    { to: "/admin/phan-mem-mua-hang/nhan-su/he-thong-bc",  label: "2.3. Hệ thống Báo cáo" },
                    { to: "/admin/phan-mem-mua-hang/nhan-su/chien-luoc",   label: "2.4. Chiến lược, mục tiêu phòng mua hàng" },
                    { to: "/admin/phan-mem-mua-hang/nhan-su/cl-muc-tieu-nam", label: "2.4.0. Chiến lược, mục tiêu năm" },
                    { to: "/admin/phan-mem-mua-hang/nhan-su/ke-hoach-nam", label: "2.4.1. Kế hoạch, hành động năm" },
                    { to: "/admin/phan-mem-mua-hang/nhan-su/p3-nam",       label: "2.4.2. P3 năm" },
                    { to: "/admin/phan-mem-mua-hang/nhan-su/dao-tao",      label: "2.5. Đào tạo" },
                    { to: "/admin/phan-mem-mua-hang/nhan-su/s5",           label: "2.6. S5" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* 3. Sản phẩm */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenPMMH3((p) => !p)}>
                <span>3. Sản phẩm</span>
                <span className="sidebar-caret-sm">{openPMMH3 ? "▼" : "▶"}</span>
              </button>
              {openPMMH3 && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/phan-mem-mua-hang/san-pham/ke-hoach-sp-moi", label: "3.1. Kế hoạch triển khai sản phẩm mới" },
                    { to: "/admin/phan-mem-mua-hang/san-pham/bang-gia-von",    label: "3.2. Bảng giá vốn lợi nhuận" },
                    { to: "/admin/phan-mem-mua-hang/san-pham/thong-tin-sp",    label: "3.3. Thông tin sản phẩm" },
                    { to: "/admin/phan-mem-mua-hang/san-pham/top-ban-nhieu",   label: "3.4. Top sản phẩm bán nhiều đột biến" },
                    { to: "/admin/phan-mem-mua-hang/san-pham/top-ban-cham",    label: "3.5. Top sản phẩm bán chậm" },
                    { to: "/admin/phan-mem-mua-hang/san-pham/canh-bao-kho",    label: "3.6. Cảnh báo hàng tồn kho cần date" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* 4. Đặt hàng */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenPMMH4((p) => !p)}>
                <span>4. Đặt hàng</span>
                <span className="sidebar-caret-sm">{openPMMH4 ? "▼" : "▶"}</span>
              </button>
              {openPMMH4 && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/phan-mem-mua-hang/dat-hang/ke-hoach-nam",   label: "4.1. Kế hoạch đặt hàng theo năm" },
                    { to: "/admin/phan-mem-mua-hang/dat-hang/ke-hoach-thang", label: "4.2. Kế hoạch đặt hàng theo tháng" },
                    { to: "/admin/phan-mem-mua-hang/dat-hang/theo-doi-don",   label: "4.3. Theo dõi đơn đặt hàng" },
                    { to: "/admin/phan-mem-mua-hang/dat-hang/giam-gia-ncc",   label: "4.4. Giảm giá mua từ NCC" },
                    { to: "/admin/phan-mem-mua-hang/dat-hang/khieu-nai",      label: "4.5. Khiếu nại đơn hàng" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              {/* 5. Thanh toán */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenPMMH5((p) => !p)}>
                <span>5. Thanh toán</span>
                <span className="sidebar-caret-sm">{openPMMH5 ? "▼" : "▶"}</span>
              </button>
              {openPMMH5 && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/phan-mem-mua-hang/thanh-toan/ke-hoach-ncc", label: "5.1. Kế hoạch thanh toán NCC" },
                    { to: "/admin/phan-mem-mua-hang/thanh-toan/cong-no",      label: "5.2. Đảm bảo thanh toán công nợ" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}

              <NavLink to="/admin/phan-mem-mua-hang/chi-phi" className={({ isActive }) =>
                isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
              }>6. Chi phí mua hàng</NavLink>

              <NavLink to="/admin/phan-mem-mua-hang/ty-gia" className={({ isActive }) =>
                isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
              }>7. Tỷ giá ngoại tệ biến thiên</NavLink>

            </div>
          )}

          {/* ── HỆ THỐNG QUẢN BÁN HÀNG ── */}
          <button
            type="button"
            className={
              isBanHangGroupActive
                ? "admin-sidebar__groupTrigger admin-sidebar__groupTrigger--active"
                : "admin-sidebar__groupTrigger"
            }
            onClick={() => setOpenBanHang((prev) => !prev)}
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon">
                <Store size={18} />
              </span>
              {isOpen && <span>Hệ thống quản bán hàng</span>}
            </span>
            {isOpen && (
              <span className="admin-sidebar__caret">
                {openBanHang ? "▼" : "▶"}
              </span>
            )}
          </button>

          {isOpen && openBanHang && (
            <div className="admin-sidebar__submenu">
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn"
                onClick={() => setOpenBanHang1((p) => !p)}>
                <span>1. Quản lý bán hàng</span>
                <span className="sidebar-caret-sm">{openBanHang1 ? "▼" : "▶"}</span>
              </button>
              {openBanHang1 && (
                <div className="sidebar-sublevel">
                  {[
                    { to: "/admin/ban-hang/thong-tin-kh-360",     label: "1.1 Thông tin khách hàng 360" },
                    { to: "/admin/ban-hang/dinh-huong-kh-360",    label: "1.1.1 Định hướng khách hàng 360" },
                    { to: "/admin/ban-hang/nhan-su-pbh-360",      label: "1.2 Nhân sự phòng bán hàng 360" },
                    { to: "/admin/ban-hang/co-cau-to-chuc",       label: "1.2.0 Cơ cấu tổ chức" },
                    { to: "/admin/ban-hang/thong-tin-nhan-su",    label: "1.2.1 Thông tin nhân sự" },
                    { to: "/admin/ban-hang/danh-gia-luong-3p",    label: "1.2.2 Đánh giá lương 3P" },
                    { to: "/admin/ban-hang/co-che-bh-tieu-chuan", label: "1.2.3 Cơ chế bán hàng tiêu chuẩn" },
                    { to: "/admin/ban-hang/co-che-bh-thuc-te",    label: "1.2.4 Cơ chế bán hàng thực tế" },
                    { to: "/admin/ban-hang/doi-thu-canh-tranh",   label: "1.3 Thông tin đối thủ cạnh tranh" },
                    { to: "/admin/ban-hang/san-pham-gia-ban",     label: "1.4 Thông tin sản phẩm và giá bán" },
                    { to: "/admin/ban-hang/kh-noi-ngoai-tinh",    label: "1.5 Kế hoạch BH nội tỉnh và ngoại tỉnh" },
                    { to: "/admin/ban-hang/kh-bh-noi-ngoai",      label: "1.5.1 Kế hoạch BH nội tỉnh và ngoại tỉnh" },
                    { to: "/admin/ban-hang/kq-bh-noi-ngoai",      label: "1.5.2 Kết quả BH nội tỉnh và ngoại tỉnh" },
                    { to: "/admin/ban-hang/top-20-kh-80-ds",      label: "1.6 Top 20% KH đóng góp 80% doanh số" },
                    { to: "/admin/ban-hang/kh-khong-mua-30-60-90",label: "1.7 KH không mua hàng 30/60/90 ngày" },
                    { to: "/admin/ban-hang/kh-mua-giam-20",       label: "1.8 KH có mức mua giảm từ 20% tháng trước" },
                    { to: "/admin/ban-hang/ds-chi-phi-ln-kh",     label: "1.9 Doanh số - chi phí - lợi nhuận theo KH" },
                    { to: "/admin/ban-hang/ho-so-co-hoi-dau-tu",  label: "1.9.1 Hồ sơ cơ hội đầu tư" },
                    { to: "/admin/ban-hang/hang-muc-dau-tu",      label: "1.9.2 Hạng mục đầu tư ban đầu" },
                    { to: "/admin/ban-hang/chi-phi-van-hanh",     label: "1.9.3 Chi phí vận hành" },
                    { to: "/admin/ban-hang/ke-hoach-ds-gia-dinh", label: "1.9.4 Kế hoạch doanh số và giả định hiệu quả" },
                    { to: "/admin/ban-hang/danh-gia-phe-duyet",   label: "1.9.5 Đánh giá / phê duyệt / cảnh báo" },
                    { to: "/admin/ban-hang/quan-ly-cong-no",      label: "1.10 Quản lý công nợ" },
                    { to: "/admin/ban-hang/sales-roadmap",        label: "1.11 Quản lý BH theo Sales Roadmap" },
                    { to: "/admin/ban-hang/ho-so-du-an-bh",       label: "1.11.1 Hồ sơ dự án bán hàng" },
                    { to: "/admin/ban-hang/tien-do-roadmap",      label: "1.11.2 Tiến độ roadmap 11 bước" },
                    { to: "/admin/ban-hang/nhat-ky-hanh-dong",    label: "1.11.3 Nhật ký hành động" },
                    { to: "/admin/ban-hang/y-kien-dinh-huong",    label: "1.11.4 Ý kiến / định hướng / kết quả" },
                    { to: "/admin/ban-hang/muc-tieu-ke-hoach",    label: "1.12 Mục tiêu / kế hoạch / kết quả theo công ty" },
                  ].map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                      isActive ? "admin-sidebar__sublink admin-sidebar__sublink--active" : "admin-sidebar__sublink"
                    }>{label}</NavLink>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── OTHERS ── */}
        {isOpen && <p className="admin-sidebar__section-label">OTHERS</p>}
        <div className="admin-sidebar__nav">
          <NavLink
            to="/admin/icons"
            className={({ isActive }) =>
              isActive
                ? "admin-sidebar__link admin-sidebar__link--active"
                : "admin-sidebar__link"
            }
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon">
                <Settings size={18} />
              </span>
              {isOpen && <span>Cấu hình</span>}
            </span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
