export type WorkflowPriority = "Lowest" | "Low" | "Medium" | "High" | "Highest";
export type WorkflowIssueType = "Task" | "Bug" | "Story";
export type WorkflowStatus = "todo" | "inprogress" | "review" | "done";

export interface WorkflowComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface WorkflowActivity {
  id: string;
  message: string;
  createdAt: string;
}

export interface WorkflowTask {
  id: string;
  // FIX: đổi `key` → `task_key` cho khớp với API response
  // field `key` cũ chỉ dùng trong mock data, backend trả về `task_key`
  task_key: string;
  title: string;
  description: string;
  type: WorkflowIssueType;
  priority: WorkflowPriority;
  assignee: string;
  reporter: string;
  status: WorkflowStatus;
  labels: string[] | { name: string; color?: string }[];
  dueDate?: string;
  projectId?: string;
  components?: string[];
  affectsVersions?: string[];
  fixVersions?: string[];
  comments: WorkflowComment[];
  activities: WorkflowActivity[];
  order: number;
}

export interface WorkflowColumnData {
  id: WorkflowStatus;
  title: string;
  tasks: WorkflowTask[];
}

export interface WorkflowProject {
  id: string;
  name: string;
  // FIX: thêm cả task_key lẫn key để tương thích ngược nếu có chỗ dùng key
  task_key: string;
  key?: string;
  boardName: string;
}
