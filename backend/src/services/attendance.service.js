import { getPool, sql } from "../config/db.js";
import { extractDescriptorFromBase64, compareFaces } from "./face.service.js";

const ANTI_SPOOF_URL = "http://localhost:8000/check-liveness";

// ── Helpers ───────────────────────────────────────────────
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function checkGpsFence(latitude, longitude) {
  if (!latitude || !longitude) return { allowed: true, location: null };
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT id, name, latitude, longitude, radius
    FROM office_locations WHERE is_active = 1
  `);
  for (const loc of result.recordset) {
    const dist = getDistance(latitude, longitude, loc.latitude, loc.longitude);
    if (dist <= loc.radius) {
      return { allowed: true, location: loc.name, distance: Math.round(dist) };
    }
  }
  return { allowed: false, location: null, distance: null };
}

async function checkLiveness(base64Image) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(ANTI_SPOOF_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return await response.json();
  } catch (err) {
    return { is_real: true, confidence: 0, message: "Anti-spoof unavailable" };
  }
}

// ── Face Registration ─────────────────────────────────────
export async function registerFace(userId, base64Image) {
  const [liveness, descriptor] = await Promise.all([
    checkLiveness(base64Image),
    extractDescriptorFromBase64(base64Image),
  ]);
  if (!liveness.is_real) {
    throw new Error(`Phát hiện ảnh giả khi đăng ký (${liveness.message})`);
  }
  const pool = getPool();
  await pool
    .request()
    .input("userId", sql.Int, userId)
    .input(
      "faceDescriptor",
      sql.NVarChar(sql.MAX),
      JSON.stringify(Array.from(descriptor)),
    )
    .query(
      `UPDATE Users SET face_descriptor = @faceDescriptor WHERE id = @userId`,
    );
  return { success: true, message: "Đăng ký khuôn mặt thành công" };
}

// ── Check-in ──────────────────────────────────────────────
export async function checkIn(
  userId,
  base64Image,
  { latitude, longitude } = {},
) {
  const pool = getPool();
  const [liveness, newDescriptor, userResult, gpsCheck] = await Promise.all([
    checkLiveness(base64Image),
    extractDescriptorFromBase64(base64Image),
    pool
      .request()
      .input("userId", sql.Int, userId)
      .query(`SELECT face_descriptor FROM Users WHERE id = @userId`),
    checkGpsFence(latitude, longitude),
  ]);

  if (!liveness.is_real)
    throw new Error(`Phát hiện gian lận: ${liveness.message}`);
  if (!gpsCheck.allowed)
    throw new Error("Bạn không trong khu vực cho phép chấm công");

  const user = userResult.recordset[0];
  if (!user?.face_descriptor) throw new Error("Bạn chưa đăng ký khuôn mặt");

  const storedDescriptor = new Float32Array(JSON.parse(user.face_descriptor));
  const result = compareFaces(storedDescriptor, newDescriptor);
  if (!result.isSamePerson)
    throw new Error(`Khuôn mặt không khớp (${result.confidence}%)`);

  const today = new Date().toISOString().slice(0, 10);
  const existing = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today)
    .query(
      `SELECT id FROM Attendance WHERE user_id = @userId AND date = @date`,
    );

  if (existing.recordset[0]) throw new Error("Bạn đã chấm công hôm nay rồi");

  const now = new Date();
  await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today)
    .input("checkIn", sql.DateTime, now)
    .input("lat", sql.Float, latitude ?? null)
    .input("lng", sql.Float, longitude ?? null)
    .input("locationVerified", sql.Bit, gpsCheck.allowed ? 1 : 0)
    .input("antiSpoofScore", sql.Float, liveness.confidence ?? 0).query(`
      INSERT INTO Attendance (user_id, date, check_in, latitude, longitude, location_verified, face_verified, anti_spoof_score)
      VALUES (@userId, @date, @checkIn, @lat, @lng, @locationVerified, 1, @antiSpoofScore)
    `);

  return {
    action: "check_in",
    time: now,
    confidence: result.confidence,
    location: gpsCheck.location,
  };
}

// ── Check-out ─────────────────────────────────────────────
export async function checkOut(
  userId,
  base64Image,
  { latitude, longitude } = {},
) {
  const pool = getPool();
  const [liveness, newDescriptor, userResult, gpsCheck] = await Promise.all([
    checkLiveness(base64Image),
    extractDescriptorFromBase64(base64Image),
    pool
      .request()
      .input("userId", sql.Int, userId)
      .query(`SELECT face_descriptor FROM Users WHERE id = @userId`),
    checkGpsFence(latitude, longitude),
  ]);

  if (!liveness.is_real)
    throw new Error(`Phát hiện gian lận: ${liveness.message}`);
  if (!gpsCheck.allowed)
    throw new Error("Bạn không trong khu vực cho phép chấm công");

  const user = userResult.recordset[0];
  if (!user?.face_descriptor) throw new Error("Bạn chưa đăng ký khuôn mặt");

  const storedDescriptor = new Float32Array(JSON.parse(user.face_descriptor));
  const result = compareFaces(storedDescriptor, newDescriptor);
  if (!result.isSamePerson)
    throw new Error(`Khuôn mặt không khớp (${result.confidence}%)`);

  const today = new Date().toISOString().slice(0, 10);
  const existing = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today)
    .query(
      `SELECT id, check_in, check_out FROM Attendance WHERE user_id = @userId AND date = @date`,
    );

  const record = existing.recordset[0];
  if (!record) throw new Error("Bạn chưa chấm công vào hôm nay");
  if (record.check_out) throw new Error("Bạn đã chấm ra hôm nay rồi");

  const now = new Date();
  await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today)
    .input("checkOut", sql.DateTime, now)
    .query(
      `UPDATE Attendance SET check_out = @checkOut WHERE user_id = @userId AND date = @date`,
    );

  return { action: "check_out", time: now, confidence: result.confidence };
}

// ── Lịch sử ──────────────────────────────────────────────
export async function getAttendanceHistory(userId, fromDate, toDate) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("from", sql.Date, fromDate)
    .input("to", sql.Date, toDate).query(`
      SELECT id, date, check_in, check_out, face_verified, note,
             anti_spoof_score, location_verified, latitude, longitude
      FROM Attendance
      WHERE user_id = @userId AND date BETWEEN @from AND @to
      ORDER BY date DESC
    `);
  return result.recordset;
}

// ── Office Locations ──────────────────────────────────────
export async function getOfficeLocations() {
  const pool = getPool();
  const result = await pool
    .request()
    .query(`SELECT * FROM office_locations ORDER BY created_at DESC`);
  return result.recordset;
}

export async function createOfficeLocation({
  name,
  latitude,
  longitude,
  radius = 100,
}) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("name", sql.NVarChar(255), name)
    .input("latitude", sql.Float, latitude)
    .input("longitude", sql.Float, longitude)
    .input("radius", sql.Int, radius).query(`
      INSERT INTO office_locations (name, latitude, longitude, radius)
      OUTPUT INSERTED.*
      VALUES (@name, @latitude, @longitude, @radius)
    `);
  return result.recordset[0];
}

export async function updateOfficeLocation(
  id,
  { name, latitude, longitude, radius, is_active },
) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("name", sql.NVarChar(255), name)
    .input("latitude", sql.Float, latitude)
    .input("longitude", sql.Float, longitude)
    .input("radius", sql.Int, radius)
    .input("isActive", sql.Bit, is_active).query(`
      UPDATE office_locations
      SET name=@name, latitude=@latitude, longitude=@longitude, radius=@radius, is_active=@isActive
      OUTPUT INSERTED.*
      WHERE id=@id
    `);
  return result.recordset[0];
}

export async function deleteOfficeLocation(id) {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM office_locations WHERE id=@id`);
}

// ── Leave Requests ────────────────────────────────────────
export async function getLeaveRequests(userId, status) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("status", sql.NVarChar(20), status ?? null).query(`
      SELECT lr.*, u.full_name as approver_name
      FROM leave_requests lr
      LEFT JOIN users u ON u.id = lr.approved_by
      WHERE lr.user_id = @userId AND (@status IS NULL OR lr.status = @status)
      ORDER BY lr.created_at DESC
    `);
  return result.recordset;
}

export async function getAllLeaveRequests(status) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("status", sql.NVarChar(20), status ?? null).query(`
      SELECT lr.*, u.full_name as user_name, a.full_name as approver_name
      FROM leave_requests lr
      LEFT JOIN users u ON u.id = lr.user_id
      LEFT JOIN users a ON a.id = lr.approved_by
      WHERE (@status IS NULL OR lr.status = @status)
      ORDER BY lr.created_at DESC
    `);
  return result.recordset;
}

export async function createLeaveRequest(
  userId,
  { leave_type, from_date, to_date, total_days, reason },
) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("leaveType", sql.NVarChar(50), leave_type)
    .input("fromDate", sql.Date, from_date)
    .input("toDate", sql.Date, to_date)
    .input("totalDays", sql.Float, total_days ?? 1)
    .input("reason", sql.NVarChar(500), reason ?? null).query(`
      INSERT INTO leave_requests (user_id, leave_type, from_date, to_date, total_days, reason)
      OUTPUT INSERTED.*
      VALUES (@userId, @leaveType, @fromDate, @toDate, @totalDays, @reason)
    `);
  return result.recordset[0];
}

export async function approveLeaveRequest(id, approvedBy) {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.Int, id)
    .input("approvedBy", sql.BigInt, approvedBy).query(`
      UPDATE leave_requests
      SET status='approved', approved_by=@approvedBy, approved_at=GETDATE()
      WHERE id=@id
    `);
}

export async function rejectLeaveRequest(id, approvedBy, reason) {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.Int, id)
    .input("approvedBy", sql.BigInt, approvedBy)
    .input("reason", sql.NVarChar(500), reason ?? null).query(`
      UPDATE leave_requests
      SET status='rejected', approved_by=@approvedBy, approved_at=GETDATE(), reject_reason=@reason
      WHERE id=@id
    `);
}

// ── Dashboard ─────────────────────────────────────────────
export async function getAttendanceDashboard() {
  const pool = getPool();
  const today = new Date().toISOString().slice(0, 10);
  const result = await pool.request().input("today", sql.Date, today).query(`
      SELECT
        (SELECT COUNT(*) FROM Attendance WHERE date = @today) as total_checkin_today,
        (SELECT COUNT(*) FROM Attendance WHERE date = @today AND check_out IS NOT NULL) as total_checkout_today,
        (SELECT COUNT(*) FROM leave_requests WHERE status = 'pending') as pending_leaves,
        (SELECT COUNT(*) FROM leave_requests WHERE from_date = @today AND status = 'approved') as on_leave_today,
        (SELECT COUNT(*) FROM users WHERE is_active = 1) as total_employees
    `);
  return result.recordset[0];
}
