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

export default function WorkflowCommentList({
  comments,
  loading,
  newComment,
  submitting,
  onNewCommentChange,
  onSubmit,
}: WorkflowCommentListProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      onSubmit();
    }
  };

  return (
    <div className="wf-comments">
      {/* Add comment */}
      <div className="wf-comments__add">
        <textarea
          className="wf-comments__input"
          placeholder="Add a comment... (Ctrl+Enter to submit)"
          value={newComment}
          onChange={(e) => onNewCommentChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
        />
        <button
          className="wf-btn wf-btn--primary wf-btn--sm"
          disabled={submitting || !newComment.trim()}
          onClick={onSubmit}
        >
          {submitting ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="wf-comments__loading">
          <div className="wf-spinner wf-spinner--sm" />
          <span>Loading comments...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="wf-comments__empty">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M8 8h24v20H22l-6 4v-4H8V8z"
              stroke="#D1D5DB"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
          <p>No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="wf-comments__list">
          {comments.map((comment, idx) => {
            const initials = (comment.user?.full_name ?? comment.author ?? "U")
              .split(" ")
              .map((w: string) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            return (
              <div key={comment.id ?? idx} className="wf-comment">
                <div className="wf-comment__avatar">
                  {comment.user?.avatar_url ? (
                    <img
                      src={comment.user.avatar_url}
                      alt=""
                      className="wf-detail__avatar"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="wf-comment__body">
                  <div className="wf-comment__meta">
                    <span className="wf-comment__author">
                      {comment.user?.full_name ?? comment.author ?? "User"}
                    </span>
                    {comment.created_at && (
                      <span className="wf-comment__time">
                        {formatDateTime(comment.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="wf-comment__content">{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
