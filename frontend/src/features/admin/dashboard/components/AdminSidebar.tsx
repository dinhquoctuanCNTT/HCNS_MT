import { NavLink, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import logoMT from "../../../../assets/Logo MT Holdings New-01.png";
import { usePendingCount } from "../../../../context/PendingCountContext";
import {
  LayoutDashboard,
  GitBranch,
  Users,
  MessageSquare,
  Inbox,
  Settings,
} from "lucide-react";

type AdminSidebarProps = {
  isOpen: boolean;
};

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const location = useLocation();
  const { pendingCount } = usePendingCount();

  const isDashboardGroupActive = useMemo(() => {
    return (
      location.pathname === "/admin" ||
      location.pathname === "/admin/dashboard" ||
      location.pathname === "/admin/default" ||
      location.pathname === "/admin/crm" ||
      location.pathname === "/admin/analytics"
    );
  }, [location.pathname]);

  const isWorkflowGroupActive = useMemo(() => {
    return location.pathname.includes("/admin/workflow");
  }, [location.pathname]);

  const isNhanSuGroupActive = useMemo(() => {
    return location.pathname.startsWith("/admin/nhan-su");
  }, [location.pathname]);

  const [openDashboard, setOpenDashboard] = useState(true);
  const [openWorkflow, setOpenWorkflow] = useState(isWorkflowGroupActive);
  const [openNhanSu, setOpenNhanSu] = useState(isNhanSuGroupActive);

  useEffect(() => {
    if (isWorkflowGroupActive) setOpenWorkflow(true);
  }, [isWorkflowGroupActive]);

  useEffect(() => {
    if (isNhanSuGroupActive) setOpenNhanSu(true);
  }, [isNhanSuGroupActive]);

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
          {/* ── DASHBOARD ── */}
          <button
            type="button"
            className={
              isDashboardGroupActive
                ? "admin-sidebar__groupTrigger admin-sidebar__groupTrigger--active"
                : "admin-sidebar__groupTrigger"
            }
            onClick={() => setOpenDashboard((prev) => !prev)}
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon"><LayoutDashboard size={18} /></span>
              {isOpen && <span>Dashboard</span>}
            </span>
            {isOpen && (
              <span className="admin-sidebar__caret">
                {openDashboard ? "▼" : "▶"}
              </span>
            )}
          </button>

          {isOpen && openDashboard && (
            <div className="admin-sidebar__submenu">
              <NavLink
                to="/admin/default"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Default
              </NavLink>
              <NavLink
                to="/admin/crm"
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                CRM
              </NavLink>
            </div>
          )}

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

              {/* ── Phê duyệt giải trình + Badge ── */}
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
        </div>

        {/* ── SUPPORT ── */}
        {isOpen && <p className="admin-sidebar__section-label">SUPPORT</p>}
        <div className="admin-sidebar__nav">
          <NavLink
            to="/admin/messages"
            className={({ isActive }) =>
              isActive
                ? "admin-sidebar__link admin-sidebar__link--active"
                : "admin-sidebar__link"
            }
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon"><MessageSquare size={18} /></span>
              {isOpen && <span>Tin nhắn</span>}
            </span>
            {isOpen && <span className="admin-sidebar__badge">5</span>}
          </NavLink>

          <NavLink
            to="/admin/inbox"
            className={({ isActive }) =>
              isActive
                ? "admin-sidebar__link admin-sidebar__link--active"
                : "admin-sidebar__link"
            }
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon"><Inbox size={18} /></span>
              {isOpen && <span>Hộp thư đến</span>}
            </span>
            {isOpen && <span className="admin-sidebar__badge">Pro</span>}
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
