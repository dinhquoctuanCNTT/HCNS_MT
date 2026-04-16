import * as workflowRepository from "../repositories/workflow.repository.js";
import { mapTaskRow, mapBoardColumnRow } from "../mappers/workflow.mapper.js";

async function getProjects(userId) {
  return await workflowRepository.findProjectsByUser(Number(userId));
}

async function getProjectBoard(projectId, filters = {}) {
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) {
    throw new Error("Project không tồn tại");
  }

  const board = await workflowRepository.findDefaultBoardByProject(projectId);
  if (!board) {
    throw new Error("Board mặc định không tồn tại");
  }

  const columns = await workflowRepository.findBoardColumns(board.id);

  const taskRows = await workflowRepository.findTasksByBoard(
    projectId,
    board.id,
    filters,
  );

  const taskIds = taskRows.map((item) => item.id);

  const taskLabelRows =
    taskIds.length > 0
      ? await workflowRepository.findLabelsByTaskIds(taskIds)
      : [];

  const labelsByTaskId = taskLabelRows.reduce((acc, row) => {
    if (!acc[row.task_id]) {
      acc[row.task_id] = [];
    }

    acc[row.task_id].push({
      id: row.id,
      name: row.name,
      color: row.color,
    });

    return acc;
  }, {});

  const tasksByStatusId = {};

  for (const row of taskRows) {
    const mappedTask = mapTaskRow(row, labelsByTaskId[row.id] || []);

    if (!tasksByStatusId[row.status_id]) {
      tasksByStatusId[row.status_id] = [];
    }

    tasksByStatusId[row.status_id].push(mappedTask);
  }

  const mappedColumns = columns.map((column) =>
    mapBoardColumnRow(column, tasksByStatusId[column.status_id] || []),
  );

  return {
    project,
    board,
    columns: mappedColumns,
  };
}

async function getProjectMembers(projectId) {
  return await workflowRepository.findProjectMembers(projectId);
}

async function getProjectLabels(projectId) {
  return await workflowRepository.findProjectLabels(projectId);
}

async function getProjectStatuses(projectId) {
  return await workflowRepository.findProjectStatuses(projectId);
}

async function getProjectPriorities() {
  return await workflowRepository.findPriorities();
}

async function getProjectTaskTypes() {
  return await workflowRepository.findTaskTypes();
}

async function createProject(userId, payload) {
  if (!payload.code || payload.code.trim() === "") {
    throw new Error("Mã project không được để trống");
  }

  if (!payload.name || payload.name.trim() === "") {
    throw new Error("Tên project không được để trống");
  }

  payload.code = payload.code.trim().toLowerCase();

  const existed = await workflowRepository.findProjectByCode(payload.code);
  if (existed) {
    throw new Error(`Mã project "${payload.code}" đã tồn tại`);
  }

  const project = await workflowRepository.createProject(userId, payload);

  await workflowRepository.addProjectMember(project.id, userId, "OWNER");

  const board = await workflowRepository.createBoard({
    project_id: project.id,
    name: `${project.name} Board`,
    board_type: "kanban",
    is_default: true,
    created_by: userId,
  });

  const defaultStatuses = [
    { name: "To do", category: "TODO", position: 1, color: "#6B7280" },
    {
      name: "In Progress",
      category: "IN_PROGRESS",
      position: 2,
      color: "#3B82F6",
    },
    {
      name: "Code Review",
      category: "IN_PROGRESS",
      position: 3,
      color: "#F59E0B",
    },
    { name: "Done", category: "DONE", position: 4, color: "#10B981" },
  ];

  for (const item of defaultStatuses) {
    const status = await workflowRepository.createProjectStatus(project.id, {
      name: item.name,
      category: item.category,
      color: item.color,
      position: item.position,
    });

    await workflowRepository.createBoardColumn(board.id, {
      name: item.name,
      position: item.position,
      status_id: status.id,
    });
  }

  return {
    ...project,
    board,
  };
}

async function getProjectDetail(projectId) {
  console.log("service projectId:", projectId);

  const id = Number(projectId);

  if (!id || Number.isNaN(id)) {
    throw new Error("projectId không hợp lệ");
  }

  const project = await workflowRepository.findProjectById(id);
  if (!project) throw new Error("Project không tồn tại");

  return project;
}

async function updateProject(projectId, payload) {
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Project không tồn tại");

  if (!payload.code || payload.code.trim() === "") {
    throw new Error("Mã project không được để trống");
  }

  if (!payload.name || payload.name.trim() === "") {
    throw new Error("Tên project không được để trống");
  }

  payload.code = payload.code.trim().toLowerCase();

  const existed = await workflowRepository.findProjectByCode(payload.code);
  if (existed && Number(existed.id) !== Number(projectId)) {
    throw new Error(`Mã project "${payload.code}" đã tồn tại`);
  }

  return await workflowRepository.updateProject(projectId, payload);
}

async function deleteProject(projectId) {
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Project không tồn tại");
  await workflowRepository.deleteProject(projectId);
  return { message: "Xóa project thành công" };
}

// ================= Label =================
async function createProjectLabel(projectId, payload) {
  if (!payload.name || payload.name.trim() === "") {
    throw new Error("Tên Label không được để trống");
  }
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Dự án không tồn tại");
  return await workflowRepository.createProjectLabel(projectId, payload);
}

async function updateProjectLabel(projectId, labelId, payload) {
  if (!payload.name || payload.name.trim() === "") {
    throw new Error("Tên Label không được để trống");
  }
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Dự án không tồn tại");
  return await workflowRepository.updateProjectLabel(
    projectId,
    labelId,
    payload,
  );
}

async function deleteProjectLabel(projectId, labelId) {
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Dự án không tồn tại");
  await workflowRepository.deleteProjectLabel(projectId, labelId);
  return { message: "Xóa Label thành công" };
}

// ================= Status =================
async function createProjectStatus(projectId, payload) {
  if (!payload.name || !payload.category || payload.category.trim() === "") {
    throw new Error("Tên trạng thái không được để trống");
  }
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Dự án không tồn tại");
  return await workflowRepository.createProjectStatus(projectId, payload);
}

async function updateProjectStatus(projectId, statusId, payload) {
  if (!payload.name || !payload.category) {
    throw new Error("Tên trạng thái không được để trống");
  }
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Dự án không tồn tại");
  return await workflowRepository.updateProjectStatus(
    projectId,
    statusId,
    payload,
  );
}

async function deleteProjectStatus(projectId, statusId) {
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Dự án không tồn tại");
  await workflowRepository.deleteProjectStatus(projectId, statusId);
  return { message: "Xóa trạng thái thành công" };
}

// ================= Members =================
async function addProjectMember(projectId, payload) {
  const userId = payload.userId || payload.user_id;
  const role = payload.projectRole || payload.project_role || "MEMBER";

  if (!userId) throw new Error("User ID không được để trống");

  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Dự án không tồn tại");

  const existed = await workflowRepository.findProjectMemberByUserId(
    projectId,
    userId,
  );
  if (existed) throw new Error("Người dùng đã là thành viên của dự án");

  await workflowRepository.addProjectMember(projectId, userId, role);
  return { message: "Thêm thành viên thành công" };
}

async function removeProjectMember(projectId, userId) {
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Project không tồn tại");
  await workflowRepository.removeProjectMember(projectId, userId);
  return { message: "Member removed successfully" };
}

async function updateProjectMemberRole(projectId, userId, projectRole) {
  if (!projectRole) throw new Error("Project role is required");

  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Project không tồn tại");

  const member = await workflowRepository.findProjectMemberByUserId(
    projectId,
    userId,
  );
  if (!member) throw new Error("Project member not found");

  await workflowRepository.updateProjectMemberRole(
    projectId,
    userId,
    projectRole,
  );
  return { message: "Project role updated successfully" };
}

// ================= Board Column =================
async function createBoardColumn(projectId, payload) {
  const statusId = payload.statusId || payload.status_id;
  const name = payload.name?.trim();
  const position = payload.position;

  if (!statusId && !name && position === undefined) {
    throw new Error(
      "Vui lòng nhập đầy đủ thông tin: status_id, name, position",
    );
  }
  if (!statusId) throw new Error("status_id không được để trống");
  if (!name) throw new Error("Tên column không được để trống");
  if (position === undefined || position === null) {
    throw new Error("position không được để trống");
  }
  if (typeof position !== "number" || position < 0) {
    throw new Error("position phải là số nguyên >= 0");
  }

  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error(`Project ID ${projectId} không tồn tại`);

  const board = await workflowRepository.findDefaultBoardByProject(projectId);
  if (!board) throw new Error(`Project ID ${projectId} chưa có board nào`);

  const statuses = await workflowRepository.findProjectStatuses(projectId);
  const validStatus = statuses.find((s) => Number(s.id) === Number(statusId));
  if (!validStatus) {
    throw new Error(
      `Status ID ${statusId} không thuộc project này. ` +
        `Các status hợp lệ: ${statuses.map((s) => `${s.id} (${s.name})`).join(", ")}`,
    );
  }

  const existingColumns = await workflowRepository.findBoardColumns(board.id);

  const duplicateStatus = existingColumns.find(
    (col) => Number(col.status_id) === Number(statusId),
  );
  if (duplicateStatus) {
    throw new Error(
      `Column với status "${validStatus.name}" (ID: ${statusId}) đã tồn tại trong board này`,
    );
  }

  const duplicateName = existingColumns.find(
    (col) => col.name.toLowerCase() === name.toLowerCase(),
  );
  if (duplicateName) {
    throw new Error(`Column tên "${name}" đã tồn tại trong board này`);
  }

  const duplicatePosition = existingColumns.find(
    (col) => Number(col.position) === Number(position),
  );
  if (duplicatePosition) {
    throw new Error(
      `Position ${position} đã được dùng bởi column "${duplicatePosition.name}"`,
    );
  }

  return await workflowRepository.createBoardColumn(board.id, {
    ...payload,
    status_id: statusId,
  });
}

async function updateBoardColumn(boardId, columnId, payload) {
  const statusId = payload.statusId || payload.status_id;
  const name = payload.name?.trim();

  if (!statusId || !name) {
    throw new Error("Status ID and column name are required");
  }

  return await workflowRepository.updateBoardColumn(boardId, columnId, {
    ...payload,
    status_id: statusId,
    name,
  });
}

async function deleteBoardColumn(boardId, columnId) {
  await workflowRepository.deleteBoardColumn(boardId, columnId);
  return { message: "Board column deleted successfully" };
}

// ================= Completed Tasks =================

// ✅ THÊM MỚI
async function getCompletedTasks(projectId) {
  const project = await workflowRepository.findProjectById(projectId);
  if (!project) throw new Error("Project không tồn tại");
  return await workflowRepository.findCompletedTasksByProject(projectId);
}

// ✅ THÊM MỚI
async function completeTask(taskId, payload, userId) {
  if (!taskId) throw new Error("taskId không hợp lệ");
  return await workflowRepository.markTaskCompleted(taskId, userId);
}

// ✅ THÊM MỚI
async function uncompleteTask(taskId, userId) {
  if (!taskId) throw new Error("taskId không hợp lệ");
  return await workflowRepository.markTaskUncompleted(taskId);
}

export {
  getProjects,
  getProjectBoard,
  getProjectLabels,
  getProjectMembers,
  getProjectStatuses,
  getProjectPriorities,
  getProjectTaskTypes,
  createProject,
  getProjectDetail,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  updateProjectMemberRole,
  createProjectLabel,
  updateProjectLabel,
  deleteProjectLabel,
  createProjectStatus,
  updateProjectStatus,
  deleteProjectStatus,
  createBoardColumn,
  updateBoardColumn,
  deleteBoardColumn,
  getCompletedTasks, // ✅ MỚI
  completeTask, // ✅ MỚI
  uncompleteTask, // ✅ MỚI
};
