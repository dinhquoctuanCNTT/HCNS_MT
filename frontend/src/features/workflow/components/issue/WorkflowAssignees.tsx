import { useState, useEffect, useRef } from "react";
import { workflowApi } from "../../api/workflow.api";

interface Assignee {
  id: number;
  full_name: string;
  email?: string;
  avatar_url?: string;
}

interface Props {
  taskId: number;
  members: any[];
  canEdit?: boolean;
}

function Avatar({ user, size = 28 }: { user: Assignee; size?: number }) {
  const initials = user.full_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      title={user.full_name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        border: "2px solid #fff",
        background: "#0052cc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user.full_name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontSize: size * 0.4, fontWeight: 600, color: "#fff" }}>
          {initials}
        </span>
      )}
    </div>
  );
}

export default function WorkflowAssignees({
  taskId,
  members,
  canEdit = true,
}: Props) {
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    workflowApi
      .getTaskAssignees(taskId)
      .then((res: any) => setAssignees(res.data?.data ?? []))
      .catch((err: any) => console.error("Lỗi load assignees:", err))
      .finally(() => setLoading(false));
  }, [taskId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAssigned = (userId: number) => assignees.some((a) => a.id === userId);

  const handleToggle = async (member: any) => {
    if (!canEdit) return;
    try {
      if (isAssigned(member.id)) {
        await workflowApi.removeTaskAssignee(taskId, member.id);
        setAssignees((prev) => prev.filter((a) => a.id !== member.id));
      } else {
        const res: any = await workflowApi.addTaskAssignee(taskId, member.id);
        setAssignees(res.data?.data ?? []);
      }
    } catch (err) {
      console.error("Lỗi toggle assignee:", err);
    }
  };

  const filtered = members.filter((m) =>
    (m.full_name || m.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div className="wf-collab-wrap">
        {assignees.length > 0 ? (
          <>
            <div className="wf-collab-avatars">
              {assignees.slice(0, 5).map((a, i) => (
                <div
                  key={a.id}
                  style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }}
                >
                  <Avatar user={a} />
                </div>
              ))}
              {assignees.length > 5 && (
                <div className="wf-collab-more">+{assignees.length - 5}</div>
              )}
            </div>

            <div className="wf-collab-tags">
              {assignees.slice(0, 3).map((a) => (
                <span key={a.id} className="wf-collab-tag">
                  {a.full_name}
                </span>
              ))}
            </div>
          </>
        ) : (
          <span className="wf-empty-text">Chưa có người phối hợp</span>
        )}

        {canEdit && (
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="wf-collab-add"
            title="Thêm người phối hợp"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
          </button>
        )}
      </div>

      {open && canEdit && (
        <div className="wf-collab-dropdown">
          <div className="wf-collab-dropdown__search">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm người phối hợp..."
              className="wf-collab-dropdown__input"
            />
          </div>

          <div className="wf-collab-dropdown__list">
            {filtered.length === 0 ? (
              <div className="wf-collab-dropdown__empty">Không tìm thấy</div>
            ) : (
              filtered.map((m) => {
                const assigned = isAssigned(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => handleToggle(m)}
                    className={`wf-collab-dropdown__item${assigned ? " wf-collab-dropdown__item--active" : ""}`}
                  >
                    <Avatar
                      user={{
                        id: m.id,
                        full_name: m.full_name,
                        avatar_url: m.avatar_url,
                        email: m.email,
                      }}
                      size={26}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="wf-collab-dropdown__name">
                        {m.full_name}
                      </div>
                      <div className="wf-collab-dropdown__email">{m.email}</div>
                    </div>
                    {assigned && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="#0052cc"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M3 8l3.5 3.5L13 4" />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
