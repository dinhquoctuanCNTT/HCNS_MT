import React from "react";
import { Share2, Lightbulb, Newspaper, Vote } from "lucide-react";

/**
 * PostComposer Component - Ô đăng bài viết
 * Avatar + Input + 4 nút hành động
 */
export default function PostComposer() {
  const actions = [
    {
      icon: Share2,
      label: "Chia sẻ",
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      hoverBg: "hover:bg-blue-700",
      primary: true,
    },
    {
      icon: Lightbulb,
      label: "Sáng kiến",
      color: "text-amber-500",
      bgColor: "bg-white",
      hoverBg: "hover:bg-gray-50",
      primary: false,
    },
    {
      icon: Newspaper,
      label: "Tin tức",
      color: "text-red-500",
      bgColor: "bg-white",
      hoverBg: "hover:bg-gray-50",
      primary: false,
    },
    {
      icon: Vote,
      label: "Bình chọn",
      color: "text-green-500",
      bgColor: "bg-white",
      hoverBg: "hover:bg-gray-50",
      primary: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      {/* Top Row - Avatar & Input */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          ĐT
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Bạn muốn chia sẻ điều gì?"
          className="flex-1 px-4 py-3 rounded-full border border-gray-200 bg-gray-50 
                     text-sm outline-none transition-all duration-200
                     focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-4" />

      {/* Bottom Row - Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg
                transition-all duration-200 text-sm font-medium
                ${
                  action.primary
                    ? `${action.bgColor} text-white ${action.hoverBg}`
                    : `${action.bgColor} ${action.color} border border-gray-200 ${action.hoverBg}`
                }
              `}
            >
              <Icon size={18} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
