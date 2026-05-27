import React, { useState } from "react";
import {
  LayoutTemplate,
  Newspaper,
  Lightbulb,
  Vote,
  Users,
  Bookmark,
  UserPlus,
  Plus,
} from "lucide-react";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  iconBgColor: string;
  iconColor: string;
  activeBgColor: string;
  activeTextColor: string;
}

export default function LeftSidebar() {
  const [activeMenu, setActiveMenu] = useState("Bảng tin");

  const menuItems: MenuItem[] = [
    {
      icon: LayoutTemplate,
      label: "Bảng tin",
      iconBgColor: "bg-blue-600",
      iconColor: "text-white",
      activeBgColor: "bg-blue-50",
      activeTextColor: "text-blue-700",
    },
    {
      icon: Newspaper,
      label: "Tin tức",
      iconBgColor: "bg-red-500",
      iconColor: "text-white",
      activeBgColor: "bg-red-50",
      activeTextColor: "text-red-700",
    },
    {
      icon: Lightbulb,
      label: "Sáng kiến",
      iconBgColor: "bg-amber-500",
      iconColor: "text-white",
      activeBgColor: "bg-amber-50",
      activeTextColor: "text-amber-700",
    },
    {
      icon: Vote,
      label: "Bình chọn",
      iconBgColor: "bg-green-500",
      iconColor: "text-white",
      activeBgColor: "bg-green-50",
      activeTextColor: "text-green-700",
    },
    {
      icon: Users,
      label: "Nhóm",
      iconBgColor: "bg-purple-500",
      iconColor: "text-white",
      activeBgColor: "bg-purple-50",
      activeTextColor: "text-purple-700",
    },
    {
      icon: Bookmark,
      label: "Đã lưu",
      iconBgColor: "bg-cyan-500",
      iconColor: "text-white",
      activeBgColor: "bg-cyan-50",
      activeTextColor: "text-cyan-700",
    },
    {
      icon: UserPlus,
      label: "Giới thiệu ứng viên",
      iconBgColor: "bg-indigo-500",
      iconColor: "text-white",
      activeBgColor: "bg-indigo-50",
      activeTextColor: "text-indigo-700",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* User Profile Card */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            ĐT
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">
              ĐINH QUỐC TUẤN
            </div>
            <div className="text-xs text-gray-500 truncate">Trang cá nhân</div>
          </div>
        </div>
      </div>

      {/* Menu Navigation Card */}
      <div className="bg-white rounded-xl p-2 shadow-sm">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.label;

          return (
            <button
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg
                transition-all duration-200 mb-0.5
                ${
                  isActive
                    ? `${item.activeBgColor} ${item.activeTextColor}`
                    : "hover:bg-gray-50 text-gray-700"
                }
              `}
            >
              {/* Icon with colored background */}
              <div
                className={`
                w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                ${isActive ? item.iconBgColor : item.iconBgColor}
              `}
              >
                <Icon size={18} className={item.iconColor} />
              </div>

              {/* Label */}
              <span
                className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* My Groups Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Nhóm của tôi
          </span>

          <button
            className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 
                     flex items-center justify-center transition-colors duration-200"
            title="Thêm nhóm mới"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
