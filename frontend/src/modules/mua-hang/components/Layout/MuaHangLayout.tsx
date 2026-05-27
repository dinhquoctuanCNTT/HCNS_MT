import { Link, Outlet } from "react-router-dom";
import {
  Award,
  Bell,
  FileText,
  Grid,
  HelpCircle,
  Home,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  User,
} from "lucide-react";
import "./MuaHangLayout.css";

/**
 * Layout component for the "Mua hàng" (Purchasing) module.
 * Implements the MISA AMIS design using plain CSS and BEM naming.
 */
export const MuaHangLayout = () => {
  return (
    <div className="amis-layout">
      {/* ---- Top Header ---- */}
      <header className="amis-top-header">
        <div className="amis-top-header__left">
          {/* App switcher (grid icon) */}
          <Grid className="amis-top-header__app-switcher" size={20} />

          {/* Logo */}
          <div className="amis-top-header__logo">
            <span className="amis-top-header__logo-text">M</span>
          </div>

          {/* Module title */}
          <h1 className="amis-top-header__title">Mua hàng</h1>

          {/* Company name with chevron */}
          <div className="amis-top-header__company">
            <span>Công ty cổ phần Đại Việt</span>
            <svg
              className="amis-top-header__chevron"
              viewBox="0 0 10 6"
              width="10"
              height="6"
              aria-hidden="true"
            >
              <path d="M0 0l5 6 5-6" fill="none" stroke="currentColor" />
            </svg>
          </div>
        </div>

        {/* Center – Search */}
        <div className="amis-top-header__center">
          <div className="amis-top-header__search">
            <Search className="amis-top-header__search-icon" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="amis-top-header__search-input"
            />
          </div>
        </div>

        {/* Right – utility icons */}
        <div className="amis-top-header__right">
          <Settings className="amis-top-header__icon" size={20} />
          <User className="amis-top-header__icon" size={20} />

          {/* Trò chuyện with red notification dot */}
          <div className="amis-top-header__icon-wrapper amis-top-header__icon-wrapper--message">
            <MessageSquare className="amis-top-header__icon" size={20} />
            <span className="amis-top-header__badge">20</span>
          </div>

          <Bell className="amis-top-header__icon" size={20} />
          <HelpCircle className="amis-top-header__icon" size={20} />
          <MoreHorizontal className="amis-top-header__icon" size={20} />
        </div>
      </header>

      {/* ---- Body (Sidebar + Content) ---- */}
      <div className="amis-body">
        {/* Sidebar */}
        <aside className="amis-sidebar">
          {/* Home button */}
          <Link to="/admin" className="amis-sidebar__home-btn">
            <Home className="amis-sidebar__home-icon" size={24} />
          </Link>

          {/* Navigation menu */}
          <nav className="amis-sidebar__nav">
            <Link
              to="/mua-hang/tong-quan"
              className="amis-sidebar__item amis-sidebar__item--active"
            >
              <Grid className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">Tổng quan</span>
            </Link>

            <Link to="/mua-hang/yeu-cau" className="amis-sidebar__item">
              <Search className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">Yêu cầu mua sắm</span>
            </Link>

            <Link to="/mua-hang/ke-hoach" className="amis-sidebar__item">
              <Settings className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">
                Kế hoạch mua hàng
              </span>
            </Link>

            <Link to="/mua-hang/quy-trinh" className="amis-sidebar__item">
              <MoreHorizontal className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">
                Mua theo quy trình
              </span>
            </Link>

            <Link to="/mua-hang/thoa-thuan" className="amis-sidebar__item">
              <HelpCircle className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">
                Mua theo thỏa thuận
              </span>
            </Link>

            <Link to="/mua-hang/chidinh" className="amis-sidebar__item">
              <Bell className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">
                Mua theo chỉ định
              </span>
            </Link>

            <Link to="/mua-hang/don-hang" className="amis-sidebar__item">
              <User className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">Quản lý đơn hàng</span>
            </Link>

            <Link to="/mua-hang/khuyen-mai" className="amis-sidebar__item">
              <Award className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">
                Quản lý khuyến mại
              </span>
            </Link>

            <Link to="/mua-hang/nha-cung-cap" className="amis-sidebar__item">
              <Home className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">
                Quản lý nhà cung cấp
              </span>
            </Link>

            <Link to="/mua-hang/danh-muc" className="amis-sidebar__item">
              <FileText className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">Danh mục</span>
            </Link>

            <Link to="/mua-hang/bao-cao" className="amis-sidebar__item">
              <FileText className="amis-sidebar__item-icon" size={20} />
              <span className="amis-sidebar__item-label">Báo cáo</span>
            </Link>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="amis-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MuaHangLayout;
