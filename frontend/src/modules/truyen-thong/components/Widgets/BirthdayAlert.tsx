import React from "react";
import { Gift, ChevronDown } from "lucide-react";

/**
 * BirthdayAlert Component - Thông báo sinh nhật
 */
export default function BirthdayAlert() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          {/* Gift Icon */}
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Gift size={20} className="text-amber-500" />
          </div>

          {/* Text */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">Sinh nhật</span>
            <span className="text-sm font-semibold text-blue-600">Hôm nay</span>
            <ChevronDown size={16} className="text-blue-600" />
          </div>
        </div>

        {/* Right Side */}
        <span className="text-sm text-gray-500">Không có sinh nhật</span>
      </div>
    </div>
  );
}
