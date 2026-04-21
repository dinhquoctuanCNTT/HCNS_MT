import { useEffect, useMemo, useRef, useState } from "react";
import { workflowApi } from "../../api/workflow.api";

interface Member {
  id: number;
  full_name: string;
  email?: string;
  avatar_url?: string;
}

interface Props {
  taskId: number;
  members: Member[];
  canEdit?: boolean;
}

function Avatar({ user, size = 28 }: { user: Member; size?: number }) {
  const initials = (user.full_name || "?")
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
        background: "#2563eb",
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
        <span style={{ fontSize: size * 0.38, fontWeight: 700, color: "#fff" }}>
          {initials}
        </span>
      )}
    </div>
  );
}

export default function WorkflowPrimaryAssignee({
  taskId,
  members,
  canEdit = true,
}: Props) {
  const [primaryAssignee, setPrimaryAssignee] = useState<Member | null>(null);
  const [allAssignees, setAllAssignees] = useState<Member[]>([]);
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
      .then((res: any) => {
        const assignees = res.data?.data ?? [];
        setAllAssignees(assignees);
        setPrimaryAssignee(assignees[0] ?? null);
      })
      .catch((err: any) => {
        console.error("Lỗi load assignees:", err);
      })
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

  const filtered = useMemo(() => {
    return members.filter((m) =>
      (m.full_name || m.email || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [members, search]);

  const handleSelectPrimary = async (member: Member) => {
    if (!canEdit) return;

    try {
      const exists = allAssignees.some(
        (a) => Number(a.id) === Number(member.id),
      );

      if (!exists) {
        const res: any = await workflowApi.addTaskAssignee(taskId, member.id);
        const assignees = res.data?.data ?? [];
        setAllAssignees(assignees);
      }

      setPrimaryAssignee(member);
      setOpen(false);
      setSearch("");
    } catch (err) {
      console.error("Lỗi chọn người phụ trách chính:", err);
    }
  };

  if (loading) return null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div className="wf-primary-card">
        {primaryAssignee ? (
          <div className="wf-primary-card__left">
            <Avatar user={primaryAssignee} size={32} />
            <div>
              <div className="wf-primary-card__name">
                {primaryAssignee.full_name}
              </div>
              <div className="wf-primary-card__sub">
                {primaryAssignee.email || "Người chịu trách nhiệm chính"}
              </div>
            </div>
          </div>
        ) : (
          <span className="wf-empty-text">Chưa có người phụ trách chính</span>
        )}

        {canEdit && (
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="wf-primary-card__btn"
          >
            {primaryAssignee ? "Đổi" : "Chọn"}
          </button>
        )}
      </div>

      {open && canEdit && (
        <div className="wf-primary-dropdown">
          <div className="wf-primary-dropdown__search">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm người phụ trách chính..."
              className="wf-primary-dropdown__input"
            />
          </div>

          <div className="wf-primary-dropdown__list">
            {filtered.length === 0 ? (
              <div className="wf-primary-dropdown__empty">Không tìm thấy</div>
            ) : (
              filtered.map((m) => {
                const selected = Number(primaryAssignee?.id) === Number(m.id);

                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectPrimary(m)}
                    className={`wf-primary-dropdown__item${selected ? " wf-primary-dropdown__item--active" : ""}`}
                  >
                    <Avatar user={m} size={28} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="wf-primary-dropdown__name">
                        {m.full_name}
                      </div>
                      <div className="wf-primary-dropdown__email">
                        {m.email}
                      </div>
                    </div>
                    {selected && (
                      <span className="wf-primary-dropdown__badge">Chính</span>
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
