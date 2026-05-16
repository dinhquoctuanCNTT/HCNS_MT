import * as attendanceService from "../services/attendance.service.js";
import { getPool } from "../config/db.js";

export async function registerFace(req, res) {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "Thiếu ảnh" });
    const result = await attendanceService.registerFace(req.user.id, image);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function checkIn(req, res) {
  try {
    const { image, latitude, longitude } = req.body;
    if (!image) return res.status(400).json({ message: "Thiếu ảnh" });
    const result = await attendanceService.checkIn(req.user.id, image, {
      latitude,
      longitude,
    });
    res.json(result);
  } catch (err) {
    console.error("[checkIn FULL ERROR]", err);
    res.status(400).json({ message: err.message });
  }
}

export async function checkOut(req, res) {
  try {
    const { image, latitude, longitude } = req.body;
    if (!image) return res.status(400).json({ message: "Thiếu ảnh" });
    const result = await attendanceService.checkOut(req.user.id, image, {
      latitude,
      longitude,
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getHistory(req, res) {
  try {
    const { from, to } = req.query;
    const fromDate = from || new Date().toISOString().slice(0, 7) + "-01";
    const toDate = to || new Date().toISOString().slice(0, 10);
    const data = await attendanceService.getAttendanceHistory(
      req.user.id,
      fromDate,
      toDate,
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createLeaveRequest(req, res) {
  try {
    const data = await attendanceService.createLeaveRequest(
      req.user.id,
      req.body,
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getLeaveRequests(req, res) {
  try {
    const { status } = req.query;
    const data = await attendanceService.getLeaveRequests(req.user.id, status);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ── Admin: lịch sử có filter + phân trang ────────────────────────────────────
export async function getHistoryAdmin(req, res) {
  try {
    const pool = await getPool();
    const {
      from,
      to,
      userId,
      status,
      page = 1,
      limit = 20,
      departmentId,
      branchId,
    } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const offset = (pageInt - 1) * limitInt;

    // Build shared where clause and a helper to add inputs to any request
    let where = "WHERE 1=1";
    const addInputs = (req) => {
      if (from)         req.input("from", from);
      if (to)           req.input("to", to);
      if (userId)       req.input("userId", parseInt(userId));
      if (departmentId) req.input("deptId", parseInt(departmentId));
      if (branchId)     req.input("branchId", parseInt(branchId));
    };

    if (from)         where += " AND a.date >= @from";
    if (to)           where += " AND a.date <= @to";
    if (userId)       where += " AND a.user_id = @userId";
    if (departmentId) where += " AND u.department_id = @deptId";
    if (branchId)     where += " AND u.branch_id = @branchId";
    if (status === "late")    where += " AND a.late_minutes > 0";
    if (status === "absent")  where += " AND a.check_in IS NULL";
    if (status === "normal")  where += " AND a.check_in IS NOT NULL AND (a.late_minutes IS NULL OR a.late_minutes = 0)";
    if (status === "missing") where += " AND a.check_in IS NOT NULL AND a.check_out IS NULL";

    const baseJoin = `
      FROM Attendance a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN office_locations ol ON u.branch_id = ol.id
      ${where}
    `;

    // Count — separate request
    const countReq = pool.request();
    addInputs(countReq);
    const countRes = await countReq
      .query(`SELECT COUNT(*) AS total ${baseJoin}`)
      .catch(() => ({ recordset: [{ total: 0 }] }));
    const total = countRes.recordset[0]?.total || 0;

    // Data — separate request
    const dataReq = pool.request().input("limitN", limitInt).input("offsetN", offset);
    addInputs(dataReq);
    const result = await dataReq.query(`
      SELECT
        a.id,
        a.date,
        a.check_in,
        a.check_out,
        a.late_minutes,
        a.early_minutes,
        a.note,
        a.check_in_image_url,
        a.check_out_image_url,
        CASE
          WHEN a.check_in IS NULL THEN 'absent'
          WHEN a.late_minutes > 0 THEN 'late'
          WHEN a.check_out IS NULL THEN 'missing'
          ELSE 'normal'
        END AS status,
        u.id             AS user_id,
        u.full_name,
        u.phone,
        u.employee_code,
        d.name           AS department_name,
        ol.name          AS branch_name
      ${baseJoin}
      ORDER BY a.date DESC, a.id DESC
      OFFSET @offsetN ROWS FETCH NEXT @limitN ROWS ONLY
    `);

    res.json({
      data: result.recordset,
      pagination: {
        page: pageInt,
        limit: limitInt,
        total,
        totalPages: Math.ceil(total / limitInt),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getAttendanceStats(req, res) {
  try {
    const { employeeId, month } = req.query;
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const userId =
      employeeId && req.user.role === "admin"
        ? parseInt(employeeId)
        : req.user.id;
    const data = await attendanceService.getAttendanceStats(
      userId,
      targetMonth,
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getAllLeaveRequests(req, res) {
  try {
    const { status } = req.query;
    const data = await attendanceService.getAllLeaveRequests(status);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function approveLeaveRequest(req, res) {
  try {
    await attendanceService.approveLeaveRequest(
      parseInt(req.params.id),
      req.user.id,
    );
    res.json({ message: "Đã duyệt đơn" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function rejectLeaveRequest(req, res) {
  try {
    const { reason } = req.body;
    await attendanceService.rejectLeaveRequest(
      parseInt(req.params.id),
      req.user.id,
      reason,
    );
    res.json({ message: "Đã từ chối đơn" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getLeaveStats(req, res) {
  try {
    const pool = await getPool();
    const { date } = req.query;
    const month = date ? date.slice(0, 7) : new Date().toISOString().slice(0, 7);
    const [y, m] = month.split("-");
    const from = `${y}-${m}-01`;
    const last = new Date(parseInt(y), parseInt(m), 0).getDate();
    const to = `${y}-${m}-${String(last).padStart(2, "0")}`;

    const result = await pool
      .request()
      .input("from", from)
      .input("to", to)
      .query(`
        SELECT
          ISNULL(leave_type, N'Không xác định') AS leave_type,
          COUNT(*) AS count
        FROM leave_requests
        WHERE status = 'approved'
          AND from_date <= @to AND to_date >= @from
        GROUP BY leave_type
        ORDER BY count DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
