import * as taskRepository from "../repositories/task.repository.js";
import * as workflowRepository from "../repositories/workflow.repository.js";
import { mapTaskRow } from "../mappers/workflow.mapper.js";
import { validateMoveTaskPayload } from "../validators/workflow.validator.js";
import { ACTIVITY_ACTION } from "../constants/workflow.constants.js";

// ====================== PHÂN QUYỀN ======================
const ROLE_LEVEL = {
  admin: 5,
  director: 4,
  branch_manager: 3,
  department_head: 2,
  employee: 1,
};

function hasMinRole(user, minRole) {
  const userLevel = ROLE_LEVEL[user.role] ?? 0;
  const minLevel = ROLE_LEVEL[minRole] ?? 0;
  return userLevel >= minLevel;
}

function assertRole(user, minRole, message) {
  if (!hasMinRole(user, minRole)) {
    const err = new Error(
      message ?? "Bạn không có quyền thực hiện thao tác này",
    );
    err.status = 403;
    throw err;
  }
}

// ====================== CREATE ======================
async function createTask(payload, user) {
  // Tất cả đã đăng nhập đều tạo được task
  assertRole(user, "employee", "Bạn cần đăng nhập để tạo task");

  const project_id = payload.project_id ?? payload.projectId;
  const board_id = payload.board_id ?? payload.boardId;
  const status_id = payload.status_id ?? payload.statusId;
  const priority_id = payload.priority_id ?? payload.priorityId ?? null;
  const assignee_id = payload.assignee_id ?? payload.assigneeId ?? null;
  const start_date = payload.start_date ?? payload.startDate ?? null;
  const due_date = payload.due_date ?? payload.dueDate ?? null;
  const task_type_id = payload.task_type_id ?? payload.taskTypeId ?? null;
  const reporter_id =
    payload.reporter_id ?? payload.reporterId ?? Number(user.id);
  const title = payload.title?.trim();
  const description = payload.description ?? null;
  const label_id = payload.label_id ?? null;
  const parent_task_id = payload.parent_id ?? payload.parentTaskId ?? null;

  const errors = [];
  if (!project_id) errors.push("project_id là bắt buộc");
  if (!board_id) errors.push("board_id là bắt buộc");
  if (!status_id) errors.push("status_id là bắt buộc");
  if (!title) errors.push("title là bắt buộc");
  if (errors.length) throw new Error(errors.join(", "));

  const project = await workflowRepository.findProjectById(project_id);
  if (!project) throw new Error(`Project ID ${project_id} không tồn tại`);

  const taskCount =
    await taskRepository.findLastTaskNumberByProject(project_id);
  const task_key = `${project.code}-${taskCount + 1}`;

  const maxPosition = await taskRepository.findMaxTaskPositionByStatus(
    project_id,
    board_id,
    status_id,
  );
  const position = maxPosition + 1;

  const newTask = await taskRepository.createTask({
    project_id,
    board_id,
    status_id,
    priority_id,
    assignee_id,
    reporter_id,
    title,
    description,
    start_date,
    due_date,
    position,
    task_type_id,
    task_key,
  });

  if (parent_task_id) {
    await taskRepository.updateTask(newTask.id, {
      title: newTask.title,
      description: newTask.description,
      task_type_id: newTask.task_type_id,
      priority_id: newTask.priority_id,
      assignee_id: newTask.assignee_id,
      reporter_id: newTask.reporter_id,
      parent_task_id,
      start_date: newTask.start_date,
      due_date: newTask.due_date,
    });
  }

  if (label_id) await taskRepository.addLabelToTask(newTask.id, label_id);

  await taskRepository.createActivityLog({
    taskId: newTask.id,
    userId: user.id,
    actionType: ACTIVITY_ACTION.CREATE_TASK ?? "CREATE_TASK",
    fieldName: "task",
    oldValue: null,
    newValue: JSON.stringify({ title, status_id, priority_id, assignee_id }),
  });

  return await getTaskDetail(newTask.id);
}

// ====================== GET DETAIL ======================
async function getTaskDetail(taskId) {
  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");
  const labels = await taskRepository.findLabelsByTaskId(taskId);
  return mapTaskRow(task, labels);
}

// ====================== UPDATE ======================
async function updateTask(taskId, payload, user) {
  const oldTask = await taskRepository.findTaskById(taskId);
  if (!oldTask) throw new Error("Task không tồn tại");

  // employee chỉ sửa task của chính mình
  // department_head trở lên sửa được tất cả
  if (!hasMinRole(user, "department_head")) {
    if (
      oldTask.reporter_id !== Number(user.id) &&
      oldTask.assignee_id !== Number(user.id)
    ) {
      const err = new Error("Bạn chỉ có thể chỉnh sửa task của chính mình");
      err.status = 403;
      throw err;
    }
  }

  await taskRepository.updateTask(taskId, {
    title: payload.title || oldTask.title,
    description: payload.description ?? oldTask.description,
    status_id: payload.status_id ?? oldTask.status_id,
    task_type_id:
      payload.task_type_id ?? payload.taskTypeId ?? oldTask.task_type_id,
    priority_id:
      payload.priority_id ?? payload.priorityId ?? oldTask.priority_id,
    assignee_id:
      payload.assignee_id ?? payload.assigneeId ?? oldTask.assignee_id,
    reporter_id:
      payload.reporter_id ?? payload.reporterId ?? oldTask.reporter_id,
    parent_task_id:
      payload.parent_task_id ?? payload.parentTaskId ?? oldTask.parent_task_id,
    start_date: payload.start_date ?? payload.startDate ?? oldTask.start_date,
    due_date: payload.due_date ?? payload.dueDate ?? oldTask.due_date,
  });

  await taskRepository.createActivityLog({
    taskId,
    userId: user.id,
    actionType: ACTIVITY_ACTION.UPDATE_TASK,
    fieldName: "task",
    oldValue: JSON.stringify({
      title: oldTask.title,
      description: oldTask.description,
    }),
    newValue: JSON.stringify({
      title: payload.title || oldTask.title,
      description: payload.description ?? oldTask.description,
    }),
  });

  return getTaskDetail(taskId);
}

// ====================== DELETE ======================
async function deleteTask(taskId, user) {
  // Chỉ department_head trở lên mới xóa được
  assertRole(
    user,
    "department_head",
    "Chỉ trưởng phòng trở lên mới được xóa task",
  );

  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");

  await taskRepository.createActivityLog({
    taskId,
    userId: user.id,
    actionType: ACTIVITY_ACTION.DELETE_TASK,
    fieldName: "title",
    oldValue: task.title,
    newValue: null,
  });

  await taskRepository.deleteTask(taskId);
}

// ====================== MOVE ======================
async function moveTask(taskId, payload, user) {
  const error = validateMoveTaskPayload(payload);
  if (error.length) throw new Error(error.join(","));

  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");

  // employee chỉ move task của mình
  if (!hasMinRole(user, "department_head")) {
    if (
      task.reporter_id !== Number(user.id) &&
      task.assignee_id !== Number(user.id)
    ) {
      const err = new Error("Bạn chỉ có thể di chuyển task của chính mình");
      err.status = 403;
      throw err;
    }
  }

  await taskRepository.shiftTasksForInsert(
    task.project_id,
    task.board_id,
    payload.toStatusId,
    payload.newPosition,
  );
  await taskRepository.moveTask({
    taskId,
    toStatusId: payload.toStatusId,
    newPosition: payload.newPosition,
  });

  await taskRepository.createActivityLog({
    taskId,
    userId: user.id,
    actionType: ACTIVITY_ACTION.MOVE_TASK ?? "MOVE_TASK",
    fieldName: "status_id",
    oldValue: String(task.status_id),
    newValue: String(payload.toStatusId),
  });

  return getTaskDetail(taskId);
}

// ====================== REORDER ======================
async function reorderTask(taskId, payload, user) {
  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");

  await taskRepository.reorderTask({
    taskId,
    statusId: payload.statusId ?? task.status_id,
    newPosition: payload.newPosition,
  });

  await taskRepository.createActivityLog({
    taskId,
    userId: user.id,
    actionType: ACTIVITY_ACTION.UPDATE_TASK,
    fieldName: "position",
    oldValue: String(task.position),
    newValue: String(payload.newPosition),
  });

  return getTaskDetail(taskId);
}

// ====================== COMPLETE / UNCOMPLETE ======================
async function completeTask(taskId, user, { resolution, note } = {}) {
  const VALID = ["done", "cancelled", "wont_do"];
  if (!resolution || !VALID.includes(resolution)) {
    throw new Error("Resolution không hợp lệ");
  }

  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");
  if (task.is_completed) throw new Error("Task đã được hoàn thành trước đó");

  // employee chỉ complete task được assign cho mình
  if (!hasMinRole(user, "department_head")) {
    if (
      task.assignee_id !== Number(user.id) &&
      task.reporter_id !== Number(user.id)
    ) {
      const err = new Error(
        "Bạn chỉ có thể hoàn thành task được giao cho mình",
      );
      err.status = 403;
      throw err;
    }
  }

  await taskRepository.completeTask(taskId, {
    resolution,
    note,
    closedBy: user.id,
  });

  try {
    await taskRepository.createActivityLog({
      taskId,
      userId: user.id,
      actionType: "CLOSE_ISSUE",
      fieldName: "resolution",
      oldValue: String(task.status_id ?? ""),
      newValue: resolution,
    });
  } catch (logErr) {
    console.error("Activity log error (non-critical):", logErr.message);
  }

  return getTaskDetail(taskId);
}

async function uncompleteTask(taskId, user) {
  // Chỉ department_head trở lên mới reopen task
  assertRole(
    user,
    "department_head",
    "Chỉ trưởng phòng trở lên mới được mở lại task",
  );

  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");
  if (!task.is_completed) throw new Error("Task chưa được đánh dấu hoàn thành");

  await taskRepository.uncompleteTask(taskId);

  try {
    await taskRepository.createActivityLog({
      taskId,
      userId: user.id,
      actionType: "UNCOMPLETE_TASK",
      fieldName: "is_completed",
      oldValue: "1",
      newValue: "0",
    });
  } catch (logErr) {
    console.error("Activity log error (non-critical):", logErr.message);
  }

  return getTaskDetail(taskId);
}

// ====================== ARCHIVE / UNARCHIVE ======================
async function archiveTask(taskId, user) {
  // Chỉ department_head trở lên mới archive
  assertRole(
    user,
    "department_head",
    "Chỉ trưởng phòng trở lên mới được archive task",
  );

  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");
  if (task.is_archived) throw new Error("Task đã được archive trước đó");

  await taskRepository.archiveTask(taskId);

  try {
    await taskRepository.createActivityLog({
      taskId,
      userId: user.id,
      actionType: "ARCHIVE_TASK",
      fieldName: "is_archived",
      oldValue: "0",
      newValue: "1",
    });
  } catch (logErr) {
    console.error("Activity log error (non-critical):", logErr.message);
  }

  return getTaskDetail(taskId);
}

async function unarchiveTask(taskId, user) {
  assertRole(
    user,
    "department_head",
    "Chỉ trưởng phòng trở lên mới được unarchive task",
  );

  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");
  if (!task.is_archived) throw new Error("Task chưa được archive");

  await taskRepository.unarchiveTask(taskId);

  try {
    await taskRepository.createActivityLog({
      taskId,
      userId: user.id,
      actionType: "UNARCHIVE_TASK",
      fieldName: "is_archived",
      oldValue: "1",
      newValue: "0",
    });
  } catch (logErr) {
    console.error("Activity log error (non-critical):", logErr.message);
  }

  return getTaskDetail(taskId);
}

// ====================== COMMENTS ======================
async function getTaskComments(taskId) {
  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");
  return await taskRepository.findTaskComments(taskId);
}

async function addTaskComment(taskId, payload, user) {
  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");
  if (!payload.content?.trim())
    throw new Error("Nội dung comment không được để trống");

  await taskRepository.addTaskComment(taskId, user.id, payload.content.trim());

  await taskRepository.createActivityLog({
    taskId,
    userId: user.id,
    actionType: ACTIVITY_ACTION.ADD_COMMENT ?? "ADD_COMMENT",
    fieldName: "comment",
    oldValue: null,
    newValue: payload.content.trim(),
  });

  return await taskRepository.findTaskComments(taskId);
}

// ====================== ACTIVITIES ======================
async function getTaskActivities(taskId) {
  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");
  return await taskRepository.findTaskActivities(taskId);
}

// ====================== ASSIGNEE ======================
async function updateTaskAssignee(taskId, assigneeId, user) {
  // Chỉ department_head trở lên mới assign task
  assertRole(
    user,
    "department_head",
    "Chỉ trưởng phòng trở lên mới được phân công task",
  );

  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");

  await taskRepository.updateTask(taskId, {
    title: task.title,
    description: task.description,
    task_type_id: task.task_type_id,
    priority_id: task.priority_id,
    assignee_id: assigneeId,
    reporter_id: task.reporter_id,
    parent_task_id: task.parent_task_id,
    start_date: task.start_date,
    due_date: task.due_date,
  });

  await taskRepository.createActivityLog({
    taskId,
    userId: user.id,
    actionType: ACTIVITY_ACTION.UPDATE_TASK ?? "UPDATE_TASK",
    fieldName: "assignee_id",
    oldValue: task.assignee_id ? String(task.assignee_id) : null,
    newValue: assigneeId ? String(assigneeId) : null,
  });

  return getTaskDetail(taskId);
}

// ====================== DATES ======================
async function updateTaskDates(taskId, payload, user) {
  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");

  // employee chỉ cập nhật dates task của mình
  if (!hasMinRole(user, "department_head")) {
    if (
      task.reporter_id !== Number(user.id) &&
      task.assignee_id !== Number(user.id)
    ) {
      const err = new Error(
        "Bạn chỉ có thể cập nhật ngày của task mình phụ trách",
      );
      err.status = 403;
      throw err;
    }
  }

  await taskRepository.updateTask(taskId, {
    title: task.title,
    description: task.description,
    task_type_id: task.task_type_id,
    priority_id: task.priority_id,
    assignee_id: task.assignee_id,
    reporter_id: task.reporter_id,
    parent_task_id: task.parent_task_id,
    start_date: payload.startDate ?? task.start_date,
    due_date: payload.dueDate ?? task.due_date,
  });

  await taskRepository.createActivityLog({
    taskId,
    userId: user.id,
    actionType: ACTIVITY_ACTION.UPDATE_TASK ?? "UPDATE_TASK",
    fieldName: "dates",
    oldValue: JSON.stringify({
      start_date: task.start_date,
      due_date: task.due_date,
    }),
    newValue: JSON.stringify({
      start_date: payload.startDate ?? task.start_date,
      due_date: payload.dueDate ?? task.due_date,
    }),
  });

  return getTaskDetail(taskId);
}

// ====================== SUB TASKS ======================
async function createSubTask(parentTaskId, payload, user) {
  const parentTask = await taskRepository.findTaskById(parentTaskId);
  if (!parentTask) throw new Error("Task cha không tồn tại");

  const title = payload.title?.trim();
  if (!title) throw new Error("title là bắt buộc");

  const maxPosition = await taskRepository.findMaxTaskPositionByStatus(
    parentTask.project_id,
    parentTask.board_id,
    parentTask.status_id,
  );
  const project = await workflowRepository.findProjectById(
    parentTask.project_id,
  );
  const taskCount = await taskRepository.findLastTaskNumberByProject(
    parentTask.project_id,
  );
  const task_key = `${project?.code ?? "TASK"}-${taskCount + 1}`;

  const newTask = await taskRepository.createTask({
    project_id: parentTask.project_id,
    board_id: parentTask.board_id,
    status_id: parentTask.status_id,
    priority_id: payload.priorityId ?? null,
    assignee_id: payload.assigneeId ?? null,
    reporter_id: Number(user.id),
    title,
    description: payload.description ?? null,
    start_date: payload.startDate ?? null,
    due_date: payload.dueDate ?? null,
    position: maxPosition + 1,
    task_type_id: payload.taskTypeId ?? parentTask.task_type_id,
    task_key,
  });

  await taskRepository.updateTask(newTask.id, {
    title: newTask.title,
    description: newTask.description,
    task_type_id: newTask.task_type_id,
    priority_id: newTask.priority_id,
    assignee_id: newTask.assignee_id,
    reporter_id: newTask.reporter_id,
    parent_task_id: parentTaskId,
    start_date: newTask.start_date,
    due_date: newTask.due_date,
  });

  await taskRepository.createActivityLog({
    taskId: parentTaskId,
    userId: user.id,
    actionType: ACTIVITY_ACTION.UPDATE_TASK ?? "UPDATE_TASK",
    fieldName: "sub_task",
    oldValue: null,
    newValue: title,
  });

  return await taskRepository.findTaskById(newTask.id);
}

async function getSubTasks(parentTaskId) {
  const task = await taskRepository.findTaskById(parentTaskId);
  if (!task) throw new Error("Task không tồn tại");
  return await taskRepository.findSubTasksByParentId(parentTaskId);
}

// ====================== LABELS ======================
async function addLabelToTask(taskId, labelId, user) {
  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");

  await taskRepository.addLabelToTask(taskId, labelId);

  await taskRepository.createActivityLog({
    taskId,
    userId: user.id,
    actionType: ACTIVITY_ACTION.UPDATE_TASK ?? "UPDATE_TASK",
    fieldName: "label",
    oldValue: null,
    newValue: labelId.toString(),
  });

  return { taskId, labelId };
}

async function removeLabelFromTask(taskId, labelId, user) {
  const task = await taskRepository.findTaskById(taskId);
  if (!task) throw new Error("Task không tồn tại");

  await taskRepository.removeLabelFromTask(taskId, labelId);

  await taskRepository.createActivityLog({
    taskId,
    userId: user.id,
    actionType: ACTIVITY_ACTION.UPDATE_TASK ?? "UPDATE_TASK",
    fieldName: "label",
    oldValue: labelId.toString(),
    newValue: null,
  });

  return { taskId, labelId };
}

async function getCompletedTasks(projectId) {
  return await taskRepository.findCompletedTasksByProject(projectId);
}

// ====================== EXPORT ======================
export {
  createTask,
  getTaskDetail,
  updateTask,
  deleteTask,
  moveTask,
  reorderTask,
  completeTask,
  uncompleteTask,
  archiveTask,
  unarchiveTask,
  getTaskComments,
  addTaskComment,
  getTaskActivities,
  updateTaskAssignee,
  updateTaskDates,
  createSubTask,
  getSubTasks,
  addLabelToTask,
  removeLabelFromTask,
  getCompletedTasks,
};
