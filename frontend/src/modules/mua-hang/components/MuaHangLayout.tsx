import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, Dashboard, FileSearch, Calendar, FlowChart, Handshake, Target, ShoppingBag, Tag, Truck, Layers, BarChart2 } from 'lucide-react';
import './MuaHangLayout.css';

// Define navigation items
const navItems = [
  { name: 'Tổng quan', path: '/admin/mua-hang', icon: 'Dashboard' },
  { name: 'Yêu cầu mua sắm', path: '/admin/mua-hang/yeu-cau', icon: 'FileSearch' },
  { name: 'Kế hoạch mua hàng', path: '/admin/mua-hang/ke-hoach', icon: 'Calendar' },
  { name: 'Mua theo quy trình', path: '/admin/mua-hang/quy-trinh', icon: 'FlowChart' },
  { name: 'Mua theo thỏa thuận', path: '/admin/mua-hang/thoa-thuan', icon: 'Handshake' },
  { name: 'Mua theo chỉ định', path: '/admin/mua-hang/chi-dinh', icon: 'Target' },
  { name: 'Quản lý đơn hàng', path: '/admin/mua-hang/don-hang', icon: 'ShoppingBag' },
  { name: 'Quản lý khuyến mại', path: '/admin/mua-hang/khuyen-mai', icon: 'Tag' },
  { name: 'Quản lý nhà cung cấp', path: '/admin/mua-hang/nha-cung-cap', icon: 'Truck' },
  { name: 'Danh mục', path: '/admin/mua-hang/danh-muc', icon: 'Layers' },
  { name: 'Báo cáo', path: '/admin/mua-hang/bao-cao', icon: 'BarChart2' },
];

// Helper to dynamically import icons
const IconMap: Record<string, JSX.Element> = {
  Dashboard: <Dashboard size={20} className="mua-hang-layout__nav-icon" />, 
  FileSearch: <FileSearch size={20} className="mua-hang-layout__nav-icon" />, 
  Calendar: <Calendar size={20} className="mua-hang-layout__nav-icon" />, 
  FlowChart: <FlowChart size={20} className="mua-hang-layout__nav-icon" />, 
  Handshake: <Handshake size={20} className="mua-hang-layout__nav-icon" />, 
  Target: <Target size={20} className="mua-hang-layout__nav-icon" />, 
  ShoppingBag: <ShoppingBag size={20} className="mua-hang-layout__nav-icon" />, 
  Tag: <Tag size={20} className="mua-hang-layout__nav-icon" />, 
  Truck: <Truck size={20} className="mua-hang-layout__nav-icon" />, 
  Layers: <Layers size={20} className="mua-hang-layout__nav-icon" />, 
  BarChart2: <BarChart2 size={20} className="mua-hang-layout__nav-icon" />, 
};

const Icon = ({ name }: { name: string }) => IconMap[name] || null;

export const MuaHangLayout: React.FC = () => {
  return (
    <div className="mua-hang-layout">
      {/* Header */}
      <header className="mua-hang-layout__header">
        <h1 className="mua-hang-layout__title">Mua Hàng</h1>
      </header>
      {/* Main Flex Container */}
      <div className="mua-hang-layout__body">
        {/* Sidebar */}
        <aside className="mua-hang-layout__sidebar">
          {/* Home button */}
          <Link to="/admin" className="mua-hang-layout__home-btn">
            <div className="mua-hang-layout__home-icon">
              <Home size={24} strokeWidth={2} />
            </div>
          </Link>
          {/* Navigation */}
          <nav className="mua-hang-layout__nav">
            <ul className="mua-hang-layout__nav-list">
              {navItems.map(item => (
                <li
                  key={item.path}
                  className={`mua-hang-layout__nav-item ${window.location.pathname === item.path ? 'mua-hang-layout__nav-item--active' : ''}`}
                >
                  <Link to={item.path} className="mua-hang-layout__nav-link">
                    <Icon name={item.icon} />
                    <span className="mua-hang-layout__nav-text">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        {/* Content */}
        <main className="mua-hang-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
