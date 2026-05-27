import React from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";

/**
 * FeedFilter Component - Bộ lọc và sắp xếp feed
 */
export default function FeedFilter() {
  return (
    <div className="flex items-center justify-between py-3">
      {/* Left - Filter */}
      <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
        <span>Tất cả</span>
        <ChevronDown size={16} />
      </button>

      {/* Right - Sort */}
      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
        <span>Sắp xếp:</span>
        <span className="font-semibold">Hoạt động mới</span>
        <ArrowUpDown size={16} />
      </button>
    </div>
  );
}
