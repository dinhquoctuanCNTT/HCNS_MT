import { getPool, sql } from "../../../../src/config/db.js";

// ==================== PROJECTS ====================
async function findProjectsByUser(userId) {
  console.log("repository userId =", userId, "type =", typeof userId);

  const pool = getPool();
  const result = await pool.request().input("userId", sql.Int, Number(userId))
    .query(`
      SELECT p.id, p.code, p.name, p.description
      FROM projects p
      INNER JOIN project_members pm ON pm.project_id = p.id
      WHERE pm.user_id = @userId
      ORDER BY p.id DESC
    `);

  console.log("repository result =", result.recordset);
  return result.recordset;
}

async function findProjectByCode(code) {
  const pool = getPool();
  const result = await pool.request().input("code", sql.VarChar, code).query(`
      SELECT TOP 1 id, code, name
      FROM projects
      WHERE code = @code
    `);

  return result.recordset[0] || null;
}

async function findProjectById(projectId) {
  const pool = getPool();
  const result = await pool.request().input("projectId", sql.BigInt, projectId)
    .query(`
      SELECT TOP 1 id, code, name, description
      FROM projects
      WHERE id = @projectId
    `);

  return result.recordset[0] || null;
}

async function createProject(userId, payload) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("code", sql.VarChar, payload.code)
    .input("name", sql.NVarChar, payload.name)
    .input("description", sql.NVarChar, payload.description || null)
    .input("ownerId", sql.BigInt, userId).query(`
      INSERT INTO projects (code, name, description, owner_id, is_active, created_at, update_at)
      OUTPUT INSERTED.*
      VALUES (@code, @name, @description, @ownerId, 1, GETUTCDATE(), GETUTCDATE())
    `);

  return result.recordset[0] || null;
}

async function updateProject(projectId, payload) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("code", sql.VarChar, payload.code)
    .input("name", sql.NVarChar, payload.name)
    .input("description", sql.NVarChar, payload.description || null).query(`
      UPDATE projects
      SET code = @code, name = @name, description = @description, update_at = GETUTCDATE()
      OUTPUT INSERTED.id, INSERTED.code, INSERTED.name, INSERTED.description
      WHERE id = @projectId
    `);

  return result.recordset[0] || null;
}

async function deleteProject(projectId) {
  const pool = getPool();
  await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .query(`DELETE FROM projects WHERE id = @projectId`);
}

// ==================== BOARDS ====================
async function createBoard(payload) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("projectId", sql.BigInt, payload.project_id)
    .input("name", sql.NVarChar, payload.name)
    .input("boardType", sql.VarChar, payload.board_type || "kanban")
    .input("isDefault", sql.Bit, payload.is_default ? 1 : 0)
    .input("createdBy", sql.BigInt, payload.created_by).query(`
      INSERT INTO boards (project_id, name, board_type, is_default, created_by)
      OUTPUT INSERTED.*
      VALUES (@projectId, @name, @boardType, @isDefault, @createdBy)
    `);

  return result.recordset[0] || null;
}

async function findDefaultBoardByProject(projectId) {
  const pool = getPool();
  const result = await pool.request().input("projectId", sql.BigInt, projectId)
    .query(`
      SELECT TOP 1 id, name, board_type, is_default
      FROM boards
      WHERE project_id = @projectId
      ORDER BY is_default DESC, id ASC
    `);

  return result.recordset[0] || null;
}

async function findBoardColumns(boardId) {
  const pool = getPool();
  const result = await pool.request().input("boardId", sql.BigInt, boardId)
    .query(`
      SELECT
        bc.id,
        bc.board_id,
        bc.status_id,
        bc.name,
        bc.position,
        bc.wip_limit,
        s.name AS status_name,
        s.color AS status_color
      FROM board_columns bc
      INNER JOIN statuses s ON s.id = bc.status_id
      WHERE bc.board_id = @boardId
      ORDER BY bc.position ASC
    `);

  return result.recordset;
}

// ==================== BOARD COLUMNS ====================
async function createBoardColumn(boardId, payload) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("boardId", sql.BigInt, boardId)
    .input("statusId", sql.BigInt, payload.status_id)
    .input("name", sql.NVarChar, payload.name)
    .input("position", sql.Int, payload.position || 0)
    .input("wipLimit", sql.Int, payload.wip_limit || null).query(`
      INSERT INTO board_columns (board_id, status_id, name, position, wip_limit)
      OUTPUT INSERTED.*
      VALUES (@boardId, @statusId, @name, @position, @wipLimit)
    `);

  return result.recordset[0] || null;
}

async function updateBoardColumn(boardId, columnId, payload) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("boardId", sql.BigInt, boardId)
    .input("columnId", sql.BigInt, columnId)
    .input("statusId", sql.BigInt, payload.status_id)
    .input("name", sql.NVarChar, payload.name)
    .input("position", sql.Int, payload.position || 0)
    .input("wipLimit", sql.Int, payload.wip_limit || null).query(`
      UPDATE board_columns
      SET status_id = @statusId, name = @name, position = @position, wip_limit = @wipLimit
      OUTPUT INSERTED.*
      WHERE id = @columnId AND board_id = @boardId
    `);

  return result.recordset[0] || null;
}

async function deleteBoardColumn(boardId, columnId) {
  const pool = getPool();
  await pool
    .request()
    .input("boardId", sql.BigInt, boardId)
    .input("columnId", sql.BigInt, columnId).query(`
      DELETE FROM board_columns
      WHERE id = @columnId AND board_id = @boardId
    `);
}

// ==================== TASKS ====================
async function findTasksByBoard(projectId, boardId, filters = {}) {
  const pool = getPool();
  const request = pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("boardId", sql.BigInt, boardId);

  const conditions = [
    "t.project_id = @projectId",
    "t.board_id = @boardId",
    "t.is_completed = 0",
    "t.is_archived = 0",
  ];

  if (filters.keyword) {
    request.input("keyword", sql.NVarChar, `%${filters.keyword}%`);
    conditions.push("(t.title LIKE @keyword OR t.task_key LIKE @keyword)");
  }

  if (filters.assigneeId) {
    request.input("assigneeId", sql.BigInt, filters.assigneeId);
    conditions.push("t.assignee_id = @assigneeId");
  }

  if (filters.priorityId) {
    request.input("priorityId", sql.BigInt, filters.priorityId);
    conditions.push("t.priority_id = @priorityId");
  }

  const result = await request.query(`
    SELECT
      t.id,
      t.project_id,
      t.board_id,
      t.task_key,
      t.title,
      t.description,
      t.task_type_id,
      t.status_id,
      t.priority_id,
      t.reporter_id,
      t.assignee_id,
      t.parent_task_id,
      t.start_date,
      t.due_date,
      t.completed_at,
      t.is_completed,
      t.is_archived,
      t.position,
      p.name AS priority_name,
      p.color AS priority_color,
      tt.name AS task_type_name,
      tt.icon AS task_type_icon,
      au.full_name AS assignee_name,
      au.avatar_url AS assignee_avatar,
      ru.full_name AS reporter_name,
      (SELECT COUNT(*) FROM task_checklists WHERE task_id = t.id) AS checklist_count,
      (SELECT COUNT(*) FROM task_checklists WHERE task_id = t.id AND is_done = 1) AS checklist_done
    FROM tasks t
    LEFT JOIN priorities p ON p.id = t.priority_id
    LEFT JOIN task_types tt ON tt.id = t.task_type_id
    LEFT JOIN users au ON au.id = t.assignee_id
    LEFT JOIN users ru ON ru.id = t.reporter_id
    WHERE ${conditions.join(" AND ")}
    ORDER BY t.status_id ASC, t.position ASC
  `);

  return result.recordset;
}

// ✅ THÊM MỚI: lấy danh sách task đã hoàn thành theo project
async function findCompletedTasksByProject(projectId) {
  const pool = getPool();
  const result = await pool.request().input("projectId", sql.BigInt, projectId)
    .query(`
      SELECT
        t.id,
        t.task_key,
        t.title,
        t.completed_at,
        t.status_id,
        s.name   AS status_name,
        s.color  AS status_color,
        p.name   AS priority_name,
        p.color  AS priority_color,
        tt.name  AS task_type_name,
        au.full_name  AS assignee_name,
        au.avatar_url AS assignee_avatar,
        ru.full_name  AS reporter_name
      FROM tasks t
      LEFT JOIN statuses   s  ON s.id  = t.status_id
      LEFT JOIN priorities p  ON p.id  = t.priority_id
      LEFT JOIN task_types tt ON tt.id = t.task_type_id
      LEFT JOIN users au ON au.id = t.assignee_id
      LEFT JOIN users ru ON ru.id = t.reporter_id
      WHERE t.project_id   = @projectId
        AND t.is_completed = 1
      ORDER BY t.completed_at DESC
    `);

  return result.recordset;
}

async function findTaskByProject(projectId, filters = {}) {
  const pool = getPool();
  const request = pool.request().input("projectId", sql.BigInt, projectId);
  const conditions = ["t.project_id = @projectId"];

  if (filters.keyword) {
    request.input("keyword", sql.NVarChar, `%${filters.keyword}%`);
    conditions.push("(t.title LIKE @keyword OR t.task_key LIKE @keyword)");
  }

  if (filters.statusId) {
    request.input("statusId", sql.BigInt, Number(filters.statusId));
    conditions.push("t.status_id = @statusId");
  }

  if (filters.assigneeId) {
    request.input("assigneeId", sql.BigInt, Number(filters.assigneeId));
    conditions.push("t.assignee_id = @assigneeId");
  }

  const result = await request.query(`
    SELECT
      t.id,
      t.task_key,
      t.title,
      t.description,
      t.status_id,
      t.priority_id,
      t.assignee_id,
      t.reporter_id,
      t.parent_task_id,
      t.start_date,
      t.due_date,
      t.completed_at,
      t.position
    FROM tasks t
    WHERE ${conditions.join(" AND ")}
    ORDER BY t.id DESC
  `);

  return result.recordset;
}

async function updateTaskAssignee(taskId, assigneeId) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("taskId", sql.BigInt, taskId)
    .input("assigneeId", sql.BigInt, assigneeId).query(`
      UPDATE tasks
      SET assignee_id = @assigneeId
      WHERE id = @taskId
    `);

  return result.recordset[0] || null;
}

async function updateTaskDates(taskId, payload) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("taskId", sql.BigInt, taskId)
    .input("startDate", sql.DateTime, payload.startDate || null)
    .input("dueDate", sql.DateTime, payload.dueDate || null).query(`
      UPDATE tasks
      SET start_date = @startDate, due_date = @dueDate
      WHERE id = @taskId
    `);

  return result.recordset[0] || null;
}

// ✅ THÊM MỚI: đánh dấu task là completed
async function markTaskCompleted(taskId, userId) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("taskId", sql.BigInt, taskId)
    .input("userId", sql.BigInt, userId).query(`
      UPDATE tasks
      SET is_completed = 1, completed_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @taskId
    `);

  return result.recordset[0] || null;
}

// ✅ THÊM MỚI: mở lại task đã completed
async function markTaskUncompleted(taskId) {
  const pool = getPool();
  const result = await pool.request().input("taskId", sql.BigInt, taskId)
    .query(`
      UPDATE tasks
      SET is_completed = 0, completed_at = NULL
      OUTPUT INSERTED.*
      WHERE id = @taskId
    `);

  return result.recordset[0] || null;
}

// ==================== LABELS ====================
async function findLabelsByTaskIds(taskIds = []) {
  if (!taskIds.length) return [];

  const pool = getPool();
  const request = pool.request();

  const paramNames = taskIds.map((_, index) => `taskId${index}`);
  taskIds.forEach((id, index) => {
    request.input(paramNames[index], sql.BigInt, id);
  });

  const result = await request.query(`
    SELECT
      ltm.task_id,
      tl.id,
      tl.name,
      tl.color
    FROM label_task_map ltm
    INNER JOIN task_labels tl ON tl.id = ltm.label_id
    WHERE ltm.task_id IN (${paramNames.map((name) => `@${name}`).join(", ")})
  `);

  return result.recordset;
}

async function createProjectLabel(projectId, payload) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("name", sql.NVarChar, payload.name)
    .input("color", sql.VarChar, payload.color).query(`
      INSERT INTO task_labels (project_id, name, color, created_at)
      OUTPUT INSERTED.*
      VALUES (@projectId, @name, @color, GETDATE())
    `);

  return result.recordset[0] || null;
}

async function updateProjectLabel(projectId, labelId, payload) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("labelId", sql.BigInt, labelId)
    .input("name", sql.NVarChar, payload.name)
    .input("color", sql.VarChar, payload.color || null).query(`
      UPDATE task_labels
      SET name = @name, color = @color
      OUTPUT INSERTED.*
      WHERE id = @labelId AND project_id = @projectId
    `);

  return result.recordset[0] || null;
}

async function deleteProjectLabel(projectId, labelId) {
  const pool = getPool();
  await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("labelId", sql.BigInt, labelId).query(`
      DELETE FROM task_labels
      WHERE id = @labelId AND project_id = @projectId
    `);
}

async function addLabelToTask(taskId, labelId) {
  const pool = getPool();
  await pool
    .request()
    .input("taskId", sql.BigInt, taskId)
    .input("labelId", sql.BigInt, labelId).query(`
      INSERT INTO label_task_map (task_id, label_id)
      VALUES (@taskId, @labelId)
    `);
}

async function removeLabelFromTask(taskId, labelId) {
  const pool = getPool();
  await pool
    .request()
    .input("taskId", sql.BigInt, taskId)
    .input("labelId", sql.BigInt, labelId).query(`
      DELETE FROM label_task_map
      WHERE task_id = @taskId AND label_id = @labelId
    `);
}

// ==================== MEMBERS ====================
async function findProjectMembers(projectId) {
  const pool = getPool();
  const result = await pool.request().input("projectId", sql.BigInt, projectId)
    .query(`
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.avatar_url,
        pm.project_role
      FROM project_members pm
      INNER JOIN users u ON u.id = pm.user_id
      WHERE pm.project_id = @projectId
      ORDER BY u.full_name ASC
    `);

  return result.recordset;
}

async function addProjectMember(projectId, userId, role) {
  const pool = getPool();
  await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("userId", sql.BigInt, userId)
    .input("role", sql.VarChar, role).query(`
      INSERT INTO project_members (project_id, user_id, project_role)
      VALUES (@projectId, @userId, @role)
    `);
}

async function findProjectMemberByUserId(projectId, userId) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("userId", sql.BigInt, userId).query(`
      SELECT TOP 1 project_id, user_id, project_role
      FROM project_members
      WHERE project_id = @projectId AND user_id = @userId
    `);

  return result.recordset[0] || null;
}

async function removeProjectMember(projectId, userId) {
  const pool = getPool();
  await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("userId", sql.BigInt, userId).query(`
      DELETE FROM project_members
      WHERE project_id = @projectId AND user_id = @userId
    `);
}

async function updateProjectMemberRole(projectId, userId, newRole) {
  const pool = getPool();
  await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("userId", sql.BigInt, userId)
    .input("projectRole", sql.VarChar, newRole).query(`
      UPDATE project_members
      SET project_role = @projectRole
      WHERE project_id = @projectId AND user_id = @userId
    `);
}

// ==================== STATUSES ====================
async function findProjectStatuses(projectId) {
  const pool = getPool();
  const result = await pool.request().input("projectId", sql.BigInt, projectId)
    .query(`
      SELECT id, name, category, color, position, is_active
      FROM statuses
      WHERE project_id = @projectId
      ORDER BY position ASC, id ASC
    `);

  return result.recordset;
}

async function createProjectStatus(projectId, payload) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("name", sql.NVarChar, payload.name)
    .input("category", sql.VarChar, payload.category)
    .input("color", sql.VarChar, payload.color || null)
    .input("position", sql.Int, payload.position || 1).query(`
      INSERT INTO statuses (project_id, name, category, color, position, is_active)
      OUTPUT INSERTED.*
      VALUES (@projectId, @name, @category, @color, @position, 1)
    `);

  return result.recordset[0] || null;
}

async function updateProjectStatus(projectId, statusId, payload) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("statusId", sql.BigInt, statusId)
    .input("name", sql.NVarChar, payload.name)
    .input("category", sql.VarChar, payload.category)
    .input("color", sql.VarChar, payload.color)
    .input("position", sql.Int, payload.position)
    .input("isActive", sql.Bit, payload.isActive).query(`
      UPDATE statuses
      SET
        name = @name,
        category = @category,
        color = @color,
        position = @position,
        is_active = @isActive
      OUTPUT INSERTED.*
      WHERE id = @statusId AND project_id = @projectId
    `);

  return result.recordset[0] || null;
}

async function deleteProjectStatus(projectId, statusId) {
  const pool = getPool();
  await pool
    .request()
    .input("projectId", sql.BigInt, projectId)
    .input("statusId", sql.BigInt, statusId).query(`
      DELETE FROM statuses
      WHERE id = @statusId AND project_id = @projectId
    `);
}

// ==================== PRIORITIES & TASK TYPES ====================
async function findPriorities() {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT id, name, color
    FROM priorities
    ORDER BY id ASC
  `);

  return result.recordset;
}

async function findTaskTypes() {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT id, name, icon
    FROM task_types
    ORDER BY id ASC
  `);

  return result.recordset;
}

// ==================== PROJECT LABELS (find) ====================
async function findProjectLabels(projectId) {
  const pool = getPool();
  const result = await pool.request().input("projectId", sql.BigInt, projectId)
    .query(`
      SELECT id, name, color, created_at
      FROM task_labels
      WHERE project_id = @projectId
      ORDER BY name ASC
    `);

  return result.recordset;
}

// ==================== EXPORTS ====================
export {
  findProjectsByUser,
  findProjectByCode,
  findProjectById,
  createProject,
  updateProject,
  deleteProject,
  createBoard,
  findDefaultBoardByProject,
  findBoardColumns,
  createBoardColumn,
  updateBoardColumn,
  deleteBoardColumn,
  findTasksByBoard,
  findTaskByProject,
  findCompletedTasksByProject, // ✅ MỚI
  updateTaskAssignee,
  updateTaskDates,
  markTaskCompleted, // ✅ MỚI
  markTaskUncompleted, // ✅ MỚI
  findLabelsByTaskIds,
  createProjectLabel,
  updateProjectLabel,
  deleteProjectLabel,
  addLabelToTask,
  removeLabelFromTask,
  findProjectMembers,
  addProjectMember,
  findProjectMemberByUserId,
  removeProjectMember,
  updateProjectMemberRole,
  findProjectStatuses,
  createProjectStatus,
  updateProjectStatus,
  deleteProjectStatus,
  findPriorities,
  findTaskTypes,
  findProjectLabels,
};
