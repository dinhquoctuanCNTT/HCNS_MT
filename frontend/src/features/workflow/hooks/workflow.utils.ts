import { WorkflowStatus, WorkflowTask } from "../types/workflow.types";

export function filterWorkflowTasks(tasks: WorkflowTask[], keyword: string) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) return safeTasks;

  return safeTasks.filter((task) => {
    const labels = Array.isArray(task.labels) ? task.labels : [];

    return (
      (task.title ?? "").toLowerCase().includes(normalizedKeyword) ||
      (task.task_key ?? "").toLowerCase().includes(normalizedKeyword) ||
      (task.assignee ?? "").toLowerCase().includes(normalizedKeyword) ||
      (task.reporter ?? "").toLowerCase().includes(normalizedKeyword) ||
      labels.some((label) => {
        if (typeof label === "string") {
          return label.toLowerCase().includes(normalizedKeyword);
        }
        return (label?.name ?? "").toLowerCase().includes(normalizedKeyword);
      })
    );
  });
}

export function groupTasksByStatus(tasks: WorkflowTask[]) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return safeTasks.reduce<Record<string, WorkflowTask[]>>((acc, task) => {
    const status = task.status ?? "unknown";
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {});
}

export function countTasksByStatus(
  tasks: WorkflowTask[],
  status: WorkflowStatus,
) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  return safeTasks.filter((task) => task.status === status).length;
}

export function findTaskById(tasks: WorkflowTask[], taskId: string | number) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  return safeTasks.find((task) => String(task.id) === String(taskId)) ?? null;
}
