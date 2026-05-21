import { getPool, sql } from "../../config/db.js";

function calcHours(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 60 * 10) / 10;
}

export async function getMyRequests(userId) {
  const pool = await getPool();
  const res = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .query(`
      SELECT ot.*, u.full_name AS approver_name
      FROM overtime_requests ot
      LEFT JOIN users u ON u.id = ot.approved_by
      WHERE ot.user_id = @userId
      ORDER BY ot.work_date DESC
    `);
  return res.recordset;
}

export async function getAllRequests({ status, month, year, deptId } = {}) {
  const pool = await getPool();
  const req = pool.request();
  let where = "WHERE 1=1";
  if (status) { req.input("status", sql.NVarChar(20), status); where += " AND ot.status=@status"; }
  if (month)  { req.input("month",  sql.Int, month);  where += " AND MONTH(ot.work_date)=@month"; }
  if (year)   { req.input("year",   sql.Int, year);   where += " AND YEAR(ot.work_date)=@year"; }
  if (deptId) { req.input("deptId", sql.Int, deptId); where += " AND u.department_id=@deptId"; }

  const res = await req.query(`
    SELECT ot.*,
      u.full_name, u.employee_code,
      d.name AS department_name,
      a.full_name AS approver_name
    FROM overtime_requests ot
    JOIN  users u ON u.id = ot.user_id
    LEFT JOIN departments d ON d.id = u.department_id
    LEFT JOIN users a ON a.id = ot.approved_by
    ${where}
    ORDER BY ot.work_date DESC
  `);
  return res.recordset;
}

export async function createRequest(userId, data) {
  const { work_date, start_time, end_time, reason, coefficient } = data;
  const hours = calcHours(start_time, end_time);
  if (hours <= 0) throw new Error("Giờ kết thúc phải sau giờ bắt đầu");

  const pool = await getPool();
  const res = await pool
    .request()
    .input("userId",      sql.BigInt,       userId)
    .input("workDate",    sql.Date,          work_date)
    .input("startTime",   sql.NVarChar(10),  start_time)
    .input("endTime",     sql.NVarChar(10),  end_time)
    .input("hours",       sql.Decimal(4, 1), hours)
    .input("reason",      sql.NVarChar(500), reason ?? null)
    .input("coefficient", sql.Decimal(3, 2), coefficient ?? 1.5)
    .query(`
      INSERT INTO overtime_requests
        (user_id, work_date, start_time, end_time, hours, reason, coefficient, status)
      OUTPUT INSERTED.*
      VALUES (@userId, @workDate, @startTime, @endTime, @hours, @reason, @coefficient, 'pending')
    `);
  return res.recordset[0];
}

export async function approve(id, approverId, note) {
  const pool = await getPool();
  await pool
    .request()
    .input("id",         sql.Int,          id)
    .input("approverId", sql.BigInt,        approverId)
    .input("note",       sql.NVarChar(500), note ?? null)
    .query(`
      UPDATE overtime_requests
      SET status='approved', approved_by=@approverId, approved_at=GETDATE()
      WHERE id=@id AND status='pending'
    `);
}

export async function reject(id, approverId, note) {
  const pool = await getPool();
  await pool
    .request()
    .input("id",         sql.Int,          id)
    .input("approverId", sql.BigInt,        approverId)
    .input("note",       sql.NVarChar(500), note ?? null)
    .query(`
      UPDATE overtime_requests
      SET status='rejected', approved_by=@approverId, approved_at=GETDATE(), reject_note=@note
      WHERE id=@id AND status='pending'
    `);
}

export async function getMonthlySummary(month, year) {
  const pool = await getPool();
  const res = await pool
    .request()
    .input("month", sql.Int, month)
    .input("year",  sql.Int, year)
    .query(`
      SELECT
        u.full_name, u.employee_code,
        d.name AS department_name,
        SUM(ot.hours) AS total_hours,
        SUM(ot.hours * ot.coefficient) AS weighted_hours,
        COUNT(*) AS sessions
      FROM overtime_requests ot
      JOIN  users u ON u.id = ot.user_id
      LEFT JOIN departments d ON d.id = u.department_id
      WHERE ot.status = 'approved'
        AND MONTH(ot.work_date) = @month
        AND YEAR(ot.work_date)  = @year
      GROUP BY u.id, u.full_name, u.employee_code, d.name
      ORDER BY u.full_name
    `);
  return res.recordset;
}
