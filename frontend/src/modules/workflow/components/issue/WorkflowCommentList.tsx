import { useEffect, useRef } from "react";

interface WorkflowCommentListProps {
  taskId: number;
  comments: any[];
  loading: boolean;
  newComment: string;
  submitting: boolean;
  onNewCommentChange: (val: string) => void;
  onSubmit: () => void;
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return formatDateTime(dateStr);
}

export default function WorkflowCommentList({
  comments,
  loading,
  newComment,
  submitting,
  onNewCommentChange,
  onSubmit,
}: WorkflowCommentListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [comments.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      onSubmit();
    }
  };

  return (
    <div className="wf-chat-shell">
      <div className="wf-chat-header">
        <div>
          <div className="wf-chat-header__title">Trao đổi công việc</div>
          <div className="wf-chat-header__sub">
            Trao đổi nhanh như chat nhóm. Có thể mở rộng @mention sau.
          </div>
        </div>

        <div className="wf-chat-count">{comments.length} tin nhắn</div>
      </div>

      <div className="wf-chat-list" ref={listRef}>
        {loading ? (
          <div className="wf-chat-empty">Đang tải trao đổi...</div>
        ) : comments.length === 0 ? (
          <div className="wf-chat-empty">
            <div className="wf-chat-empty__icon">💬</div>
            <div className="wf-chat-empty__title">Chưa có trao đổi nào</div>
            <div className="wf-chat-empty__sub">
              Hãy bắt đầu bằng một tin nhắn để mọi người cùng theo dõi công
              việc.
            </div>
          </div>
        ) : (
          <div className="wf-chat-messages">
            {comments.map((comment, idx) => {
              const initials = (
                comment.user?.full_name ??
                comment.author ??
                "U"
              )
                .split(" ")
                .map((w: string) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              const authorName =
                comment.user?.full_name ?? comment.author ?? "User";

              return (
                <div key={comment.id ?? idx} className="wf-chat-msg">
                  <div className="wf-chat-msg__avatar">
                    {comment.user?.avatar_url ? (
                      <img
                        src={comment.user.avatar_url}
                        alt={authorName}
                        className="wf-chat-msg__avatar-img"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>

                  <div className="wf-chat-msg__content">
                    <div className="wf-chat-msg__meta">
                      <span className="wf-chat-msg__author">{authorName}</span>
                      {comment.created_at && (
                        <span
                          className="wf-chat-msg__time"
                          title={formatDateTime(comment.created_at)}
                        >
                          {formatRelative(comment.created_at)}
                        </span>
                      )}
                    </div>

                    <div className="wf-chat-msg__bubble">
                      <p className="wf-chat-msg__text">{comment.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="wf-chat-composer">
        <div className="wf-chat-composer__box">
          <textarea
            placeholder="Nhắn trao đổi công việc... dùng @tên để nhắc ai đó"
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="wf-chat-composer__input"
          />

          <div className="wf-chat-composer__footer">
            <div className="wf-chat-composer__hint">Ctrl + Enter để gửi</div>
            <button
              className="wf-btn wf-btn--primary wf-btn--sm"
              disabled={submitting || !newComment.trim()}
              onClick={onSubmit}
            >
              {submitting ? "Đang gửi..." : "Gửi tin nhắn"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
