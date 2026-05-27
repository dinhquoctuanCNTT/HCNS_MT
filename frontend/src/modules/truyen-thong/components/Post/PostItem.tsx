import React from "react";
import {
  Globe,
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { IPost } from "../../types";
import PostAISummary from "./PostAISummary";

interface PostItemProps {
  post: IPost;
}

/**
 * PostItem Component - Bài viết chi tiết
 * Header + AI Summary + Content + Actions
 */
export default function PostItem({ post }: PostItemProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex gap-3 mb-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-base font-bold flex-shrink-0">
          {post.author.name.substring(0, 2).toUpperCase()}
        </div>

        {/* Author Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              {/* Author Name */}
              <div className="text-base font-bold text-blue-600 mb-0.5">
                {post.author.name}
              </div>

              {/* Time & Visibility */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>{post.createdAt}</span>
                <span>•</span>
                <Globe size={12} />
              </div>
            </div>

            {/* More Options */}
            <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {post.aiSummary && <PostAISummary summary={post.aiSummary} />}

      {/* Content */}
      <div className="text-sm leading-relaxed text-slate-700 mb-4">
        {post.content}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-4" />

      {/* Actions */}
      <div className="flex gap-2">
        {[
          {
            icon: ThumbsUp,
            label: "Thích",
            count: post.likes,
          },
          {
            icon: MessageCircle,
            label: "Bình luận",
            count: post.comments.length,
          },
          {
            icon: Share2,
            label: "Chia sẻ",
            count: 0,
          },
        ].map((action) => {
          const Icon = action.icon;
          const displayCount =
            typeof action.count === "number" ? action.count : 0;

          return (
            <button
              key={action.label}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 
                         rounded-lg text-sm font-medium text-slate-600
                         hover:bg-slate-100 transition-colors"
            >
              <Icon size={18} />
              <span>{action.label}</span>
              {displayCount > 0 && (
                <span className="text-xs text-slate-400">({displayCount})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
