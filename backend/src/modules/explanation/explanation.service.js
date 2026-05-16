import { getPool } from "../../config/db.js";

// ── Tạo đơn giải trình ──────────────────────────────────────────────────────
export async function createExplanation({
  userId,
  workDate,
  reason,
  requestedCheckIn,
  requestedCheckOut,
}) {
  const pool = await getPool();

  // Tìm attendance_log_id theo user + ngày
  const logRes = await pool
    .request()
    .input("userId", userId)
    .input("workDate", workDate).query(`
      SELECT id FROM attendance_logs
      WHERE user_id = @userId AND work_date = @workDate
    `);

  let logId = logRes.recordset[0]?.id ?? null;

  // Nếu chưa có log (ngày vắng) thì tạo mới
  if (!logId) {
    const newLog = await pool
      .request()
      .input("userId", userId)
      .input("workDate", workDate).query(`
        INSERT INTO attendance_logs (user_id, work_date, status)
        OUTPUT INSERTED.id
        VALUES (@userId, @workDate, 'absent')
      `);
    logId = newLog.recordset[0].id;
  }

  // Kiểm tra đã có đơn pending chưa
  const existing = await pool
    .request()
    .input("logId", logId)
    .input("userId", userId).query(`
      SELECT id FROM attendance_corrections
      WHERE attendance_log_id = @logId AND requested_by = @userId AND status = 'pending'
    `);

  if (existing.recordset.length > 0) {
    throw new Error("Đã có đơn giải trình đang chờ duyệt cho ngày này");
  }

  const result = await pool
    .request()
    .input("logId", logId)
    .input("userId", userId)
    .input("reason", reason)
    .input("checkIn", requestedCheckIn ?? null)
    .input("checkOut", requestedCheckOut ?? null).query(`
      INSERT INTO attendance_corrections
        (attendance_log_id, requested_by, reason, corrected_check_in, corrected_check_out, status)
      OUTPUT INSERTED.id
      VALUES (@logId, @userId, @reason, @checkIn, @checkOut, 'pending')
    `);

  return result.recordset[0].id;
}

// ── Lấy danh sách đơn của user ──────────────────────────────────────────────
export async function getUserExplanations(userId) {
  const pool = await getPool();
  const result = await pool.request().input("userId", userId).query(`
      SELECT
        ac.id,
        al.work_date,
        ac.reason,
        ac.corrected_check_in,
        ac.corrected_check_out,
        ac.status,
        ac.admin_note,
        ac.reviewed_at,
        ac.created_at,
        al.check_in_time,
        al.check_out_time
      FROM attendance_corrections ac
      JOIN attendance_logs al ON ac.attendance_log_id = al.id
      WHERE ac.requested_by = @userId
      ORDER BY ac.created_at DESC
    `);
  return result.recordset;
}

// ── Admin: lấy tất cả đơn ───────────────────────────────────────────────────
export async function getAllExplanations({ status, page = 1, limit = 20 }) {
  const pool = await getPool();
  const offset = (page - 1) * limit;

  const result = await pool
    .request()
    .input("status", status ?? null)
    .input("limit", limit)
    .input("offset", offset).query(`
      SELECT
        ac.id,
        ac.status,
        ac.reason,
        ac.corrected_check_in,
        ac.corrected_check_out,
        ac.reviewed_at,
        ac.created_at,
        al.work_date,
        al.check_in_time,
        al.check_out_time,
        u.full_name AS employee_name,
        u.phone
      FROM attendance_corrections ac
      JOIN attendance_logs al ON ac.attendance_log_id = al.id
      JOIN users u ON ac.requested_by = u.id
      WHERE (@status IS NULL OR ac.status = @status)
      ORDER BY ac.created_at DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);
  return result.recordset;
}

// ── Admin: duyệt đơn ────────────────────────────────────────────────────────
export async function approveExplanation({ id, adminId, adminNote }) {
  const pool = await getPool();

  // Lấy thông tin đơn
  const corrRes = await pool.request().input("id", id).query(`
      SELECT ac.*, al.user_id
      FROM attendance_corrections ac
      JOIN attendance_logs al ON ac.attendance_log_id = al.id
      WHERE ac.id = @id
    `);

  const corr = corrRes.recordset[0];
  if (!corr) throw new Error("Không tìm thấy đơn");
  if (corr.status !== "pending") throw new Error("Đơn đã được xử lý");

  // Cập nhật attendance_log
  await pool
    .request()
    .input("logId", corr.attendance_log_id)
    .input("checkIn", corr.corrected_check_in)
    .input("checkOut", corr.corrected_check_out).query(`
      UPDATE attendance_logs
      SET
        check_in_time = COALESCE(@checkIn, check_in_time),
        check_out_time = COALESCE(@checkOut, check_out_time),
        status = 'present',
        updated_at = SYSDATETIME()
      WHERE id = @logId
    `);

  // Cập nhật status đơn
  await pool
    .request()
    .input("id", id)
    .input("adminId", adminId)
    .input("adminNote", adminNote ?? null).query(`
      UPDATE attendance_corrections
      SET status = 'approved', approved_by = @adminId,
          admin_note = @adminNote, reviewed_at = SYSDATETIME()
      WHERE id = @id
    `);
}

// ── Admin: từ chối đơn ──────────────────────────────────────────────────────
export async function rejectExplanation({ id, adminId, adminNote }) {
  const pool = await getPool();

  const corr = await pool
    .request()
    .input("id", id)
    .query(`SELECT status FROM attendance_corrections WHERE id = @id`);

  if (!corr.recordset[0]) throw new Error("Không tìm thấy đơn");
  if (corr.recordset[0].status !== "pending")
    throw new Error("Đơn đã được xử lý");

  await pool
    .request()
    .input("id", id)
    .input("adminId", adminId)
    .input("adminNote", adminNote ?? null).query(`
      UPDATE attendance_corrections
      SET status = 'rejected', approved_by = @adminId,
          admin_note = @adminNote, reviewed_at = SYSDATETIME()
      WHERE id = @id
    `);
}

//---Đem đơn pending -------------------------------------
export async function getPendingCount() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT COUNT(*) AS count
      FROM attendance_corrections
      WHERE status = 'pending'`);
  return result.recordset[0].count;
}
