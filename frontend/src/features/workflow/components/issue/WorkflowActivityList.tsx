interface WorkflowActivityListProps {
  activities: any[];
  loading: boolean;
  statuses?: { id: number; name: string; color?: string }[];
  members?: { id: number; full_name: string }[];
  priorities?: { id: number; name: string }[];
}

const FIELD_LABELS: Record<string, string> = {
  title: "tiêu đề",
  description: "mô tả",
  assignee_id: "người thực hiện",
  priority_id: "độ ưu tiên",
  status_id: "trạng thái",
  dates: "ngày",
  label: "nhãn",
  sub_task: "sub-task",
  comment: "bình luận",
  position: "vị trí",
  task: "task",
};

function formatDateTime(dateStr: string) {
  if (!dateStr) return "";
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

// Thử parse JSON, nếu không được thì trả về string gốc
function tryParseJson(val: string): any {
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

// Format giá trị hiển thị thân thiện
function formatValue(
  fieldName: string,
  value: string | null,
  statuses?: any[],
  members?: any[],
  priorities?: any[],
): string {
  if (value === null || value === undefined || value === "") return "Trống";

  // status_id → tên status
  if (fieldName === "status_id") {
    const status =
      statuses?.find((s) => Number(s.id) === Number(value)) ?? null;
    return status?.name ?? `Status #${value}`;
  }

  // assignee_id → tên người
  if (fieldName === "assignee_id") {
    if (!value || value === "null") return "Chưa có";
    const member = members?.find((m) => Number(m.id) === Number(value));
    return member?.full_name ?? `User #${value}`;
  }

  // priority_id → tên priority
  if (fieldName === "priority_id") {
    if (!value || value === "null") return "Không có";
    const priority = priorities?.find((p) => Number(p.id) === Number(value));
    return priority?.name ?? `Priority #${value}`;
  }

  // dates → parse JSON { start_date, due_date }
  if (fieldName === "dates") {
    const parsed = tryParseJson(value);
    if (typeof parsed === "object") {
      const parts = [];
      if (parsed.start_date) parts.push(`Bắt đầu: ${parsed.start_date}`);
      if (parsed.due_date) parts.push(`Hạn: ${parsed.due_date}`);
      return parts.join(", ") || "Trống";
    }
  }

  // task field (UPDATE_TASK) → parse JSON { title, description }
  if (fieldName === "task") {
    const parsed = tryParseJson(value);
    if (typeof parsed === "object") {
      return parsed.title ?? value;
    }
  }

  // position → chỉ hiện số
  if (fieldName === "position") return `#${value}`;

  return value;
}

// Render từng loại activity
function renderActivity(
  activity: any,
  statuses?: any[],
  members?: any[],
  priorities?: any[],
) {
  const actionType = activity.action_type;
  const fieldName = activity.field_name ?? "";
  const oldVal = activity.old_value;
  const newVal = activity.new_value;

  // ẩn log position — không có nghĩa với người dùng
  if (fieldName === "position") return null;

  // CREATE_TASK
  if (actionType === "CREATE_TASK") {
    return <span className="wf-activity__action"> đã tạo task này</span>;
  }

  // DELETE_TASK
  if (actionType === "DELETE_TASK") {
    return <span className="wf-activity__action"> đã xóa task</span>;
  }

  // ADD_COMMENT
  if (actionType === "ADD_COMMENT") {
    return (
      <>
        <span className="wf-activity__action"> đã thêm bình luận</span>
        {newVal && (
          <div className="wf-activity__comment-preview">"{newVal}"</div>
        )}
      </>
    );
  }

  // MOVE_TASK — status thay đổi
  if (actionType === "MOVE_TASK" || fieldName === "status_id") {
    const from = formatValue(
      "status_id",
      oldVal,
      statuses,
      members,
      priorities,
    );
    const to = formatValue("status_id", newVal, statuses, members, priorities);
    return (
      <>
        <span className="wf-activity__action"> đã chuyển trạng thái</span>
        <div className="wf-activity__change">
          <span className="wf-activity__old">{from}</span>
          <span className="wf-activity__arrow">→</span>
          <span className="wf-activity__new">{to}</span>
        </div>
      </>
    );
  }

  // UPDATE_TASK — các field cụ thể
  if (actionType === "UPDATE_TASK") {
    // sub_task
    if (fieldName === "sub_task") {
      return (
        <>
          <span className="wf-activity__action"> đã thêm sub-task</span>
          {newVal && (
            <div className="wf-activity__comment-preview">"{newVal}"</div>
          )}
        </>
      );
    }

    // label
    if (fieldName === "label") {
      if (!oldVal && newVal) {
        return (
          <span className="wf-activity__action">
            {" "}
            đã thêm nhãn <strong>{newVal}</strong>
          </span>
        );
      }
      if (oldVal && !newVal) {
        return (
          <span className="wf-activity__action">
            {" "}
            đã xóa nhãn <strong>{oldVal}</strong>
          </span>
        );
      }
    }

    // title/description (field = "task", lưu JSON)
    if (fieldName === "task") {
      const oldParsed = tryParseJson(oldVal ?? "");
      const newParsed = tryParseJson(newVal ?? "");

      const titleChanged =
        typeof oldParsed === "object" &&
        typeof newParsed === "object" &&
        oldParsed.title !== newParsed.title;

      const descChanged =
        typeof oldParsed === "object" &&
        typeof newParsed === "object" &&
        oldParsed.description !== newParsed.description;

      return (
        <>
          {titleChanged && (
            <>
              <span className="wf-activity__action"> đã cập nhật tiêu đề</span>
              <div className="wf-activity__change">
                <span className="wf-activity__old">{oldParsed.title}</span>
                <span className="wf-activity__arrow">→</span>
                <span className="wf-activity__new">{newParsed.title}</span>
              </div>
            </>
          )}
          {descChanged && (
            <span className="wf-activity__action"> đã cập nhật mô tả</span>
          )}
          {!titleChanged && !descChanged && (
            <span className="wf-activity__action"> đã cập nhật task</span>
          )}
        </>
      );
    }

    // assignee, priority, dates
    const fieldLabel = FIELD_LABELS[fieldName] ?? fieldName;
    const from = formatValue(fieldName, oldVal, statuses, members, priorities);
    const to = formatValue(fieldName, newVal, statuses, members, priorities);

    return (
      <>
        <span className="wf-activity__action">
          {" "}
          đã cập nhật <strong>{fieldLabel}</strong>
        </span>
        {(oldVal || newVal) && (
          <div className="wf-activity__change">
            <span className="wf-activity__old">{from}</span>
            <span className="wf-activity__arrow">→</span>
            <span className="wf-activity__new">{to}</span>
          </div>
        )}
      </>
    );
  }

  // fallback
  return <span className="wf-activity__action"> {actionType}</span>;
}

export default function WorkflowActivityList({
  activities,
  loading,
  statuses = [],
  members = [],
  priorities = [],
}: WorkflowActivityListProps) {
  if (loading) {
    return (
      <div className="wf-activity__loading">
        <div className="wf-spinner wf-spinner--sm" />
        <span>Đang tải hoạt động...</span>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="wf-activity__empty">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" stroke="#D1D5DB" strokeWidth="1.5" />
          <path
            d="M20 12v8l4 4"
            stroke="#D1D5DB"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p>Chưa có hoạt động nào.</p>
      </div>
    );
  }

  // Lọc bỏ position logs trước khi render
  const filtered = activities.filter((a) => a.field_name !== "position");

  return (
    <div className="wf-activity">
      {filtered.map((activity, idx) => {
        const initials = (activity.full_name ?? activity.user?.full_name ?? "U")
          .split(" ")
          .map((w: string) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        const userName =
          activity.full_name ?? activity.user?.full_name ?? "User";
        const avatarUrl = activity.avatar_url ?? activity.user?.avatar_url;

        const content = renderActivity(activity, statuses, members, priorities);
        if (!content) return null;

        return (
          <div key={activity.id ?? idx} className="wf-activity__item">
            <div className="wf-activity__avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="wf-activity__content">
              <div className="wf-activity__line">
                <span className="wf-activity__user">{userName}</span>
                {content}
              </div>
              {activity.created_at && (
                <span className="wf-activity__time">
                  {formatDateTime(activity.created_at)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
