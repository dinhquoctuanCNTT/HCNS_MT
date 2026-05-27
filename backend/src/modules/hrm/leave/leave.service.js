import { getPool, sql } from "../../../shared/config/db.js";

// ── Leave Balance ─────────────────────────────────────────────────────────────

export async function getLeaveBalance(userId, year) {
  const pool = await getPool();
  const res = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("year", sql.Int, year)
    .query(`
      SELECT lb.*, u.full_name, u.hire_date
      FROM leave_balance lb
      JOIN users u ON u.id = lb.user_id
      WHERE lb.user_id = @userId AND lb.year = @year
    `);
  return res.recordset[0] ?? null;
}

export async function getAllLeaveBalances(year) {
  const pool = await getPool();
  const res = await pool
    .request()
    .input("year", sql.Int, year)
    .query(`
      SELECT lb.*, u.full_name, u.employee_code, d.name AS department_name
      FROM leave_balance lb
      JOIN users u ON u.id = lb.user_id
      LEFT JOIN departments d ON d.id = u.department_id
      WHERE lb.year = @year
      ORDER BY u.full_name
    `);
  return res.recordset;
}

async function ensureBalance(pool, userId, year) {
  const existing = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("year", sql.Int, year)
    .query(`SELECT id FROM leave_balance WHERE user_id=@userId AND year=@year`);
  if (existing.recordset.length === 0) {
    await pool
      .request()
      .input("userId", sql.BigInt, userId)
      .input("year", sql.Int, year)
      .query(`INSERT INTO leave_balance (user_id, year) VALUES (@userId, @year)`);
  }
}

export async function addLeaveDay(userId, year) {
  const pool = await getPool();
  await ensureBalance(pool, userId, year);
  await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("year", sql.Int, year)
    .query(`
      UPDATE leave_balance
      SET total_days = total_days + 1, updated_at = GETDATE()
      WHERE user_id = @userId AND year = @year
    `);
}

export async function deductLeaveBalance(userId, year, days) {
  const pool = await getPool();
  await ensureBalance(pool, userId, year);
  await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("year", sql.Int, year)
    .input("days", sql.Decimal(5, 1), days)
    .query(`
      UPDATE leave_balance
      SET used_days = used_days + @days, updated_at = GETDATE()
      WHERE user_id = @userId AND year = @year
    `);
}

export async function restoreLeaveBalance(userId, year, days) {
  const pool = await getPool();
  await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("year", sql.Int, year)
    .input("days", sql.Decimal(5, 1), days)
    .query(`
      UPDATE leave_balance
      SET used_days = CASE WHEN used_days - @days < 0 THEN 0 ELSE used_days - @days END,
          updated_at = GETDATE()
      WHERE user_id = @userId AND year = @year
    `);
}

// ── Leave Requests ────────────────────────────────────────────────────────────

export async function getMyLeaveRequests(userId) {
  const pool = await getPool();
  const res = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .query(`
      SELECT lr.*,
        tbp.full_name AS tbp_name,
        hcns.full_name AS hcns_name
      FROM leave_requests lr
      LEFT JOIN users tbp  ON tbp.id  = lr.tbp_approved_by
      LEFT JOIN users hcns ON hcns.id = lr.hcns_approved_by
      WHERE lr.user_id = @userId
      ORDER BY lr.created_at DESC
    `);
  return res.recordset;
}

export async function getAllRequests({ status, deptId, month, year } = {}) {
  const pool = await getPool();
  const req = pool.request();
  let where = "WHERE 1=1";
  if (status) { req.input("status", sql.NVarChar(30), status); where += " AND lr.status=@status"; }
  if (deptId) { req.input("deptId", sql.Int, deptId); where += " AND u.department_id=@deptId"; }
  if (month)  { req.input("month", sql.Int, month); where += " AND MONTH(lr.from_date)=@month"; }
  if (year)   { req.input("year",  sql.Int, year);  where += " AND YEAR(lr.from_date)=@year"; }

  const res = await req.query(`
    SELECT lr.*,
      u.full_name, u.employee_code,
      d.name AS department_name,
      tbp.full_name  AS tbp_name,
      hcns.full_name AS hcns_name
    FROM leave_requests lr
    JOIN  users u    ON u.id    = lr.user_id
    LEFT JOIN departments d    ON d.id    = u.department_id
    LEFT JOIN users tbp  ON tbp.id  = lr.tbp_approved_by
    LEFT JOIN users hcns ON hcns.id = lr.hcns_approved_by
    ${where}
    ORDER BY lr.created_at DESC
  `);
  return res.recordset;
}

export async function getRequestById(id) {
  const pool = await getPool();
  const res = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`
      SELECT lr.*,
        u.full_name, u.employee_code, u.email,
        d.name AS department_name,
        tbp.full_name  AS tbp_name,
        hcns.full_name AS hcns_name
      FROM leave_requests lr
      JOIN  users u ON u.id = lr.user_id
      LEFT JOIN departments d    ON d.id   = u.department_id
      LEFT JOIN users tbp  ON tbp.id  = lr.tbp_approved_by
      LEFT JOIN users hcns ON hcns.id = lr.hcns_approved_by
      WHERE lr.id = @id
    `);
  return res.recordset[0] ?? null;
}

export async function createRequest(userId, data) {
  const { leave_type, leave_category, from_date, to_date, total_days, reason } = data;
  const pool = await getPool();
  const res = await pool
    .request()
    .input("userId",   sql.BigInt,       userId)
    .input("type",     sql.NVarChar(50),  leave_type   ?? "Phép năm")
    .input("category", sql.NVarChar(30),  leave_category ?? "annual")
    .input("from",     sql.Date,          from_date)
    .input("to",       sql.Date,          to_date)
    .input("days",     sql.Decimal(5, 1), total_days ?? 1)
    .input("reason",   sql.NVarChar(500), reason ?? null)
    .query(`
      INSERT INTO leave_requests
        (user_id, leave_type, leave_category, from_date, to_date, total_days, reason, status)
      OUTPUT INSERTED.*
      VALUES (@userId, @type, @category, @from, @to, @days, @reason, 'pending')
    `);
  return res.recordset[0];
}

export async function cancelRequest(id, userId) {
  const pool = await getPool();
  const res = await pool
    .request()
    .input("id", sql.Int, id)
    .input("userId", sql.BigInt, userId)
    .query(`
      UPDATE leave_requests SET status='cancelled'
      OUTPUT INSERTED.*
      WHERE id=@id AND user_id=@userId AND status='pending'
    `);
  return res.recordset[0] ?? null;
}

// Bước 1 — Trưởng bộ phận duyệt
export async function tbpApprove(id, approverId, note) {
  const pool = await getPool();
  await pool
    .request()
    .input("id",         sql.Int,          id)
    .input("approverId", sql.BigInt,        approverId)
    .input("note",       sql.NVarChar(500), note ?? null)
    .query(`
      UPDATE leave_requests
      SET status='tbp_approved', tbp_approved_by=@approverId,
          tbp_approved_at=GETDATE(), tbp_note=@note
      WHERE id=@id AND status='pending'
    `);
}

export async function tbpReject(id, approverId, note) {
  const pool = await getPool();
  await pool
    .request()
    .input("id",         sql.Int,          id)
    .input("approverId", sql.BigInt,        approverId)
    .input("note",       sql.NVarChar(500), note ?? null)
    .query(`
      UPDATE leave_requests
      SET status='rejected', tbp_approved_by=@approverId,
          tbp_approved_at=GETDATE(), tbp_note=@note
      WHERE id=@id AND status='pending'
    `);
}

// Bước 2 — HCNS duyệt cuối
export async function hcnsApprove(id, approverId, note) {
  const pool = await getPool();
  // Lấy thông tin request trước để trừ ngày phép
  const info = await getRequestById(id);
  if (!info) throw new Error("Không tìm thấy đơn");

  await pool
    .request()
    .input("id",         sql.Int,          id)
    .input("approverId", sql.BigInt,        approverId)
    .input("note",       sql.NVarChar(500), note ?? null)
    .query(`
      UPDATE leave_requests
      SET status='approved', approved_by=@approverId, approved_at=GETDATE(),
          hcns_approved_by=@approverId, hcns_approved_at=GETDATE(), hcns_note=@note
      WHERE id=@id AND status='tbp_approved'
    `);

  // Trừ ngày phép nếu là phép năm
  if (info.leave_category === "annual") {
    await deductLeaveBalance(info.user_id, new Date(info.from_date).getFullYear(), info.total_days);
  }
}

export async function hcnsReject(id, approverId, note) {
  const pool = await getPool();
  await pool
    .request()
    .input("id",         sql.Int,          id)
    .input("approverId", sql.BigInt,        approverId)
    .input("note",       sql.NVarChar(500), note ?? null)
    .query(`
      UPDATE leave_requests
      SET status='rejected', approved_by=@approverId, approved_at=GETDATE(),
          hcns_approved_by=@approverId, hcns_approved_at=GETDATE(), hcns_note=@note, reject_reason=@note
      WHERE id=@id AND status='tbp_approved'
    `);
}

// ── Thống kê ──────────────────────────────────────────────────────────────────

export async function getLeaveStats(year) {
  const pool = await getPool();
  const res = await pool
    .request()
    .input("year", sql.Int, year)
    .query(`
      SELECT
        (SELECT COUNT(*) FROM leave_requests WHERE status='pending')                              AS pending,
        (SELECT COUNT(*) FROM leave_requests WHERE status='tbp_approved')                         AS waiting_hcns,
        (SELECT COUNT(*) FROM leave_requests WHERE status='approved' AND YEAR(from_date)=@year)   AS approved,
        (SELECT COUNT(*) FROM leave_requests WHERE status='rejected' AND YEAR(created_at)=@year)  AS rejected
    `);
  return res.recordset[0];
}
