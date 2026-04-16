import { WorkflowTask } from "../types/workflow.types";

function clean(value: string) {
  return value.trim().replace(/^"|"$/g, "");
}

export function applySimpleJql(issues: WorkflowTask[], jql: string) {
  const normalized = jql.trim();
  if (!normalized) return issues;

  // status = todo
  const statusMatch = normalized.match(/status\s*=\s*(.+)/i);
  if (statusMatch) {
    const value = clean(statusMatch[1]);
    return issues.filter((i) => i.status.toLowerCase() === value.toLowerCase());
  }

  // priority = high
  const priorityMatch = normalized.match(/priority\s*=\s*(.+)/i);
  if (priorityMatch) {
    const value = clean(priorityMatch[1]);
    return issues.filter(
      (i) => i.priority.toLowerCase() === value.toLowerCase(),
    );
  }

  // assignee = "Nguyen Van A"
  const assigneeMatch = normalized.match(/assignee\s*=\s*(.+)/i);
  if (assigneeMatch) {
    const value = clean(assigneeMatch[1]);
    return issues.filter(
      (i) => i.assignee.toLowerCase() === value.toLowerCase(),
    );
  }

  // type = task
  const typeMatch = normalized.match(/type\s*=\s*(.+)/i);
  if (typeMatch) {
    const value = clean(typeMatch[1]);
    return issues.filter((i) => i.type.toLowerCase() === value.toLowerCase());
  }

  // text ~ keyword
  const textMatch = normalized.match(/text\s*~\s*(.+)/i);
  if (textMatch) {
    const value = clean(textMatch[1]).toLowerCase();

    return issues.filter(
      (i) =>
        i.title.toLowerCase().includes(value) ||
        i.description.toLowerCase().includes(value) ||
        i.key.toLowerCase().includes(value),
    );
  }

  return issues;
}
