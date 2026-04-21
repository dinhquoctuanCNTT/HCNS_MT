import { getPool, sql } from "../../../../src/config/db.js";

async function findTaskById(taskId) {
  const pool = getPool();

  const result = await pool.request().input("taskId", sql.Int, taskId).query(`
  SELECT
    t.*,
    t.resolution,
    t.resolution_note,
    t.completed_at,
    p.name      AS priority_name,
    p.color     AS priority_color,
    tt.name     AS task_type_name,
    tt.icon     AS task_type_icon,
    au.full_name AS assignee_name,
    au.avatar_url AS assignee_avatar,
    ru.full_name  AS reporter_name,
    cu.full_name  AS closed_by_name
  FROM tasks t
  LEFT JOIN priorities  p  ON p.id  = t.priority_id
  LEFT JOIN task_types  tt ON tt.id = t.task_type_id
  LEFT JOIN users       au ON au.id = t.assignee_id
  LEFT JOIN users       ru ON ru.id = t.reporter_id
  LEFT JOIN users       cu ON cu.id = t.closed_by
  WHERE t.id = @taskId
`);

  return result.recordset[0] || null;
}

async function findLabelsByTaskId(taskId) {
  const pool = getPool();

  const result = await pool.request().input("taskId", sql.Int, taskId).query(`
    SELECT
      tl.id,
      tl.name,
      tl.color
    FROM label_task_map ltm
    INNER JOIN task_labels tl ON tl.id = ltm.label_id
    WHERE ltm.task_id = @taskId
    ORDER BY tl.name ASC
  `);

  return result.recordset;
}

async function findMaxTaskPositionByStatus(projectId, boardId, statusId) {
  const pool = getPool();

  const result = await pool
    .request()
    .input("projectId", sql.Int, projectId)
    .input("boardId", sql.Int, boardId)
    .input("statusId", sql.Int, statusId).query(`
      SELECT ISNULL(MAX(position), 0) AS maxPosition
      FROM tasks
      WHERE project_id = @projectId
        AND board_id = @boardId
        AND status_id = @statusId
    `);

  return result.recordset[0]?.maxPosition || 0;
}

async function createTask(payload) {
  const pool = getPool();

  const result = await pool
    .request()
    .input("project_id", sql.BigInt, payload.project_id)
    .input("board_id", sql.BigInt, payload.board_id)
    .input("status_id", sql.BigInt, payload.status_id)
    .input("priority_id", sql.BigInt, payload.priority_id)
    .input("assignee_id", sql.BigInt, payload.assignee_id)
    .input("reporter_id", sql.BigInt, payload.reporter_id)
    .input("title", sql.NVarChar(sql.MAX), payload.title)
    .input("description", sql.NVarChar(sql.MAX), payload.description)
    .input("start_date", sql.Date, payload.start_date)
    .input("due_date", sql.Date, payload.due_date)
    .input("position", sql.Int, payload.position)
    .input("task_type_id", sql.BigInt, payload.task_type_id)
    .input("task_key", sql.NVarChar(50), payload.task_key).query(`
      INSERT INTO tasks (
        project_id, board_id, status_id, priority_id, assignee_id,
        reporter_id, title, description, start_date, due_date,
        position, task_type_id, task_key
      )
      OUTPUT INSERTED.*
      VALUES (
        @project_id, @board_id, @status_id, @priority_id, @assignee_id,
        @reporter_id, @title, @description, @start_date, @due_date,
        @position, @task_type_id, @task_key
      )
    `);

  return result.recordset[0];
}

async function addLabelToTask(taskId, labelId) {
  const pool = getPool();
  await pool
    .request()
    .input("taskId", sql.Int, taskId)
    .input("labelId", sql.Int, labelId)
    .query(
      `INSERT INTO label_task_map (task_id, label_id) VALUES (@taskId, @labelId)`,
    );
}

async function findLastTaskNumberByProject(projectId) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("projectId", sql.Int, projectId)
    .query(`SELECT COUNT(*) AS total FROM tasks WHERE project_id = @projectId`);
  return result.recordset[0]?.total ?? 0;
}

async function updateTask(taskId, payload) {
  const pool = getPool();

  await pool
    .request()
    .input("taskId", sql.Int, taskId)
    .input("title", sql.NVarChar, payload.title)
    .input("description", sql.NVarChar, payload.description || null)
    .input("task_type_id", sql.Int, payload.task_type_id || null)
    .input("priority_id", sql.Int, payload.priority_id || null)
    .input("assignee_id", sql.Int, payload.assignee_id || null)
    .input("reporter_id", sql.Int, payload.reporter_id || null)
    .input("parent_task_id", sql.Int, payload.parent_task_id || null)
    .input("start_date", sql.DateTime, payload.start_date || null)
    .input("due_date", sql.DateTime, payload.due_date || null)
    .input("status_id", sql.Int, payload.status_id || null).query(`
      UPDATE tasks
      SET
        title = @title,
        description = @description,
        task_type_id = @task_type_id,
        priority_id = @priority_id,
        assignee_id = @assignee_id,
        reporter_id = @reporter_id,
        parent_task_id = @parent_task_id,
        start_date = @start_date,
        due_date = @due_date,
        status_id = @status_id
      WHERE id = @taskId
    `);
}

async function deleteTask(taskId) {
  const pool = getPool();

  await pool
    .request()
    .input("taskId", sql.Int, taskId)
    .query(`DELETE FROM tasks WHERE id = @taskId`);
}

async function checkValidTransition(projectId, fromStatusId, toStatusId) {
  if (Number(fromStatusId) === Number(toStatusId)) return true;

  const pool = getPool();

  const result = await pool
    .request()
    .input("projectId", sql.Int, projectId)
    .input("fromStatusId", sql.Int, fromStatusId)
    .input("toStatusId", sql.Int, toStatusId).query(`
      SELECT id
      FROM workflow_transitions
      WHERE project_id = @projectId
        AND from_status_id = @fromStatusId
        AND to_status_id = @toStatusId
    `);

  return result.recordset.length > 0;
}

async function shiftTasksForInsert(projectId, boardId, statusId, fromPosition) {
  const pool = getPool();

  await pool
    .request()
    .input("projectId", sql.Int, projectId)
    .input("boardId", sql.Int, boardId)
    .input("statusId", sql.Int, statusId)
    .input("fromPosition", sql.Int, fromPosition).query(`
      UPDATE tasks
      SET position = position + 1
      WHERE project_id = @projectId
        AND board_id = @boardId
        AND status_id = @statusId
        AND position >= @fromPosition
    `);
}

async function moveTask({ taskId, toStatusId, newPosition }) {
  const pool = getPool();

  await pool
    .request()
    .input("taskId", sql.Int, taskId)
    .input("toStatusId", sql.Int, toStatusId)
    .input("newPosition", sql.Int, newPosition).query(`
      UPDATE tasks
      SET status_id = @toStatusId, position = @newPosition
      WHERE id = @taskId
    `);
}

async function reorderTask({ taskId, statusId, newPosition }) {
  const pool = getPool();

  await pool
    .request()
    .input("taskId", sql.Int, taskId)
    .input("statusId", sql.Int, statusId)
    .input("newPosition", sql.Int, newPosition).query(`
      UPDATE tasks
      SET position = @newPosition, status_id = @statusId
      WHERE id = @taskId
    `);
}

async function completeTask(taskId, { resolution, note, closedBy }) {
  const pool = getPool();
  await pool
    .request()
    .input("taskId", sql.Int, taskId)
    .input("resolution", sql.NVarChar, resolution)
    .input("note", sql.NVarChar, note ?? null)
    .input("closedBy", sql.BigInt, closedBy).query(`
        UPDATE tasks
        SET
          is_completed    = 1,
          completed_at    = GETDATE(),
          resolution      = @resolution,
          resolution_note = @note,
          closed_by       = @closedBy
        WHERE id = @taskId
      `);
}

async function uncompleteTask(taskId) {
  const pool = getPool();

  await pool.request().input("taskId", sql.Int, taskId).query(`
      UPDATE tasks
      SET is_completed = 0, completed_at = NULL
      WHERE id = @taskId
    `);
}

async function archiveTask(taskId) {
  const pool = getPool();

  await pool.request().input("taskId", sql.Int, taskId).query(`
      UPDATE tasks
      SET is_archived = 1, archived_at = GETDATE()
      WHERE id = @taskId
    `);
}

async function unarchiveTask(taskId) {
  const pool = getPool();

  await pool.request().input("taskId", sql.Int, taskId).query(`
      UPDATE tasks
      SET is_archived = 0, archived_at = NULL
      WHERE id = @taskId
    `);
}

async function createActivityLog({
  taskId,
  userId,
  actionType,
  fieldName = null,
  oldValue = null,
  newValue = null,
}) {
  const pool = getPool();

  await pool
    .request()
    .input("taskId", sql.Int, taskId)
    .input("userId", sql.Int, userId)
    .input("actionType", sql.NVarChar, actionType)
    .input("fieldName", sql.NVarChar, fieldName)
    .input("oldValue", sql.NVarChar, oldValue)
    .input("newValue", sql.NVarChar, newValue).query(`
      INSERT INTO task_activity_logs (
        task_id, user_id, action_type, field_name, old_value, new_value
      )
      VALUES (
        @taskId, @userId, @actionType, @fieldName, @oldValue, @newValue
      )
    `);
}

async function findTaskComments(taskId) {
  const pool = getPool();

  const result = await pool.request().input("taskId", sql.Int, taskId).query(`
      SELECT
        tc.id,
        tc.task_id,
        tc.user_id,
        tc.content,
        tc.created_at,
        u.full_name,
        u.avatar_url
      FROM task_comments tc
      INNER JOIN users u ON u.id = tc.user_id
      WHERE tc.task_id = @taskId
      ORDER BY tc.created_at ASC
    `);

  return result.recordset;
}

async function addTaskComment(taskId, userId, content) {
  const pool = getPool();

  await pool
    .request()
    .input("taskId", sql.Int, taskId)
    .input("userId", sql.Int, userId)
    .input("content", sql.NVarChar, content).query(`
      INSERT INTO task_comments (task_id, user_id, content)
      VALUES (@taskId, @userId, @content)
    `);
}

async function findTaskActivities(taskId) {
  const pool = getPool();

  const result = await pool.request().input("taskId", sql.Int, taskId).query(`
      SELECT
        tal.id,
        tal.task_id,
        tal.user_id,
        tal.action_type,
        tal.field_name,
        tal.old_value,
        tal.new_value,
        tal.created_at,
        u.full_name,
        u.avatar_url
      FROM task_activity_logs tal
      INNER JOIN users u ON u.id = tal.user_id
      WHERE tal.task_id = @taskId
      ORDER BY tal.created_at DESC
    `);

  return result.recordset;
}

async function findSubTasksByParentId(parentTaskId) {
  const pool = getPool();

  const result = await pool
    .request()
    .input("parentTaskId", sql.Int, parentTaskId).query(`
      SELECT
        t.*,
        p.name AS priority_name,
        p.color AS priority_color,
        tt.name AS task_type_name,
        tt.icon AS task_type_icon,
        au.full_name AS assignee_name,
        au.avatar_url AS assignee_avatar,
        ru.full_name AS reporter_name
      FROM tasks t
      LEFT JOIN priorities p ON p.id = t.priority_id
      LEFT JOIN task_types tt ON tt.id = t.task_type_id
      LEFT JOIN users au ON au.id = t.assignee_id
      LEFT JOIN users ru ON ru.id = t.reporter_id
      WHERE t.parent_task_id = @parentTaskId
      ORDER BY t.position ASC
    `);

  return result.recordset;
}

async function removeLabelFromTask(taskId, labelId) {
  const pool = getPool();

  await pool
    .request()
    .input("taskId", sql.Int, taskId)
    .input("labelId", sql.Int, labelId)
    .query(
      `DELETE FROM label_task_map WHERE task_id = @taskId AND label_id = @labelId`,
    );
}

// Lịch sử công việc
async function findCompletedTasksByProject(projectId) {
  const pool = getPool();

  const result = await pool.request().input("projectId", sql.Int, projectId)
    .query(`
      SELECT
        t.id,
        t.task_key,
        t.title,
        t.status_id,
        t.priority_id,
        t.is_completed,
        t.completed_at,
        p.name AS priority_name,
        p.color AS priority_color,
        tt.name AS task_type_name,
        au.full_name AS assignee_name,
        au.avatar_url AS assignee_avatar,
        ru.full_name AS reporter_name,
        s.name AS status_name,
        s.color AS status_color
      FROM tasks t
      LEFT JOIN priorities p ON p.id = t.priority_id
      LEFT JOIN task_types tt ON tt.id = t.task_type_id
      LEFT JOIN users au ON au.id = t.assignee_id
      LEFT JOIN users ru ON ru.id = t.reporter_id
      LEFT JOIN statuses s ON s.id = t.status_id
      WHERE t.project_id = @projectId
        AND t.is_completed = 1
      ORDER BY t.completed_at DESC
    `);

  return result.recordset;
}
async function addAttachment(
  taskId,
  {
    fileName,
    fileUrl,
    fileSize,
    mimeType,
    uploadedBy,
    attachmentType = "report",
  },
) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("taskId", sql.BigInt, taskId)
    .input("fileName", sql.NVarChar(255), fileName)
    .input("fileUrl", sql.NVarChar(sql.MAX), fileUrl)
    .input("fileSize", sql.Int, fileSize)
    .input("mimeType", sql.NVarChar(100), mimeType)
    .input("uploadedBy", sql.BigInt, uploadedBy)
    .input("attachmentType", sql.NVarChar(20), attachmentType).query(`
      INSERT INTO task_attachments (task_id, file_name, file_url, file_size, mime_type, uploaded_by, attachment_type)
      OUTPUT INSERTED.*
      VALUES (@taskId, @fileName, @fileUrl, @fileSize, @mimeType, @uploadedBy, @attachmentType)
    `);
  return result.recordset[0];
}
async function findAttachmentsByTaskId(taskId) {
  const pool = getPool();
  const result = await pool.request().input("taskId", sql.BigInt, taskId)
    .query(`
      SELECT
        a.id,
        a.task_id,
        a.file_name,
        a.file_url,
        a.file_size,
        a.mime_type,
        a.attachment_type,
        a.created_at,
        u.full_name AS uploaded_by
      FROM task_attachments a
      LEFT JOIN users u ON u.id = a.uploaded_by
      WHERE a.task_id = @taskId
      ORDER BY a.created_at ASC
    `);
  return result.recordset;
}
async function deleteAttachment(attachmentId) {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.BigInt, attachmentId)
    .query(`DELETE FROM task_attachments WHERE id = @id`);
}

async function findChecklistsByTaskId(taskId) {
  const pool = getPool();
  const result = await pool.request().input("taskId", sql.BigInt, taskId)
    .query(`
      SELECT id, task_id, title, is_done, position, created_at
      FROM task_checklists
      WHERE task_id = @taskId
      ORDER BY position ASC, created_at ASC
    `);
  return result.recordset;
}

async function createChecklist(taskId, { title, position = 0 }) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("taskId", sql.BigInt, taskId)
    .input("title", sql.NVarChar(255), title)
    .input("position", sql.Int, position).query(`
      INSERT INTO task_checklists (task_id, title, is_done, position)
      OUTPUT INSERTED.*
      VALUES (@taskId, @title, 0, @position)
    `);
  return result.recordset[0];
}

async function updateChecklist(checklistId, { title, is_done }) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.BigInt, checklistId)
    .input("title", sql.NVarChar(255), title)
    .input("isDone", sql.Bit, is_done ? 1 : 0).query(`
      UPDATE task_checklists
      SET title = @title, is_done = @isDone
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset[0];
}

async function toggleChecklist(checklistId, isDone) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.BigInt, checklistId)
    .input("isDone", sql.Bit, isDone ? 1 : 0).query(`
      UPDATE task_checklists
      SET is_done = @isDone
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset[0];
}

async function deleteChecklist(checklistId) {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.BigInt, checklistId)
    .query(`DELETE FROM task_checklists WHERE id = @id`);
}
export {
  findTaskById,
  findLabelsByTaskId,
  findMaxTaskPositionByStatus,
  createTask,
  updateTask,
  deleteTask,
  checkValidTransition,
  shiftTasksForInsert,
  moveTask,
  reorderTask,
  completeTask,
  uncompleteTask,
  archiveTask,
  unarchiveTask,
  createActivityLog,
  findTaskComments,
  addTaskComment,
  findTaskActivities,
  findSubTasksByParentId,
  removeLabelFromTask,
  findLastTaskNumberByProject,
  addAttachment,
  findAttachmentsByTaskId,
  deleteAttachment,
  findCompletedTasksByProject,
  addLabelToTask,
  findChecklistsByTaskId,
  createChecklist,
  updateChecklist,
  toggleChecklist,
  deleteChecklist,
};
