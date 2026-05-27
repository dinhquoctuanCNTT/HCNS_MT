import React from "react";
import { Workflow, Play, Plus } from "lucide-react";

/**
 * QuickActions Component - 3 nút hành động nhanh
 * Nút 1 & 2: Quy trình (màu xanh dương)
 * Nút 3: Tùy chỉnh (viền xám)
 */
export default function QuickActions() {
  const actions = [
    {
      icon: Workflow,
      label: "Quy trình",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverBg: "hover:bg-blue-100",
    },
    {
      icon: Play,
      label: "Chạy quy trình",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverBg: "hover:bg-blue-100",
    },
    {
      icon: Plus,
      label: "Tùy chỉnh",
      bgColor: "bg-white",
      iconColor: "text-gray-600",
      hoverBg: "hover:bg-gray-50",
      border: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex gap-2 justify-center">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <React.Fragment key={action.label}>
              <button
                className={`
                  flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                  transition-all duration-200 flex-1
                  ${action.bgColor} ${action.iconColor} ${action.hoverBg}
                  ${action.border ? "border border-gray-200" : ""}
                `}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{action.label}</span>
              </button>

              {/* Divider between buttons */}
              {index < actions.length - 1 && (
                <div className="w-px bg-gray-200 self-stretch" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
