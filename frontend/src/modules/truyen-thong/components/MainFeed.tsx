import React from "react";
import QuickActions from "./Widgets/QuickActions";
import PostComposer from "./Post/PostComposer";
import BirthdayAlert from "./Widgets/BirthdayAlert";
import FeedFilter from "./Feed/FeedFilter";
import PostItem from "./Post/PostItem";
import { mockPosts } from "../utils/mockData";

/**
 * MainFeed Component - Cột giữa (Main Feed)
 * Chứa tất cả các component xếp dọc với gap-4
 */
export default function MainFeed() {
  return (
    <div className="flex flex-col gap-4">
      {/* Quick Actions */}
      <QuickActions />

      {/* Post Composer */}
      <PostComposer />

      {/* Birthday Alert */}
      <BirthdayAlert />

      {/* Feed Filter */}
      <FeedFilter />

      {/* Posts List */}
      {mockPosts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
