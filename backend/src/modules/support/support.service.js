import { getPool, sql } from "../../config/db.js";

// ─── Tạo ticket ───────────────────────────────────────────────────────────────
export const createSupportTicket = async (userId, { title, content }) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("user_id", sql.BigInt, userId)
    .input("title", sql.NVarChar(200), title)
    .input("content", sql.NVarChar(sql.MAX), content).query(`
      INSERT INTO support_tickets (user_id, title, content, status, created_at)
      OUTPUT INSERTED.*
      VALUES (@user_id, @title, @content, 'open', SYSDATETIME())
    `);
  return result.recordset[0];
};

// ─── Lấy ticket của user ──────────────────────────────────────────────────────
export const getTicketsByUserId = async (userId) => {
  const pool = getPool();
  const result = await pool.request().input("user_id", sql.BigInt, userId)
    .query(`
      SELECT * FROM support_tickets
      WHERE user_id = @user_id
      ORDER BY created_at DESC
    `);
  return result.recordset;
};

// ─── Admin: lấy tất cả tickets ────────────────────────────────────────────────
export const getAllSupportTickets = async ({
  status,
  page = 1,
  limit = 20,
}) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const pool = getPool();

  const request = pool
    .request()
    .input("limit", sql.Int, parseInt(limit))
    .input("offset", sql.Int, offset);

  const whereClause = status ? "WHERE st.status = @status" : "";
  if (status) request.input("status", sql.NVarChar(20), status);

  const result = await request.query(`
    SELECT 
      st.*,
      u.full_name, u.email, u.employee_code, u.avatar_url
    FROM support_tickets st
    JOIN users u ON u.id = st.user_id
    ${whereClause}
    ORDER BY st.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `);

  const countRequest = pool.request();
  if (status) countRequest.input("status", sql.NVarChar(20), status);
  const countResult = await countRequest.query(`
    SELECT COUNT(*) AS total FROM support_tickets
    ${status ? "WHERE status = @status" : ""}
  `);

  return {
    tickets: result.recordset,
    total: countResult.recordset[0].total,
  };
};

// ─── Admin: cập nhật status / reply ──────────────────────────────────────────
export const updateTicket = async (ticketId, { status, admin_reply }) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, parseInt(ticketId))
    .input("status", sql.NVarChar(20), status)
    .input("admin_reply", sql.NVarChar(sql.MAX), admin_reply || null).query(`
      UPDATE support_tickets SET
        status      = @status,
        admin_reply = COALESCE(@admin_reply, admin_reply),
        updated_at  = SYSDATETIME()
      WHERE id = @id

      SELECT * FROM support_tickets WHERE id = @id
    `);
  return result.recordset[0];
};
