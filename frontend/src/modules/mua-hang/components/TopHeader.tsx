import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  Search,
  Settings,
  MessageCircle,
  Bell,
  HelpCircle,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import './TopHeader.css';

export const TopHeader: React.FC = () => {
  return (
    <header className="top-header">
      {/* Left Section */}
      <div className="top-header__left">
        {/* Home button */}
        <Link to="/admin" className="top-header__home-btn">
          <Home size={20} className="top-header__home-icon" />
        </Link>
        {/* Grid switcher (9 dots) */}
        <LayoutGrid size={20} className="top-header__grid-icon" />
        {/* Logo */}
        <div className="top-header__logo" title="Mua hàng">
          <span className="top-header__logo-symbol">M</span>
        </div>
        {/* Module name */}
        <span className="top-header__module-name">Mua hàng</span>
        {/* Company name with dropdown arrow */}
        <div className="top-header__company">
          <span className="top-header__company-name">Công ty cổ phần Đại Việt</span>
          <ChevronDown size={14} className="top-header__company-arrow" />
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="top-header__center">
        <div className="top-header__search-wrapper">
          <Search size={16} className="top-header__search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="top-header__search-input"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="top-header__right">
        <Settings size={20} className="top-header__icon" />
        <div className="top-header__icon-wrapper">
          {/* Placeholder for additional utility icon */}
          <span className="top-header__placeholder-icon" />
        </div>
        <div className="top-header__icon-wrapper top-header__message-wrapper">
          <MessageCircle size={20} className="top-header__icon" />
          <span className="top-header__badge">20</span>
        </div>
        <Bell size={20} className="top-header__icon" />
        <HelpCircle size={20} className="top-header__icon" />
        <MoreHorizontal size={20} className="top-header__icon" />
        {/* Avatar */}
        <img
          src="/src/assets/avatar.png"
          alt="User avatar"
          className="top-header__avatar"
        />
      </div>
    </header>
  );
};
