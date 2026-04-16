import { BoardTask } from "../../hooks/useWorkflowBoard";

interface WorkflowTaskCardProps {
  task: BoardTask;
  onClick: () => void;
  isDragging?: boolean;
}

// Priority config với SVG icon chuẩn Jira
const PRIORITY_CONFIG: Record<
  string,
  { svg: string; color: string; label: string }
> = {
  highest: {
    color: "#CD1316",
    label: "Highest",
    svg: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
      <path d="M3.47 10.53a.75.75 0 0 0 1.06 0L8 7.06l3.47 3.47a.75.75 0 1 0 1.06-1.06l-4-4a.75.75 0 0 0-1.06 0l-4 4a.75.75 0 0 0 0 1.06Z"/>
      <path d="M3.47 6.53a.75.75 0 0 0 1.06 0L8 3.06l3.47 3.47a.75.75 0 1 0 1.06-1.06l-4-4a.75.75 0 0 0-1.06 0l-4 4a.75.75 0 0 0 0 1.06Z"/>
    </svg>`,
  },
  high: {
    color: "#E5493A",
    label: "High",
    svg: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
      <path d="M3.47 10.53a.75.75 0 0 0 1.06 0L8 7.06l3.47 3.47a.75.75 0 1 0 1.06-1.06l-4-4a.75.75 0 0 0-1.06 0l-4 4a.75.75 0 0 0 0 1.06Z"/>
    </svg>`,
  },
  medium: {
    color: "#E97F33",
    label: "Medium",
    svg: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
      <path d="M3 5.5A.5.5 0 0 1 3.5 5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 5.5Zm0 5A.5.5 0 0 1 3.5 10h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5Z"/>
    </svg>`,
  },
  low: {
    color: "#2D8738",
    label: "Low",
    svg: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
      <path d="M12.53 5.47a.75.75 0 0 0-1.06 0L8 8.94 4.53 5.47a.75.75 0 0 0-1.06 1.06l4 4a.75.75 0 0 0 1.06 0l4-4a.75.75 0 0 0 0-1.06Z"/>
    </svg>`,
  },
  lowest: {
    color: "#57A55A",
    label: "Lowest",
    svg: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
      <path d="M12.53 5.47a.75.75 0 0 0-1.06 0L8 8.94 4.53 5.47a.75.75 0 0 0-1.06 1.06l4 4a.75.75 0 0 0 1.06 0l4-4a.75.75 0 0 0 0-1.06Z"/>
      <path d="M12.53 1.47a.75.75 0 0 0-1.06 0L8 4.94 4.53 1.47a.75.75 0 0 0-1.06 1.06l4 4a.75.75 0 0 0 1.06 0l4-4a.75.75 0 0 0 0-1.06Z"/>
    </svg>`,
  },
};

// Task type icon + màu chuẩn Jira
const TASK_TYPE_CONFIG: Record<string, { svg: string; color: string }> = {
  bug: {
    color: "#E5493A",
    svg: `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <circle cx="8" cy="8" r="7"/>
      <path fill="white" d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  story: {
    color: "#63BA3C",
    svg: `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <rect x="1" y="1" width="14" height="14" rx="2"/>
      <path fill="white" d="M4 8h8M4 5h8M4 11h5" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`,
  },
  epic: {
    color: "#904EE2",
    svg: `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M8 1L14 15H2L8 1Z" rx="1"/>
    </svg>`,
  },
  task: {
    color: "#4BADE8",
    svg: `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <rect x="1" y="1" width="14" height="14" rx="2"/>
      <path fill="white" d="M4.5 8l2.5 2.5 4.5-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`,
  },
};

function getPriorityConfig(name?: string) {
  const key = (name ?? "").toLowerCase();
  return (
    PRIORITY_CONFIG[key] ?? {
      color: "#9CA3AF",
      label: "None",
      svg: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M3 5.5A.5.5 0 0 1 3.5 5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 5.5Zm0 5A.5.5 0 0 1 3.5 10h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5Z"/>
      </svg>`,
    }
  );
}

function getTaskTypeConfig(name?: string) {
  const key = (name ?? "").toLowerCase();
  for (const [k, v] of Object.entries(TASK_TYPE_CONFIG)) {
    if (key.includes(k)) return v;
  }
  return TASK_TYPE_CONFIG.task;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
}

function isOverdue(dateStr?: string | null) {
  if (!dateStr) return false;
  const due = new Date(dateStr);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
}

// Rút ngắn task_key: TASK-1775718042852 → TASK-...852
function shortenTaskKey(key: string) {
  if (!key) return "";
  // Nếu đúng format PROJECT-NUMBER và number dài > 8 ký tự → rút ngắn
  const parts = key.split("-");
  if (parts.length === 2 && parts[1].length > 8) {
    return `${parts[0]}-...${parts[1].slice(-4)}`;
  }
  return key;
}

// Tạo màu label dễ đọc — text tối trên nền nhạt
function getLabelStyle(color?: string) {
  const bg = color ?? "#F59E0B";
  return {
    background: bg,
    color: "#ffffff",
    borderColor: "transparent",
  };
}

export default function WorkflowTaskCard({
  task,
  onClick,
  isDragging = false,
}: WorkflowTaskCardProps) {
  const priority = getPriorityConfig(task.priority?.name);
  const typeConfig = getTaskTypeConfig(task.taskType?.name);
  const dueDate = formatDate(task.due_date);
  const overdue = isOverdue(task.due_date);
  const hasLabels = task.labels && task.labels.length > 0;
  const commentCount = task.comments?.length ?? 0;

  const avatarInitials = task.assignee?.full_name
    ? task.assignee.full_name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  return (
    <div
      className={`wf-card 
        ${isDragging ? "wf-card--dragging" : ""} 
        ${task.is_completed ? "wf-card--completed" : ""} 
        ${task.is_archived ? "wf-card--archived" : ""}
      `.trim()}
      onClick={onClick}
      title={task.title}
    >
      {/* Title */}
      <p className="wf-card__title">{task.title}</p>

      {/* Complete / Archive badges */}
      {(task.is_completed || task.is_archived) && (
        <div className="wf-card__badges">
          {task.is_completed && (
            <span className="wf-card__badge wf-card__badge--completed">
              {" "}
              Done
            </span>
          )}
          {task.is_archived && (
            <span className="wf-card__badge wf-card__badge--archived">
              {" "}
              Archived
            </span>
          )}
        </div>
      )}
      {/* Labels — giống Jira: pill màu với chữ hoa */}
      {hasLabels && (
        <div className="wf-card__labels">
          {task.labels.slice(0, 2).map((label) => (
            <span
              key={label.id}
              className="wf-card__label"
              style={getLabelStyle(label.color)}
            >
              {label.name}
            </span>
          ))}
          {task.labels.length > 2 && (
            <span className="wf-card__label wf-card__label--more">
              +{task.labels.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="wf-card__footer">
        <div className="wf-card__footer-left">
          {/* Task type icon — hình vuông màu như Jira */}
          <span
            className="wf-card__type-icon"
            style={{ color: typeConfig.color }}
            title={task.taskType?.name ?? "Task"}
            dangerouslySetInnerHTML={{ __html: typeConfig.svg }}
          />

          {/* Priority icon — mũi tên màu như Jira */}
          <span
            className="wf-card__priority"
            style={{ color: priority.color }}
            title={`Priority: ${task.priority?.name ?? "None"}`}
            dangerouslySetInnerHTML={{ __html: priority.svg }}
          />

          {/* Comment count — chỉ hiện nếu có */}
          {commentCount > 0 && (
            <span
              className="wf-card__comments"
              title={`${commentCount} comments`}
            >
              {commentCount}
            </span>
          )}
        </div>

        <div className="wf-card__footer-right">
          {/* Task key — rút ngắn nếu dùng timestamp */}
          {task.task_key && (
            <span className="wf-card__key" title={task.task_key}>
              {shortenTaskKey(task.task_key)}
            </span>
          )}

          {/* Due date */}
          {dueDate && (
            <span
              className={`wf-card__due ${overdue ? "wf-card__due--overdue" : ""}`}
              title={overdue ? "Quá hạn" : "Hạn hoàn thành"}
            >
              {dueDate}
            </span>
          )}

          {/* Assignee avatar */}
          {task.assignee && (
            <div className="wf-card__avatar" title={task.assignee.full_name}>
              {task.assignee.avatar_url ? (
                <img
                  src={task.assignee.avatar_url}
                  alt={task.assignee.full_name}
                  className="wf-card__avatar-img"
                />
              ) : (
                <span className="wf-card__avatar-initials">
                  {avatarInitials}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
