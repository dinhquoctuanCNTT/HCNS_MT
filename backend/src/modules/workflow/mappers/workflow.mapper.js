function mapTaskRow(row, labels = []) {
  return {
    id: row.id,
    project_id: row.project_id,
    board_id: row.board_id,
    task_key: row.task_key,
    title: row.title,
    description: row.description,
    status_id: row.status_id,
    priority: row.priority_id
      ? {
          id: row.priority_id,
          name: row.priority_name,
          color: row.priority_color,
        }
      : null,
    taskType: row.task_type_id
      ? {
          id: row.task_type_id,
          name: row.task_type_name,
          icon: row.task_type_icon,
        }
      : null,
    assignee: row.assignee_id
      ? {
          id: row.assignee_id,
          full_name: row.assignee_name,
          avatar_url: row.assignee_avatar,
        }
      : null,
    reporter: row.reporter_id
      ? { id: row.reporter_id, full_name: row.reporter_name }
      : null,
    parent_task_id: row.parent_task_id,
    start_date: row.start_date,
    due_date: row.due_date,
    // ── Completion ──────────────────────────────────
    is_completed: row.is_completed === true || row.is_completed === 1,
    completed_at: row.completed_at ?? null,
    // ── Archive ──────────────────────────────────────
    is_archived: row.is_archived === true || row.is_archived === 1,
    archived_at: row.archived_at ?? null,
    // ─────────────────────────────────────────────────
    position: row.position,
    labels,
  };
}

function mapBoardColumnRow(row, tasks = []) {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    wip_limit: row.wip_limit,
    status: {
      id: row.status_id,
      name: row.status_name,
      color: row.status_color,
    },
    tasks,
  };
}

export { mapTaskRow, mapBoardColumnRow };
