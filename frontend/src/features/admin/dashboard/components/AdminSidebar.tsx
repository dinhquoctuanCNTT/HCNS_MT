import { NavLink, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import logoMT from "../../../../assets/Logo MT Holdings New-01.png";
import { usePendingCount } from "../../../../context/PendingCountContext";
import { GitBranch, Users, Settings, Calculator, GraduationCap, ShoppingCart } from "lucide-react";

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

  const [openWorkflow, setOpenWorkflow] = useState(isWorkflowGroupActive);
  const [openNhanSu, setOpenNhanSu] = useState(false);
  const [openKeToan, setOpenKeToan] = useState(false);
  const [openDaoTao, setOpenDaoTao] = useState(false);

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
        <img
          src={logoMT}
          alt="MT Holding"
          style={{
            width: 140,
            height: "auto",
            objectFit: "contain",
            filter: "invert(1) hue-rotate(180deg)",
          }}
        />
      </div>

      <nav
        className="admin-sidebar__content"
        style={{ overflowY: "auto", flex: 1 }}
      >
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
              <span className="admin-sidebar__icon"><GitBranch size={18} /></span>
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
              <span className="admin-sidebar__icon"><Users size={18} /></span>
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
              <span className="admin-sidebar__icon"><Calculator size={18} /></span>
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
              {[
                { to: "/admin/ke-toan/mtshop",     label: "MTSHOP" },
                { to: "/admin/ke-toan/mtpsi",      label: "MTPSI" },
                { to: "/admin/ke-toan/mtparts",    label: "MTPARTS" },
                { to: "/admin/ke-toan/mth",        label: "MTH Phòng kế toán" },
                { to: "/admin/ke-toan/mt-paint",   label: "MT Paint" },
                { to: "/admin/ke-toan/mhm",        label: "MHM" },
                { to: "/admin/ke-toan/bc-hop-nhat",label: "BC hợp nhất MT Holdings" },
                { to: "/admin/ke-toan/bao-cao-360",label: "Báo cáo 360" },
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
              <span className="admin-sidebar__icon"><GraduationCap size={18} /></span>
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
              {[
                { to: "/admin/dao-tao/so-do-to-chuc",       label: "1. Sơ đồ tổ chức" },
                { to: "/admin/dao-tao/nhan-su-360",          label: "2. Nhân sự 360" },
                { to: "/admin/dao-tao/quy-trinh-bieu-mau",  label: "3. Quy trình, biểu mẫu" },
                { to: "/admin/dao-tao/quan-ly-tai-lieu",     label: "4. Quản lý tài liệu" },
                { to: "/admin/dao-tao/hoat-dong-dao-tao",   label: "5. Hoạt động đào tạo" },
                { to: "/admin/dao-tao/danh-gia-ket-qua",    label: "6. Đánh giá/kết quả" },
                { to: "/admin/dao-tao/mth-lien-ket",        label: "7. MTH - Đào tạo liên kết" },
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

          {/* ── PHẦN MỀM MUA HÀNG SERVER ── */}
          <NavLink
            to="/admin/phan-mem-mua-hang"
            className={({ isActive }) =>
              isActive
                ? "admin-sidebar__groupTrigger admin-sidebar__groupTrigger--active"
                : "admin-sidebar__groupTrigger"
            }
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon"><ShoppingCart size={18} /></span>
              {isOpen && <span>Phần mềm mua hàng</span>}
            </span>
          </NavLink>
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
              <span className="admin-sidebar__icon"><Settings size={18} /></span>
              {isOpen && <span>Cấu hình</span>}
            </span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
