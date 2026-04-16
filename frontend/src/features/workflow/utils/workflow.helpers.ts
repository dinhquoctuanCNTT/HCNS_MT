export function getPriorityClass(priority: string) {
  switch (priority) {
    case "Highest":
      return "workflow-badge workflow-badge--danger";
    case "High":
      return "workflow-badge workflow-badge--warning";
    case "Medium":
      return "workflow-badge workflow-badge--info";
    case "Low":
      return "workflow-badge workflow-badge--success";
    default:
      return "workflow-badge";
  }
}
