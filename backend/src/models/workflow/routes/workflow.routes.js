import express from "express";
import * as workflowController from "../controllers/workflow.controller.js";
import * as taskController from "../controllers/task.controller.js";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import {
  requireRole,
  requirePermission,
} from "../../../middlewares/role.middleware.js";

const router = express.Router();

// ==================== PROJECTS ====================
// Tất cả đã đăng nhập đều xem được
router.get("/projects", authMiddleware, workflowController.getProjects);

// Tạo project: branch_manager trở lên
router.post(
  "/projects",
  authMiddleware,
  requirePermission("manage:projects"),
  workflowController.createProject,
);

router.get(
  "/projects/:projectId",
  authMiddleware,
  workflowController.getProjectDetail,
);

// Sửa/xóa project: branch_manager trở lên
router.put(
  "/projects/:projectId",
  authMiddleware,
  requirePermission("manage:projects"),
  workflowController.updateProject,
);
router.delete(
  "/projects/:projectId",
  authMiddleware,
  requireRole("admin", "director"),
  workflowController.deleteProject,
);

router.get(
  "/projects/:projectId/board",
  authMiddleware,
  workflowController.getProjectBoard,
);
router.get(
  "/projects/:projectId/members",
  workflowController.getProjectMembers,
);
router.get("/projects/:projectId/labels", workflowController.getProjectLabels);
router.get(
  "/projects/:projectId/statuses",
  workflowController.getProjectStatuses,
);
router.get(
  "/projects/:projectId/priorities",
  workflowController.getProjectPriorities,
);
router.get(
  "/projects/:projectId/task-types",
  workflowController.getProjectTaskTypes,
);

// ==================== PROJECT MEMBERS ====================
// Thêm/xóa/sửa member: department_head trở lên
router.post(
  "/projects/:projectId/members",
  authMiddleware,
  requirePermission("manage:departments"),
  workflowController.addProjectMember,
);
router.delete(
  "/projects/:projectId/members/:userId",
  authMiddleware,
  requirePermission("manage:departments"),
  workflowController.removeProjectMember,
);
router.patch(
  "/projects/:projectId/members/:userId",
  authMiddleware,
  requirePermission("manage:departments"),
  workflowController.updateProjectMemberRole,
);

// ==================== PROJECT LABELS ====================
router.post(
  "/projects/:projectId/labels",
  authMiddleware,
  requirePermission("manage:tasks"),
  workflowController.createProjectLabel,
);
router.delete(
  "/projects/:projectId/labels/:labelId",
  authMiddleware,
  requirePermission("manage:tasks"),
  workflowController.deleteProjectLabel,
);

// ==================== BOARD COLUMNS ====================
// Quản lý cột board: department_head trở lên
router.post(
  "/projects/:projectId/columns",
  authMiddleware,
  requirePermission("manage:tasks"),
  workflowController.createBoardColumn,
);
router.put(
  "/projects/:projectId/columns/:columnId",
  authMiddleware,
  requirePermission("manage:tasks"),
  workflowController.updateBoardColumn,
);
router.delete(
  "/projects/:projectId/columns/:columnId",
  authMiddleware,
  requirePermission("manage:tasks"),
  workflowController.deleteBoardColumn,
);

// ==================== TASKS ====================
// Tạo task: tất cả employee trở lên
router.post(
  "/tasks",
  authMiddleware,
  requirePermission("create:tasks"),
  taskController.createTask,
);
router.get("/tasks/:taskId", authMiddleware, taskController.getTaskDetail);
router.put(
  "/tasks/:taskId",
  authMiddleware,
  requirePermission("manage:tasks"),
  taskController.updateTask,
);
// Xóa task: department_head trở lên
router.delete(
  "/tasks/:taskId",
  authMiddleware,
  requirePermission("delete:tasks"),
  taskController.deleteTask,
);

// ==================== TASK ACTIONS ====================
// Move/reorder: employee có thể làm
router.patch("/tasks/:taskId/move", authMiddleware, taskController.moveTask);
router.patch(
  "/tasks/:taskId/reorder",
  authMiddleware,
  taskController.reorderTask,
);

// Assign: department_head trở lên
router.patch(
  "/tasks/:taskId/assignee",
  authMiddleware,
  requirePermission("assign:tasks"),
  taskController.updateTaskAssignee,
);
router.patch(
  "/tasks/:taskId/dates",
  authMiddleware,
  taskController.updateTaskDates,
);

// ==================== COMPLETE / ARCHIVE ====================
router.patch(
  "/tasks/:taskId/complete",
  authMiddleware,
  taskController.completeTask,
);
router.patch(
  "/tasks/:taskId/uncomplete",
  authMiddleware,
  taskController.uncompleteTask,
);
router.patch(
  "/tasks/:taskId/archive",
  authMiddleware,
  requirePermission("manage:tasks"),
  taskController.archiveTask,
);
router.patch(
  "/tasks/:taskId/unarchive",
  authMiddleware,
  requirePermission("manage:tasks"),
  taskController.unarchiveTask,
);

// ==================== SUBTASKS ====================
router.post(
  "/tasks/:taskId/subtasks",
  authMiddleware,
  requirePermission("create:tasks"),
  taskController.createSubTask,
);
router.get(
  "/tasks/:taskId/subtasks",
  authMiddleware,
  taskController.getSubTasks,
);

// ==================== TASK LABELS ====================
router.post(
  "/tasks/:taskId/labels",
  authMiddleware,
  taskController.addLabelToTask,
);
router.delete(
  "/tasks/:taskId/labels/:labelId",
  authMiddleware,
  taskController.removeLabelFromTask,
);

// ==================== COMMENTS & ACTIVITY ====================
router.get(
  "/tasks/:taskId/comments",
  authMiddleware,
  taskController.getTaskComments,
);
router.post(
  "/tasks/:taskId/comments",
  authMiddleware,
  taskController.addTaskComment,
);
router.get(
  "/tasks/:taskId/activity",
  authMiddleware,
  taskController.getTaskActivities,
);

// ==================== LỊCH SỬ CÔNG VIỆC ====================
router.get(
  "/projects/:projectId/tasks/completed",
  authMiddleware,
  taskController.getCompletedTasks,
);

export default router;
