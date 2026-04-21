import axiosClient from "../../../api/axiosClient";

export const workflowApi = {
  // project
  getProjects: () => axiosClient.get("/api/workflow/projects"),

  getProjectDetail: (projectId: number) =>
    axiosClient.get(`/api/workflow/projects/${projectId}`),

  createProject: (payload: Record<string, unknown>) =>
    axiosClient.post("/api/workflow/projects", payload),

  updateProject: (projectId: number, payload: Record<string, unknown>) =>
    axiosClient.put(`/api/workflow/projects/${projectId}`, payload),

  deleteProject: (projectId: number) =>
    axiosClient.delete(`/api/workflow/projects/${projectId}`),

  // board
  getBoard: (projectId: number, params?: Record<string, unknown>) =>
    axiosClient.get(`/api/workflow/projects/${projectId}/board`, { params }),

  // metadata
  getMembers: (projectId: number) =>
    axiosClient.get(`/api/workflow/projects/${projectId}/members`),

  getLabels: (projectId: number) =>
    axiosClient.get(`/api/workflow/projects/${projectId}/labels`),

  getStatuses: (projectId: number) =>
    axiosClient.get(`/api/workflow/projects/${projectId}/statuses`),

  getPriorities: (projectId: number) =>
    axiosClient.get(`/api/workflow/projects/${projectId}/priorities`),

  getTaskTypes: (projectId: number) =>
    axiosClient.get(`/api/workflow/projects/${projectId}/task-types`),

  // task
  createTask: (payload: Record<string, unknown>) =>
    axiosClient.post(`/api/workflow/tasks`, payload),

  getTaskDetail: (taskId: number) =>
    axiosClient.get(`/api/workflow/tasks/${taskId}`),

  updateTask: (taskId: number, payload: Record<string, unknown>) =>
    axiosClient.put(`/api/workflow/tasks/${taskId}`, payload),

  deleteTask: (taskId: number) =>
    axiosClient.delete(`/api/workflow/tasks/${taskId}`),

  moveTask: (taskId: number, payload: Record<string, unknown>) =>
    axiosClient.patch(`/api/workflow/tasks/${taskId}/move`, payload),

  reorderTask: (taskId: number, payload: Record<string, unknown>) =>
    axiosClient.patch(`/api/workflow/tasks/${taskId}/reorder`, payload),

  updateTaskAssignee: (taskId: number, payload: Record<string, unknown>) =>
    axiosClient.patch(`/api/workflow/tasks/${taskId}/assignee`, payload),

  updateTaskDates: (taskId: number, payload: Record<string, unknown>) =>
    axiosClient.patch(`/api/workflow/tasks/${taskId}/dates`, payload),

  createSubTask: (taskId: number, payload: Record<string, unknown>) =>
    axiosClient.post(`/api/workflow/tasks/${taskId}/subtasks`, payload),

  getSubTasks: (taskId: number) =>
    axiosClient.get(`/api/workflow/tasks/${taskId}/subtasks`),

  addTaskLabel: (taskId: number, payload: { labelId: number }) =>
    axiosClient.post(`/api/workflow/tasks/${taskId}/labels`, payload),

  removeTaskLabel: (taskId: number, labelId: number) =>
    axiosClient.delete(`/api/workflow/tasks/${taskId}/labels/${labelId}`),

  // comment / activity
  getComments: (taskId: number) =>
    axiosClient.get(`/api/workflow/tasks/${taskId}/comments`),

  addComment: (taskId: number, payload: { content: string }) =>
    axiosClient.post(`/api/workflow/tasks/${taskId}/comments`, payload),

  getActivities: (taskId: number) =>
    axiosClient.get(`/api/workflow/tasks/${taskId}/activity`),

  // column
  createColumn: (projectId: number, payload: Record<string, unknown>) =>
    axiosClient.post(`/api/workflow/projects/${projectId}/columns`, payload),

  updateColumn: (
    projectId: number,
    columnId: number,
    payload: Record<string, unknown>,
  ) =>
    axiosClient.put(
      `/api/workflow/projects/${projectId}/columns/${columnId}`,
      payload,
    ),

  getCompletedTasks: (projectId: number) =>
    axiosClient.get(`/api/workflow/projects/${projectId}/tasks/completed`),

  deleteColumn: (projectId: number, columnId: number) =>
    axiosClient.delete(
      `/api/workflow/projects/${projectId}/columns/${columnId}`,
    ),

  completeTask: (taskId: number, payload: any) => {
    return axiosClient.patch(`/api/workflow/tasks/${taskId}/complete`, payload);
  },

  uncompleteTask: (taskId: number) =>
    axiosClient.patch(`/api/workflow/tasks/${taskId}/uncomplete`),

  archiveTask: (taskId: number) =>
    axiosClient.patch(`/api/workflow/tasks/${taskId}/archive`),

  unarchiveTask: (taskId: number) =>
    axiosClient.patch(`/api/workflow/tasks/${taskId}/unarchive`),

  // attachments
  getAttachments: (taskId: number) =>
    axiosClient.get(`/api/workflow/tasks/${taskId}/attachments`),

  // ✅ FIX: tạo FormData mới, append type TRƯỚC file để multer đọc đúng thứ tự
  uploadAttachment: (
    taskId: number | undefined,
    formData: FormData,
    attachmentType: "assignment" | "report" = "report",
  ) => {
    const fd = new FormData();
    fd.append("attachment_type", attachmentType); // ← type TRƯỚC
    const file = formData.get("file");
    if (file) fd.append("file", file); // ← file SAU
    return axiosClient.post(`/api/workflow/tasks/${taskId}/attachments`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteAttachment: (taskId: number | undefined, attachmentId: number) =>
    axiosClient.delete(
      `/api/workflow/tasks/${taskId}/attachments/${attachmentId}`,
    ),

  // checklist
  getChecklists: (taskId: number) =>
    axiosClient.get(`/api/workflow/tasks/${taskId}/checklists`),

  createChecklist: (
    taskId: number,
    payload: { title: string; position?: number },
  ) => axiosClient.post(`/api/workflow/tasks/${taskId}/checklists`, payload),

  updateChecklist: (
    taskId: number,
    checklistId: number,
    payload: { title: string; is_done: boolean },
  ) =>
    axiosClient.put(
      `/api/workflow/tasks/${taskId}/checklists/${checklistId}`,
      payload,
    ),

  toggleChecklist: (taskId: number, checklistId: number, is_done: boolean) =>
    axiosClient.patch(
      `/api/workflow/tasks/${taskId}/checklists/${checklistId}/toggle`,
      { is_done },
    ),

  deleteChecklist: (taskId: number, checklistId: number) =>
    axiosClient.delete(
      `/api/workflow/tasks/${taskId}/checklists/${checklistId}`,
    ),

  // multiple assignees
  getTaskAssignees: (taskId: number) =>
    axiosClient.get(`/api/workflow/tasks/${taskId}/assignees`),

  addTaskAssignee: (taskId: number, userId: number) =>
    axiosClient.post(`/api/workflow/tasks/${taskId}/assignees`, { userId }),

  removeTaskAssignee: (taskId: number, userId: number) =>
    axiosClient.delete(`/api/workflow/tasks/${taskId}/assignees/${userId}`),

  // dependencies
  getDependencies: (taskId: number) =>
    axiosClient.get(`/api/workflow/tasks/${taskId}/dependencies`),

  addDependency: (taskId: number, dependsOnId: number) =>
    axiosClient.post(`/api/workflow/tasks/${taskId}/dependencies`, {
      dependsOnId,
    }),

  removeDependency: (taskId: number, dependsOnId: number) =>
    axiosClient.delete(
      `/api/workflow/tasks/${taskId}/dependencies/${dependsOnId}`,
    ),
};
