import React, { useState } from "react";
import {
  RefreshCw,
  Play,
  Plus,
  Share2,
  Lightbulb,
  Newspaper,
  BarChart3,
  Gift,
  ChevronDown,
  ArrowUpDown,
  Globe,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  X,
  Sparkles,
} from "lucide-react";
import "./MainFeed.css";

// Mock Data
const mockPosts = [
  {
    id: 1,
    author: {
      name: "ĐỖ THANH TÙNG",
      avatar: "ĐT",
      avatarColor: "pink",
    },
    timeAgo: "2 tuần trước",
    content:
      "Chúc mừng năm mới 2025! Chúc tất cả mọi người một năm mới tràn đầy sức khỏe, hạnh phúc và thành công. Hãy cùng nhau tạo nên những kỷ niệm đẹp và đạt được những mục tiêu mới trong năm tới!",
    hasAISummary: true,
    aiSummary:
      "Bài viết chúc mừng năm mới 2025, gửi lời chúc sức khỏe, hạnh phúc và thành công đến mọi người. Khuyến khích tạo kỷ niệm đẹp và đạt mục tiêu mới.",
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    author: {
      name: "NGUYỄN VĂN AN",
      avatar: "NA",
      avatarColor: "blue",
    },
    timeAgo: "3 ngày trước",
    content:
      "Hôm nay team mình đã hoàn thành dự án lớn sau 6 tháng làm việc không ngừng nghỉ. Cảm ơn tất cả các thành viên đã cống hiến hết mình. Đây là một cột mốc quan trọng trong sự nghiệp của chúng ta!",
    hasAISummary: false,
    likes: 45,
    comments: 12,
    shares: 5,
  },
  {
    id: 3,
    author: {
      name: "TRẦN THỊ MAI",
      avatar: "TM",
      avatarColor: "purple",
    },
    timeAgo: "1 tuần trước",
    content:
      "Chia sẻ một số tips để tăng năng suất làm việc: 1) Lập kế hoạch từ đầu ngày, 2) Tập trung vào một việc tại một thời điểm, 3) Nghỉ ngơi đúng cách, 4) Học hỏi không ngừng. Hy vọng hữu ích cho mọi người!",
    hasAISummary: true,
    aiSummary:
      "Bài viết chia sẻ 4 tips tăng năng suất: lập kế hoạch, tập trung, nghỉ ngơi đúng cách và học hỏi liên tục.",
    likes: 67,
    comments: 23,
    shares: 15,
  },
];

export const MainFeed: React.FC = () => {
  const [showAISummary, setShowAISummary] = useState<{
    [key: number]: boolean;
  }>({
    1: true,
    3: true,
  });

  const toggleAISummary = (postId: number) => {
    setShowAISummary((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="main-feed-container">
      {/* 1. Quick Actions Card */}
      <div className="card quick-actions-card">
        <div className="quick-actions">
          <button className="action-button">
            <div className="action-icon-circle blue">
              <RefreshCw size={24} />
            </div>
            <div className="action-text">
              <div className="action-title">Quy trình</div>
              <div className="action-subtitle">Xem quy trình</div>
            </div>
          </button>

          <button className="action-button">
            <div className="action-icon-circle blue">
              <Play size={24} />
            </div>
            <div className="action-text">
              <div className="action-title">Chạy quy trình</div>
              <div className="action-subtitle">Bắt đầu ngay</div>
            </div>
          </button>

          <button className="action-button">
            <div className="action-icon-circle dashed">
              <Plus size={24} />
            </div>
            <div className="action-text">
              <div className="action-title">Tùy chỉnh</div>
              <div className="action-subtitle">Cá nhân hóa</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Post Composer Card */}
      <div className="card post-composer-card">
        <div className="composer-input-area">
          <div className="avatar yellow">BẠN</div>
          <input
            type="text"
            placeholder="Bạn đang nghĩ gì?"
            className="composer-input"
          />
        </div>

        <div className="divider"></div>

        <div className="composer-actions">
          <button className="composer-btn primary">
            <Share2 size={16} />
            Chia sẻ
          </button>
          <button className="composer-btn">
            <Lightbulb size={16} />
            Sáng kiến
          </button>
          <button className="composer-btn">
            <Newspaper size={16} />
            Tin tức
          </button>
          <button className="composer-btn">
            <BarChart3 size={16} />
            Bình chọn
          </button>
        </div>
      </div>

      {/* 3. Birthday Alert Card */}
      <div className="card birthday-card">
        <div className="birthday-left">
          <Gift size={20} className="gift-icon" />
          <span className="birthday-title">Sinh nhật</span>
          <button className="birthday-today">
            Hôm nay
            <ChevronDown size={16} />
          </button>
        </div>
        <span className="birthday-empty">Không có sinh nhật</span>
      </div>

      {/* 4. Filter Bar */}
      <div className="filter-bar">
        <button className="filter-btn">
          Tất cả
          <ChevronDown size={16} />
        </button>
        <button className="filter-btn">
          Sắp xếp: <span className="filter-active">Hoạt động mới</span>
          <ArrowUpDown size={16} />
        </button>
      </div>

      {/* 5. Post Items */}
      {mockPosts.map((post) => (
        <div key={post.id} className="card post-card">
          {/* Post Header */}
          <div className="post-header">
            <div className="post-author">
              <div className={`avatar ${post.author.avatarColor}`}>
                {post.author.avatar}
              </div>
              <div className="author-info">
                <span className="author-name">{post.author.name}</span>
                <div className="post-meta">
                  <span>{post.timeAgo}</span>
                  <span>•</span>
                  <Globe size={12} />
                </div>
              </div>
            </div>
            <button className="more-btn">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* AI Summary */}
          {post.hasAISummary && showAISummary[post.id] && (
            <div className="ai-summary">
              <button
                onClick={() => toggleAISummary(post.id)}
                className="ai-close-btn"
              >
                <X size={16} />
              </button>
              <div className="ai-title">
                <Sparkles size={16} />
                Tóm tắt AI
              </div>
              <p className="ai-content">{post.aiSummary}</p>
            </div>
          )}

          {/* Post Content */}
          <p className="post-content">{post.content}</p>

          <div className="divider"></div>

          {/* Interaction Bar */}
          <div className="interaction-bar">
            <button className="interaction-btn">
              <ThumbsUp size={16} />
              <span>Thích ({post.likes})</span>
            </button>
            <button className="interaction-btn">
              <MessageCircle size={16} />
              <span>Bình luận ({post.comments})</span>
            </button>
            <button className="interaction-btn">
              <Share2 size={16} />
              <span>Chia sẻ ({post.shares})</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainFeed;
