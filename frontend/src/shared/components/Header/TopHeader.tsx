import React from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Settings,
  UserPlus,
  MessageCircle,
  Bell,
  HelpCircle,
  MoreHorizontal,
  BookOpen,
  LayoutGrid,
  Newspaper,
  Users,
  Calculator,
  Briefcase,
  GraduationCap,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import HomeButton from "../HomeButton";
import "./TopHeader.css";

// Module configuration
interface ModuleConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  searchPlaceholder: string;
}

const getModuleConfig = (pathname: string): ModuleConfig => {
  if (pathname.includes("/truyen-thong") || pathname.includes("/mang-xa-hoi")) {
    return {
      name: "Mạng xã hội",
      icon: <Newspaper size={18} />,
      color: "#2563eb",
      searchPlaceholder: "Tìm kiếm tin tức, chia sẻ...",
    };
  }

  if (pathname.includes("/nhan-su")) {
    return {
      name: "Thông tin nhân sự",
      icon: <Users size={18} />,
      color: "#2563eb",
      searchPlaceholder: "Tìm kiếm nhân viên...",
    };
  }

  if (pathname.includes("/ke-toan")) {
    return {
      name: "Kế toán",
      icon: <Calculator size={18} />,
      color: "#2563eb",
      searchPlaceholder: "Tìm kiếm chứng từ, báo cáo...",
    };
  }

  if (pathname.includes("/workflow")) {
    return {
      name: "Quản lý công việc",
      icon: <Briefcase size={18} />,
      color: "#2563eb",
      searchPlaceholder: "Tìm kiếm công việc, dự án...",
    };
  }

  if (pathname.includes("/dao-tao")) {
    return {
      name: "Đào tạo",
      icon: <GraduationCap size={18} />,
      color: "#2563eb",
      searchPlaceholder: "Tìm kiếm khóa học...",
    };
  }

  if (pathname.includes("/ban-hang")) {
    return {
      name: "Bán hàng",
      icon: <TrendingUp size={18} />,
      color: "#2563eb",
      searchPlaceholder: "Tìm kiếm đơn hàng...",
    };
  }

  if (pathname.includes("/mua-hang")) {
    return {
      name: "Mua hàng",
      icon: <ShoppingCart size={18} />,
      color: "#2563eb",
      searchPlaceholder: "Tìm kiếm đơn mua...",
    };
  }

  return {
    name: "MISA AMIS",
    icon: <LayoutGrid size={18} />,
    color: "#2563eb",
    searchPlaceholder: "Tìm kiếm...",
  };
};

interface TopHeaderProps {
  onSearch?: (query: string) => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onSearch }) => {
  const location = useLocation();
  const moduleConfig = getModuleConfig(location.pathname);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <header className="misa-top-header">
      <div className="misa-header-container">
        {/* Left Section - Home Button & Module Info */}
        <div className="misa-header-left">
          {/* Home Button - Quay về trang chủ */}
          <HomeButton />

          {/* Module Info */}
          <div className="misa-module-info">
            <div
              className="misa-module-icon"
              style={{ backgroundColor: moduleConfig.color }}
            >
              {moduleConfig.icon}
            </div>
            <span className="misa-module-name">{moduleConfig.name}</span>
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="misa-header-center">
          <div className="misa-search-bar">
            <Search size={18} className="misa-search-icon" />
            <input
              type="text"
              placeholder={moduleConfig.searchPlaceholder}
              className="misa-search-input"
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Right Section - Tools & Avatar */}
        <div className="misa-header-right">
          <button className="misa-tool-btn" title="Cài đặt">
            <Settings size={20} />
          </button>

          <button className="misa-tool-btn" title="Thêm người">
            <UserPlus size={20} />
          </button>

          <button className="misa-tool-btn" title="Chat">
            <MessageCircle size={20} />
          </button>

          <button
            className="misa-tool-btn misa-notification-btn"
            title="Thông báo"
          >
            <Bell size={20} />
            <span className="misa-notification-badge">5</span>
          </button>

          <button className="misa-tool-btn" title="Trợ giúp">
            <HelpCircle size={20} />
          </button>

          <button className="misa-tool-btn" title="Thêm">
            <MoreHorizontal size={20} />
          </button>

          <button className="misa-tool-btn misa-training-btn" title="Đào tạo">
            <BookOpen size={20} />
          </button>

          {/* Avatar */}
          <div className="misa-user-avatar" title="Đình Tuấn">
            ĐT
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
