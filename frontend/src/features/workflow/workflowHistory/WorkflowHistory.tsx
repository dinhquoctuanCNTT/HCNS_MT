import { useEffect, useState } from "react";
import { workflowApi } from "../api/workflow.api";
import "./workflow-complete.css";

interface CompletedTask {
  id: number;
  task_key: string;
  title: string;
  assignee_name?: string;
  assignee_avatar?: string;
  reporter_name?: string;
  status_name?: string;
  status_color?: string;
  priority_name?: string;
  priority_color?: string;
  task_type_name?: string;
  completed_at?: string;
}

interface Props {
  projectId: number;
  members: any[];
  statuses: any[];
}

const TASK_TYPE_SVG: Record<string, string> = {
  bug: `<svg viewBox="0 0 16 16" width="15" height="15" fill="#E5493A"><circle cx="8" cy="8" r="7"/><path stroke="white" stroke-width="1.5" stroke-linecap="round" d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5"/></svg>`,
  story: `<svg viewBox="0 0 16 16" width="15" height="15" fill="#63BA3C"><rect x="1" y="1" width="14" height="14" rx="2"/><path stroke="white" stroke-width="1.2" stroke-linecap="round" d="M4 8h8M4 5h8M4 11h5"/></svg>`,
  task: `<svg viewBox="0 0 16 16" width="15" height="15" fill="#4BADE8"><rect x="1" y="1" width="14" height="14" rx="2"/><path fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M4.5 8l2.5 2.5 4.5-5"/></svg>`,
};

function getTypeIcon(name?: string) {
  const key = (name ?? "").toLowerCase();
  for (const [k, v] of Object.entries(TASK_TYPE_SVG)) {
    if (key.includes(k)) return v;
  }
  return TASK_TYPE_SVG.task;
}

function getAvatarInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function WorkflowHistory({ projectId }: Props) {
  const [tasks, setTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const fetchCompleted = async () => {
    try {
      setLoading(true);
      const res = await workflowApi.getCompletedTasks(projectId);
      setTasks(res.data?.data ?? res.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleted();
    setPage(1);
  }, [projectId]);

  const filtered = tasks.filter(
    (t) =>
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.task_key.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignee_name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageNums = (() => {
    const arr: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) arr.push(i);
      else if (arr[arr.length - 1] !== "...") arr.push("...");
    }
    return arr;
  })();

  return (
    <div className="wfh">
      {/* ── Toolbar ── */}
      <div className="wfh__toolbar">
        <div className="wfh__toolbar-left">
          <div className="wfh__search-wrap">
            <svg
              className="wfh__search-icon"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="#8a94a6"
              strokeWidth="1.5"
            >
              <circle cx="6.5" cy="6.5" r="4.5" />
              <path d="M10 10l3 3" strokeLinecap="round" />
            </svg>
            <input
              className="wfh__search"
              placeholder="Search issues..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Completed count chip */}
          <span className="wfh__chip">
            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8l3.5 3.5L13 4.5" />
            </svg>
            {filtered.length} completed
          </span>
        </div>

        <div className="wfh__toolbar-right">
          <span className="wfh__count">
            {filtered.length === 0
              ? "No results"
              : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      {loading ? (
        <div className="wf-page-loading">
          <div className="wf-spinner" />
          <span>Đang tải...</span>
        </div>
      ) : (
        <>
          <div className="wfh__table-wrap">
            <table className="wfh__table">
              <thead>
                <tr>
                  <th className="wfh__th wfh__th--type">Type</th>
                  <th className="wfh__th wfh__th--key">Key</th>
                  <th className="wfh__th wfh__th--summary">Summary</th>
                  <th className="wfh__th wfh__th--assignee">Assignee</th>
                  <th className="wfh__th wfh__th--reporter">Reporter</th>
                  <th className="wfh__th wfh__th--status">Status</th>
                  <th className="wfh__th wfh__th--date">Completed</th>
                </tr>
              </thead>

              <tbody>
                {paginated.length === 0 ? (
                  <tr className="wfh__empty-row">
                    <td colSpan={7}>
                      <div className="wfh__empty">
                        <div className="wfh__empty-icon">
                          <svg
                            viewBox="0 0 40 40"
                            width="28"
                            height="28"
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="1.5"
                          >
                            <circle cx="20" cy="20" r="17" />
                            <path
                              d="M13 20l5 5 9-10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="wfh__empty-title">
                          Chưa có task nào hoàn thành
                        </div>
                        <div className="wfh__empty-sub">
                          Các task được đánh dấu Done sẽ xuất hiện ở đây
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((task, i) => (
                    <tr
                      key={task.id}
                      className={`wfh__row ${i % 2 !== 0 ? "wfh__row--alt" : ""}`}
                    >
                      {/* Type */}
                      <td className="wfh__td wfh__td--type">
                        <span
                          className="wfh__type-icon"
                          dangerouslySetInnerHTML={{
                            __html: getTypeIcon(task.task_type_name),
                          }}
                          title={task.task_type_name ?? "Task"}
                        />
                      </td>

                      {/* Key */}
                      <td className="wfh__td wfh__td--key">
                        <span className="wfh__key-link">{task.task_key}</span>
                      </td>

                      {/* Summary */}
                      <td className="wfh__td wfh__td--summary">
                        <span className="wfh__summary-text" title={task.title}>
                          {task.title}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="wfh__td wfh__td--assignee">
                        {task.assignee_name ? (
                          <div className="wfh__person">
                            <span className="wfh__avatar wfh__avatar--blue">
                              {getAvatarInitials(task.assignee_name)}
                            </span>
                            <span className="wfh__person-name">
                              {task.assignee_name}
                            </span>
                          </div>
                        ) : (
                          <span className="wfh__empty-val">—</span>
                        )}
                      </td>

                      {/* Reporter */}
                      <td className="wfh__td wfh__td--reporter">
                        {task.reporter_name ? (
                          <div className="wfh__person">
                            <span className="wfh__avatar wfh__avatar--green">
                              {getAvatarInitials(task.reporter_name)}
                            </span>
                            <span className="wfh__person-name">
                              {task.reporter_name}
                            </span>
                          </div>
                        ) : (
                          <span className="wfh__empty-val">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="wfh__td wfh__td--status">
                        {task.status_name ? (
                          <span
                            className="wfh__status"
                            style={{
                              background: `${task.status_color}18`,
                              color: task.status_color,
                              borderColor: `${task.status_color}44`,
                            }}
                          >
                            {task.status_name}
                          </span>
                        ) : (
                          <span className="wfh__empty-val">—</span>
                        )}
                      </td>

                      {/* Completed date */}
                      <td className="wfh__td wfh__td--date">
                        {task.completed_at ? (
                          <span className="wfh__date">
                            <svg
                              viewBox="0 0 14 14"
                              width="12"
                              height="12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                            >
                              <rect x="1" y="2" width="12" height="11" rx="2" />
                              <path d="M4 1v2M10 1v2M1 6h12" />
                            </svg>
                            {new Date(task.completed_at).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        ) : (
                          <span className="wfh__empty-val">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="wfh__pagination">
            <span className="wfh__page-info">
              {filtered.length === 0
                ? "No results"
                : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
            </span>

            <div className="wfh__pages">
              <button
                className="wfh__page-btn"
                disabled={page === 1 || totalPages === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹
              </button>

              {pageNums.map((p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="wfh__page-ellipsis">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`wfh__page-btn ${page === p ? "wfh__page-btn--active" : ""}`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                className="wfh__page-btn"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
