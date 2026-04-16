import { NavLink, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

type AdminSidebarProps = {
  isOpen: boolean;
};

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const location = useLocation();

  const isDashboardGroupActive = useMemo(() => {
    return (
      location.pathname === "/admin" ||
      location.pathname === "/admin/dashboard" ||
      location.pathname === "/admin/default" ||
      location.pathname === "/admin/crm" ||
      location.pathname === "/admin/analytics"
    );
  }, [location.pathname]);

  // ✅ FIX: active khi ở /admin/workflow dù có ?tab= gì
  const isWorkflowGroupActive = useMemo(() => {
    return location.pathname === "/admin/workflow";
  }, [location.pathname]);

  const [openDashboard, setOpenDashboard] = useState(true);
  const [openWorkflow, setOpenWorkflow] = useState(isWorkflowGroupActive);

  // ✅ FIX: giữ submenu mở khi đang ở bất kỳ tab workflow nào
  useEffect(() => {
    if (isWorkflowGroupActive) {
      setOpenWorkflow(true);
    }
  }, [isWorkflowGroupActive]);

  const isBoardActive =
    isWorkflowGroupActive && !location.search.includes("tab=history");

  const isHistoryActive =
    isWorkflowGroupActive && location.search.includes("tab=history");

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logoMark">◉</div>
        {isOpen && <div className="admin-sidebar__logoText">adminty</div>}
      </div>

      {isOpen && <p className="admin-sidebar__heading">Navigation</p>}

      <nav className="admin-sidebar__nav">
        {/* Dashboard */}
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
            <span className="admin-sidebar__bullet">›</span>
            {isOpen && <span>Dashboard</span>}
          </span>
          {isOpen && (
            <span className="admin-sidebar__caret">
              {openDashboard ? "▾" : "▸"}
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
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                isActive
                  ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                  : "admin-sidebar__sublink"
              }
            >
              Analytics
            </NavLink>
          </div>
        )}

        {/* Icons */}
        <NavLink
          to="/admin/icons"
          className={({ isActive }) =>
            isActive
              ? "admin-sidebar__link admin-sidebar__link--active"
              : "admin-sidebar__link"
          }
        >
          <span className="admin-sidebar__bullet">›</span>
          {isOpen && <span>Icons</span>}
        </NavLink>

        {/* Workflow */}
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
            <span className="admin-sidebar__bullet">›</span>
            {isOpen && <span>Workflow</span>}
          </span>
          {isOpen && (
            <span className="admin-sidebar__caret">
              {openWorkflow ? "▾" : "▸"}
            </span>
          )}
        </button>

        {isOpen && openWorkflow && (
          <div className="admin-sidebar__submenu">
            <NavLink
              to="/admin/workflow?tab=board"
              className={
                isBoardActive
                  ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                  : "admin-sidebar__sublink"
              }
            >
              📋 Công việc
            </NavLink>
            <NavLink
              to="/admin/workflow?tab=history"
              className={
                isHistoryActive
                  ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                  : "admin-sidebar__sublink"
              }
            >
              ✓ Lịch sử
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
}
