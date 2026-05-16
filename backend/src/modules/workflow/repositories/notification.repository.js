import { getPool, sql } from "../../../config/db.js";

async function createNotification({
  userId,
  type,
  title,
  message,
  taskId = null,
}) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("type", sql.NVarChar(50), type)
    .input("title", sql.NVarChar(255), title)
    .input("message", sql.NVarChar(500), message ?? null)
    .input("taskId", sql.BigInt, taskId).query(`
      INSERT INTO notifications (user_id, type, title, message, task_id)
      OUTPUT INSERTED.*
      VALUES (@userId, @type, @title, @message, @taskId)
    `);
  return result.recordset[0];
}

async function findNotificationsByUser(userId, limit = 20) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("limit", sql.Int, limit).query(`
      SELECT TOP (@limit)
        n.id, n.user_id, n.type, n.title, n.message,
        n.task_id, n.is_read, n.created_at,
        t.task_key, t.title AS task_title
      FROM notifications n
      LEFT JOIN tasks t ON t.id = n.task_id
      WHERE n.user_id = @userId
      ORDER BY n.created_at DESC
    `);
  return result.recordset;
}

async function markNotificationRead(notificationId, userId) {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.BigInt, notificationId)
    .input("userId", sql.BigInt, userId)
    .query(
      `UPDATE notifications SET is_read = 1 WHERE id = @id AND user_id = @userId`,
    );
}

async function markAllNotificationsRead(userId) {
  const pool = getPool();
  await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .query(`UPDATE notifications SET is_read = 1 WHERE user_id = @userId`);
}

async function countUnreadNotifications(userId) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .query(
      `SELECT COUNT(*) AS count FROM notifications WHERE user_id = @userId AND is_read = 0`,
    );
  return result.recordset[0]?.count ?? 0;
}

export {
  createNotification,
  findNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead,
  countUnreadNotifications,
};
