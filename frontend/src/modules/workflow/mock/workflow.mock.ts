import {
  WorkflowColumnData,
  WorkflowProject,
  WorkflowTask,
} from "../types/workflow.types";

export const workflowProjectMock: WorkflowProject = {
  id: "p1",
  name: "Beyond Gravity",
  key: "BG",
  boardName: "Development Board",
};

export const workflowTasksMock: WorkflowTask[] = [
  {
    id: "1",
    key: "BG-101",
    title: "Thiết kế lại giao diện Workflow theo Jira",
    description:
      "Xây dựng board UI, cột kanban, thẻ task, drawer issue detail.",
    type: "Story",
    priority: "Highest",
    assignee: "Nguyen Van A",
    reporter: "Admin",
    status: "todo",
    labels: ["ui", "workflow", "jira"],
    dueDate: "2026-04-10",
    comments: [
      {
        id: "c1",
        author: "Admin",
        content: "Ưu tiên phần board trước.",
        createdAt: "2026-04-01 08:30",
      },
    ],
    activities: [
      {
        id: "a1",
        message: "Issue created by Admin",
        createdAt: "2026-04-01 08:00",
      },
    ],
    order: 1,
  },
  {
    id: "2",
    key: "BG-102",
    title: "Tạo modal Create Task",
    description: "Cho phép tạo task nhanh ngay trên board.",
    type: "Task",
    priority: "High",
    assignee: "Tran Thi B",
    reporter: "Admin",
    status: "inprogress",
    labels: ["modal", "form"],
    dueDate: "2026-04-11",
    comments: [],
    activities: [
      {
        id: "a2",
        message: "Moved from To Do to In Progress",
        createdAt: "2026-04-01 10:15",
      },
    ],
    order: 1,
  },
  {
    id: "3",
    key: "BG-103",
    title: "Xây dựng panel Issue Detail bên phải",
    description: "Click vào task card sẽ mở chi tiết issue dạng drawer.",
    type: "Task",
    priority: "Medium",
    assignee: "Le Van C",
    reporter: "Admin",
    status: "review",
    labels: ["detail", "drawer"],
    dueDate: "2026-04-12",
    comments: [
      {
        id: "c2",
        author: "Le Van C",
        content: "Đã hoàn thành phần hiển thị comment.",
        createdAt: "2026-04-01 14:10",
      },
    ],
    activities: [],
    order: 1,
  },
  {
    id: "4",
    key: "BG-104",
    title: "Hoàn thiện style card và column",
    description: "Đồng bộ spacing, border, typography giống Jira.",
    type: "Bug",
    priority: "Low",
    assignee: "Pham Van D",
    reporter: "Admin",
    status: "done",
    labels: ["css", "style"],
    dueDate: "2026-04-08",
    comments: [],
    activities: [
      {
        id: "a4",
        message: "Issue resolved",
        createdAt: "2026-04-01 16:30",
      },
    ],
    order: 1,
  },
];

export const workflowColumnsMock = (
  tasks: WorkflowTask[],
): WorkflowColumnData[] => {
  const sortTasks = (items: WorkflowTask[]) =>
    [...items].sort((a, b) => a.order - b.order);

  return [
    {
      id: "todo",
      title: "TO DO",
      tasks: sortTasks(tasks.filter((task) => task.status === "todo")),
    },
    {
      id: "inprogress",
      title: "IN PROGRESS",
      tasks: sortTasks(tasks.filter((task) => task.status === "inprogress")),
    },
    {
      id: "review",
      title: "IN REVIEW",
      tasks: sortTasks(tasks.filter((task) => task.status === "review")),
    },
    {
      id: "done",
      title: "DONE",
      tasks: sortTasks(tasks.filter((task) => task.status === "done")),
    },
  ];
};
