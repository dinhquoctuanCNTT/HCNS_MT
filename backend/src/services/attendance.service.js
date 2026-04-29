// src/services/attendance.service.js

import { getPool, sql } from "../config/db.js";
import { extractDescriptorFromBase64, compareFaces } from "./face.service.js";
import { uploadAttendanceImage } from "./cloudinary.service.js";

const ANTI_SPOOF_URL = "http://localhost:8000/check-liveness";

// ── Nhãn đồng phục ───────────────────────────────────────────────────────────
const UNIFORM_LABELS = {
  mt_den: "Áo đen (MT)",
  mt_trang: "Áo trắng (MT)",
  mhm_xanh: "Áo xanh lá (MHM)",
  bhld_xam: "Bộ bảo hộ lao động xám",
  all: "Không bắt buộc",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function checkGpsFence(latitude, longitude) {
  console.log(`[GPS] latitude=${latitude}, longitude=${longitude}`);
  if (!latitude || !longitude) {
    return {
      allowed: false,
      location: null,
      locationId: null,
      requiredUniform: null,
      distance: null,
      reason: "no_gps",
    };
  }
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT id, name, latitude, longitude, radius, required_uniform
    FROM office_locations WHERE is_active = 1
  `);
  let nearest = null;
  let nearestDist = Infinity;
  for (const loc of result.recordset) {
    const dist = getDistance(latitude, longitude, loc.latitude, loc.longitude);

    // ← THÊM 2 DÒNG NÀY
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = loc;
    }

    if (dist <= loc.radius) {
      return {
        allowed: true,
        location: loc.name,
        locationId: loc.id,
        requiredUniform: loc.required_uniform ?? "all",
        distance: Math.round(dist),
        reason: null,
      };
    }
  }

  // ← SỬA return này
  return {
    allowed: false,
    location: nearest?.name ?? null,
    locationId: nearest?.id ?? null,
    requiredUniform: null,
    distance: Math.round(nearestDist),
    reason: "out_of_range",
  };
}

async function checkLiveness(base64Image) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(ANTI_SPOOF_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await response.json();
    return {
      is_real: data.is_real ?? true,
      confidence: data.confidence ?? 0,
      clothing_type: data.clothing_type ?? "all",
      clothing_confidence: data.clothing_confidence ?? 0,
      message: data.message ?? "",
    };
  } catch {
    return {
      is_real: true,
      confidence: 0,
      clothing_type: "all",
      clothing_confidence: 0,
      message: "Anti-spoof unavailable",
    };
  }
}

/**
 * Kiểm tra đồng phục theo CẢ 2 nguồn:
 *   1. required_uniform của nhân viên (users.required_uniform)
 *   2. required_uniform của văn phòng (office_locations.required_uniform)
 *
 * Logic:
 *   - Nếu cả 2 đều là "all" → bỏ qua
 *   - Nếu clothing_type = "unknown" → bỏ qua (không phạt khi không nhận diện được)
 *   - Kiểm tra user trước, sau đó kiểm tra office
 *   - Bất kỳ 1 nguồn nào không khớp → throw Error
 */
function checkUniform(
  userRequiredUniform,
  officeRequiredUniform,
  clothingType,
) {
  // Không nhận diện được → bỏ qua toàn bộ
  if (!clothingType || clothingType === "unknown") return;

  const label = (code) => UNIFORM_LABELS[code] || code;

  // Kiểm tra theo nhân viên
  if (userRequiredUniform && userRequiredUniform !== "all") {
    if (clothingType !== userRequiredUniform) {
      throw new Error(
        `Sai đồng phục cá nhân! Bạn được yêu cầu mặc: ${label(userRequiredUniform)}. ` +
          `Hệ thống phát hiện: ${label(clothingType)}.`,
      );
    }
  }

  // Kiểm tra theo văn phòng
  if (officeRequiredUniform && officeRequiredUniform !== "all") {
    if (clothingType !== officeRequiredUniform) {
      throw new Error(
        `Sai đồng phục văn phòng! Chi nhánh yêu cầu: ${label(officeRequiredUniform)}. ` +
          `Hệ thống phát hiện: ${label(clothingType)}.`,
      );
    }
  }
}

function makePublicId(userId, action) {
  return `user_${userId}_${new Date().toISOString().slice(0, 10)}_${action}`;
}

// ── Face Registration ─────────────────────────────────────────────────────────
export async function registerFace(userId, base64Image) {
  const [liveness, descriptor] = await Promise.all([
    checkLiveness(base64Image),
    extractDescriptorFromBase64(base64Image),
  ]);
  if (!liveness.is_real)
    throw new Error(`Phát hiện ảnh giả khi đăng ký (${liveness.message})`);

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

// ── Check-in ──────────────────────────────────────────────────────────────────
export async function checkIn(
  userId,
  base64Image,
  { latitude, longitude } = {},
) {
  const pool = getPool();

  // Lấy thông tin user (face_descriptor + required_uniform cá nhân)
  const [liveness, newDescriptor, userResult, gpsCheck] = await Promise.all([
    checkLiveness(base64Image),
    extractDescriptorFromBase64(base64Image),
    pool
      .request()
      .input("userId", sql.Int, userId)
      .query(
        `SELECT face_descriptor, required_uniform FROM Users WHERE id = @userId`,
      ),
    checkGpsFence(latitude, longitude),
  ]);

  // 1. Liveness
  if (!liveness.is_real)
    throw new Error(`Phát hiện gian lận: ${liveness.message}`);

  // 2. GPS
  if (!gpsCheck.allowed) {
    throw new Error(
      gpsCheck.reason === "no_gps"
        ? "Vui lòng bật GPS để chấm công"
        : `Bạn không trong khu vực chấm công (cách chi nhánh gần nhất ${gpsCheck.distance ?? "?"}m)`,
    );
  }

  // 3. Đồng phục — kiểm tra cả user lẫn office
  const user = userResult.recordset[0];
  checkUniform(
    user?.required_uniform ?? "all", // từ bảng users
    gpsCheck.requiredUniform ?? "all", // từ bảng office_locations
    liveness.clothing_type,
  );

  // 4. Khuôn mặt
  if (!user?.face_descriptor) throw new Error("Bạn chưa đăng ký khuôn mặt");
  const stored = new Float32Array(JSON.parse(user.face_descriptor));
  const faceResult = compareFaces(stored, newDescriptor);
  if (!faceResult.isSamePerson)
    throw new Error(`Khuôn mặt không khớp (${faceResult.confidence}%)`);

  // 5. Đã chấm công chưa
  const today = new Date().toISOString().slice(0, 10);
  const existing = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today)
    .query(
      `SELECT id FROM Attendance WHERE user_id = @userId AND date = @date`,
    );
  if (existing.recordset[0]) throw new Error("Bạn đã chấm công hôm nay rồi");

  // 6. Upload ảnh
  let imageUrl = null;
  try {
    imageUrl = await uploadAttendanceImage(
      base64Image,
      "attendance/checkin",
      makePublicId(userId, "checkin"),
    );
  } catch (err) {
    console.warn(`[Cloudinary] Upload failed:`, err.message);
  }

  // 7. INSERT
  const now = new Date();
  await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today)
    .input("checkIn", sql.DateTime, now)
    .input("lat", sql.Float, latitude ?? null)
    .input("lng", sql.Float, longitude ?? null)
    .input("locationVerified", sql.Bit, 1)
    .input("antiSpoofScore", sql.Float, liveness.confidence ?? 0)
    .input("imageUrl", sql.NVarChar(500), imageUrl).query(`
      INSERT INTO Attendance (
        user_id, date, check_in, latitude, longitude,
        location_verified, face_verified, anti_spoof_score, check_in_image_url
      )
      VALUES (
        @userId, @date, @checkIn, @lat, @lng,
        @locationVerified, 1, @antiSpoofScore, @imageUrl
      )
    `);

  return {
    action: "check_in",
    time: now,
    confidence: faceResult.confidence,
    location: gpsCheck.location,
    image_url: imageUrl,
    clothing_type: liveness.clothing_type,
    clothing_confidence: liveness.clothing_confidence,
  };
}

// ── Check-out ─────────────────────────────────────────────────────────────────
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
      .query(
        `SELECT face_descriptor, required_uniform FROM Users WHERE id = @userId`,
      ),
    checkGpsFence(latitude, longitude),
  ]);

  if (!liveness.is_real)
    throw new Error(`Phát hiện gian lận: ${liveness.message}`);

  if (!gpsCheck.allowed) {
    throw new Error(
      gpsCheck.reason === "no_gps"
        ? "Vui lòng bật GPS để chấm công"
        : `Bạn không trong khu vực chấm công (cách chi nhánh gần nhất ${gpsCheck.distance ?? "?"}m)`,
    );
  }

  const user = userResult.recordset[0];
  checkUniform(
    user?.required_uniform ?? "all",
    gpsCheck.requiredUniform ?? "all",
    liveness.clothing_type,
  );

  if (!user?.face_descriptor) throw new Error("Bạn chưa đăng ký khuôn mặt");
  const stored = new Float32Array(JSON.parse(user.face_descriptor));
  const faceResult = compareFaces(stored, newDescriptor);
  if (!faceResult.isSamePerson)
    throw new Error(`Khuôn mặt không khớp (${faceResult.confidence}%)`);

  const today = new Date().toISOString().slice(0, 10);
  const existing = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today)
    .query(
      `SELECT id, check_in, check_out FROM Attendance WHERE user_id=@userId AND date=@date`,
    );
  const record = existing.recordset[0];
  if (!record) throw new Error("Bạn chưa chấm công vào hôm nay");
  if (record.check_out) throw new Error("Bạn đã chấm ra hôm nay rồi");

  let imageUrl = null;
  try {
    imageUrl = await uploadAttendanceImage(
      base64Image,
      "attendance/checkout",
      makePublicId(userId, "checkout"),
    );
  } catch (err) {
    console.warn(`[Cloudinary] Upload failed:`, err.message);
  }

  const now = new Date();
  await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today)
    .input("checkOut", sql.DateTime, now)
    .input("imageUrl", sql.NVarChar(500), imageUrl).query(`
      UPDATE Attendance
      SET check_out = @checkOut, check_out_image_url = @imageUrl
      WHERE user_id = @userId AND date = @date
    `);

  return {
    action: "check_out",
    time: now,
    confidence: faceResult.confidence,
    image_url: imageUrl,
    clothing_type: liveness.clothing_type,
    clothing_confidence: liveness.clothing_confidence,
  };
}

// ── Lịch sử ───────────────────────────────────────────────────────────────────
export async function getAttendanceHistory(userId, fromDate, toDate) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("from", sql.Date, fromDate)
    .input("to", sql.Date, toDate).query(`
      SELECT id, date, check_in, check_out, face_verified, note,
             anti_spoof_score, location_verified, latitude, longitude,
             check_in_image_url, check_out_image_url
      FROM Attendance
      WHERE user_id = @userId AND date BETWEEN @from AND @to
      ORDER BY date DESC
    `);
  return result.recordset;
}

// ── Office Locations ──────────────────────────────────────────────────────────
export async function getOfficeLocations() {
  const pool = getPool();
  return (
    await pool
      .request()
      .query(`SELECT * FROM office_locations ORDER BY created_at DESC`)
  ).recordset;
}

export async function createOfficeLocation({
  name,
  latitude,
  longitude,
  radius = 100,
  required_uniform = "all",
}) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("name", sql.NVarChar(255), name)
    .input("latitude", sql.Float, latitude)
    .input("longitude", sql.Float, longitude)
    .input("radius", sql.Int, radius)
    .input("requiredUniform", sql.NVarChar(50), required_uniform).query(`
      INSERT INTO office_locations (name, latitude, longitude, radius, required_uniform)
      OUTPUT INSERTED.*
      VALUES (@name, @latitude, @longitude, @radius, @requiredUniform)
    `);
  return result.recordset[0];
}

export async function updateOfficeLocation(
  id,
  { name, latitude, longitude, radius, is_active, required_uniform },
) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("name", sql.NVarChar(255), name)
    .input("latitude", sql.Float, latitude)
    .input("longitude", sql.Float, longitude)
    .input("radius", sql.Int, radius)
    .input("isActive", sql.Bit, is_active)
    .input("requiredUniform", sql.NVarChar(50), required_uniform ?? "all")
    .query(`
      UPDATE office_locations
      SET name=@name, latitude=@latitude, longitude=@longitude,
          radius=@radius, is_active=@isActive, required_uniform=@requiredUniform
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

// ── Leave Requests ────────────────────────────────────────────────────────────
export async function getLeaveRequests(userId, status) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("status", sql.NVarChar(20), status ?? null).query(`
      SELECT lr.*, u.full_name as approver_name
      FROM leave_requests lr LEFT JOIN users u ON u.id = lr.approved_by
      WHERE lr.user_id=@userId AND (@status IS NULL OR lr.status=@status)
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
      LEFT JOIN users u ON u.id=lr.user_id
      LEFT JOIN users a ON a.id=lr.approved_by
      WHERE (@status IS NULL OR lr.status=@status)
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
    .input("approvedBy", sql.BigInt, approvedBy)
    .query(
      `UPDATE leave_requests SET status='approved', approved_by=@approvedBy, approved_at=GETDATE() WHERE id=@id`,
    );
}

export async function rejectLeaveRequest(id, approvedBy, reason) {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.Int, id)
    .input("approvedBy", sql.BigInt, approvedBy)
    .input("reason", sql.NVarChar(500), reason ?? null)
    .query(
      `UPDATE leave_requests SET status='rejected', approved_by=@approvedBy, approved_at=GETDATE(), reject_reason=@reason WHERE id=@id`,
    );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export async function getAttendanceDashboard() {
  const pool = getPool();
  const today = new Date().toISOString().slice(0, 10);
  const r = await pool.request().input("today", sql.Date, today).query(`
    SELECT
      (SELECT COUNT(*) FROM Attendance WHERE date=@today)                                AS total_checkin_today,
      (SELECT COUNT(*) FROM Attendance WHERE date=@today AND check_out IS NOT NULL)      AS total_checkout_today,
      (SELECT COUNT(*) FROM leave_requests WHERE status='pending')                       AS pending_leaves,
      (SELECT COUNT(*) FROM leave_requests WHERE from_date=@today AND status='approved') AS on_leave_today,
      (SELECT COUNT(*) FROM users WHERE is_active=1)                                     AS total_employees
  `);
  return r.recordset[0];
}
