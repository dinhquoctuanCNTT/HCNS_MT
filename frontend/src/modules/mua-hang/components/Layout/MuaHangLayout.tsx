import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GitBranch,
  CalendarCheck,
  ShoppingCart,
  Building2,
  FolderTree,
  BarChart3,
} from "lucide-react";
import "./MuaHangLayout.css";

/* ──────────────────────────────────────────────
   MENU ITEMS DEFINITION
   ────────────────────────────────────────────── */
interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "Tổng quan",
    icon: LayoutDashboard,
    path: "/mua-hang",
  },
  {
    id: "process",
    label: "Quy trình mua sắm",
    icon: GitBranch,
    path: "/mua-hang/quy-trinh",
  },
  {
    id: "plan",
    label: "Kế hoạch mua hàng",
    icon: CalendarCheck,
    path: "/mua-hang/ke-hoach",
  },
  {
    id: "orders",
    label: "Quản lý đơn hàng",
    icon: ShoppingCart,
    path: "/mua-hang/don-hang",
  },
  {
    id: "suppliers",
    label: "Quản lý nhà cung cấp",
    icon: Building2,
    path: "/mua-hang/nha-cung-cap",
  },
  {
    id: "categories",
    label: "Danh mục",
    icon: FolderTree,
    path: "/mua-hang/danh-muc",
  },
  {
    id: "reports",
    label: "Báo cáo",
    icon: BarChart3,
    path: "/mua-hang/bao-cao",
  },
];

/* ──────────────────────────────────────────────
   COMPONENT: MuaHangLayout
   ────────────────────────────────────────────── */
export const MuaHangLayout: React.FC = () => {
  const location = useLocation();

  /** Determine if a given menu path is currently active */
  const isActive = (path: string): boolean => {
    if (path === "/mua-hang") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="mua-hang-layout">
      {/* ── SIDEBAR ── */}
      <aside className="mua-hang-layout__sidebar">
        {/* Home Button — navigates back to /admin */}
        <div className="mua-hang-layout__home-section">
          <Link to="/admin" className="mua-hang-layout__home-btn" title="Quay về Trang chủ">
            <svg
              className="mua-hang-layout__home-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Pentagon house shape */}
              <path
                d="M12 3L3 10V21H10V15H14V21H21V10L12 3Z"
                fill="currentColor"
              />
            </svg>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="mua-hang-layout__nav">
          <ul className="mua-hang-layout__menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.id} className="mua-hang-layout__menu-item">
                  <Link
                    to={item.path}
                    className={`mua-hang-layout__menu-link${
                      active ? " mua-hang-layout__menu-link--active" : ""
                    }`}
                  >
                    <Icon
                      size={20}
                      className="mua-hang-layout__menu-icon"
                    />
                    <span className="mua-hang-layout__menu-text">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer — module label */}
        <div className="mua-hang-layout__sidebar-footer">
          <span className="mua-hang-layout__module-label">Phân hệ Mua hàng</span>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="mua-hang-layout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default MuaHangLayout;
