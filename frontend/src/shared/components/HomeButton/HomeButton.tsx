import React from "react";
import { Link } from "react-router-dom";

/**
 * HomeButton Component - Nút quay về trang chủ Portal
 * Thiết kế: Hình tròn với viền cyan, custom SVG icon ngôi nhà
 */
export default function HomeButton() {
  return (
    <Link
      to="/admin"
      className="group relative w-12 h-12 rounded-full border-2 border-[#00d0e6] bg-transparent 
                 flex items-center justify-center transition-all duration-300 
                 hover:bg-[#00d0e6]/10 hover:scale-110 hover:shadow-lg hover:shadow-[#00d0e6]/20"
      title="Quay về trang chủ"
    >
      {/* Custom Pentagon House Icon SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-110"
      >
        {/* Pentagon House Shape - Rounded corners */}
        <path
          d="M12 2.5L3 9.5V20C3 20.8284 3.67157 21.5 4.5 21.5H19.5C20.3284 21.5 21 20.8284 21 20V9.5L12 2.5Z"
          stroke="#00d0e6"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:stroke-[#00f0ff]"
        />

        {/* Simple Vertical Line Inside (Door) */}
        <path
          d="M12 14.5V19"
          stroke="#00d0e6"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="group-hover:stroke-[#00f0ff]"
        />
      </svg>
    </Link>
  );
}
