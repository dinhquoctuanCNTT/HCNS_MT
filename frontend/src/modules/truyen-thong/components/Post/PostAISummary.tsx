import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";

interface PostAISummaryProps {
  summary: string;
}

/**
 * PostAISummary Component - AI Summary Box
 * Viền xanh dương, nền xanh nhạt, có nút đóng
 */
export default function PostAISummary({ summary }: PostAISummaryProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative border border-blue-300 bg-blue-50 rounded-lg p-4 mb-3">
      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full 
                   flex items-center justify-center transition-colors
                   hover:bg-blue-100"
        aria-label="Đóng tóm tắt"
      >
        <X size={14} className="text-blue-400" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-blue-500 fill-blue-500" />
        <span className="text-sm font-semibold text-blue-600">
          Tóm tắt bài viết
        </span>
      </div>

      {/* Summary Content */}
      <p className="text-sm leading-relaxed text-slate-600 pr-5 m-0">
        {summary}
      </p>
    </div>
  );
}
