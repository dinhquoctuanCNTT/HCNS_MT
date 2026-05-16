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

function checkUniform(
  userRequiredUniform,
  officeRequiredUniform,
  clothingType,
) {
  if (!clothingType || clothingType === "unknown") return;
  const label = (code) => UNIFORM_LABELS[code] || code;
  if (userRequiredUniform && userRequiredUniform !== "all") {
    if (clothingType !== userRequiredUniform) {
      throw new Error(
        `Sai đồng phục cá nhân! Bạn được yêu cầu mặc: ${label(userRequiredUniform)}. ` +
          `Hệ thống phát hiện: ${label(clothingType)}.`,
      );
    }
  }
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

  // 3. Đồng phục
  const user = userResult.recordset[0];
  checkUniform(
    user?.required_uniform ?? "all",
    gpsCheck.requiredUniform ?? "all",
    liveness.clothing_type,
  );

  // 4. Khuôn mặt — tự đăng ký lần đầu nếu chưa có
  let faceConfidence = 100;
  let isFirstRegister = false;
  if (!user?.face_descriptor) {
    // Lần đầu chấm công: tự lưu descriptor làm dữ liệu gốc
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("faceDescriptor", sql.NVarChar(sql.MAX), JSON.stringify(Array.from(newDescriptor)))
      .query(`UPDATE Users SET face_descriptor = @faceDescriptor WHERE id = @userId`);
    isFirstRegister = true;
    console.log(`[Face] Auto-registered face for user ${userId} on first check-in`);
  } else {
    const stored = new Float32Array(JSON.parse(user.face_descriptor));
    const faceResult = compareFaces(stored, newDescriptor);
    if (!faceResult.isSamePerson)
      throw new Error(`Khuôn mặt không khớp (${faceResult.confidence}%)`);
    faceConfidence = faceResult.confidence;
  }

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

  // 6. INSERT vào DB ngay — không chờ upload ảnh
  const insertResult = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today)
    .input("lat", sql.Float, latitude ?? null)
    .input("lng", sql.Float, longitude ?? null)
    .input("locationVerified", sql.Bit, 1)
    .input("antiSpoofScore", sql.Float, liveness.confidence ?? 0)
    .query(`
      INSERT INTO Attendance (
        user_id, date, check_in, latitude, longitude,
        location_verified, face_verified, anti_spoof_score
      )
      OUTPUT INSERTED.check_in AS time
      VALUES (
        @userId, @date, GETDATE(), @lat, @lng,
        @locationVerified, 1, @antiSpoofScore
      )
    `);

  const checkInTime = insertResult.recordset[0]?.time;
  const checkInVN = new Date(
    checkInTime.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
  );
  const checkInTotalMins = checkInVN.getHours() * 60 + checkInVN.getMinutes();
  const lateMins = Math.max(0, checkInTotalMins - (8 * 60 + 5));
  if (lateMins > 0) {
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("date", sql.Date, today)
      .input("lateMins", sql.Int, lateMins)
      .query(
        `UPDATE Attendance SET late_minutes = @lateMins WHERE user_id = @userId AND date = @date`,
      );
  }

  // 7. Upload ảnh bất đồng bộ — không block response
  uploadAttendanceImage(base64Image, "attendance/checkin", makePublicId(userId, "checkin"))
    .then((imageUrl) => {
      if (!imageUrl) return;
      pool.request()
        .input("userId", sql.Int, userId)
        .input("date", sql.Date, today)
        .input("imageUrl", sql.NVarChar(500), imageUrl)
        .query(`UPDATE Attendance SET check_in_image_url = @imageUrl WHERE user_id = @userId AND date = @date`)
        .catch((e) => console.warn("[Cloudinary] DB update failed:", e.message));
    })
    .catch((err) => console.warn(`[Cloudinary] Upload failed:`, err.message));

  return {
    action: "check_in",
    time: checkInTime,
    confidence: faceConfidence,
    location: gpsCheck.location,
    first_register: isFirstRegister,
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

  // UPDATE check_out ngay — không chờ upload ảnh
  const updateResult = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today)
    .query(`
      UPDATE Attendance
      SET check_out = GETDATE()
      OUTPUT INSERTED.check_out AS time
      WHERE user_id = @userId AND date = @date
    `);

  // Upload ảnh bất đồng bộ — không block response
  uploadAttendanceImage(base64Image, "attendance/checkout", makePublicId(userId, "checkout"))
    .then((imageUrl) => {
      if (!imageUrl) return;
      pool.request()
        .input("userId", sql.Int, userId)
        .input("date", sql.Date, today)
        .input("imageUrl", sql.NVarChar(500), imageUrl)
        .query(`UPDATE Attendance SET check_out_image_url = @imageUrl WHERE user_id = @userId AND date = @date`)
        .catch((e) => console.warn("[Cloudinary] DB update failed:", e.message));
    })
    .catch((err) => console.warn(`[Cloudinary] Upload failed:`, err.message));

  const checkOutTime = updateResult.recordset[0]?.time;

  const checkOutVN = new Date(
    checkOutTime.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
  );
  const checkOutTotalMins =
    checkOutVN.getHours() * 60 + checkOutVN.getMinutes();
  const endMins = 17 * 60 + 30;
  const earlyMins = Math.max(0, endMins - checkOutTotalMins);

  // Lưu early_minutes nếu có về sớm với giờ làm việc
  if (earlyMins > 0) {
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("date", sql.Date, today)
      .input("earlyMins", sql.Int, earlyMins)
      .query(
        `UPDATE Attendance SET early_minutes = @earlyMins WHERE user_id = @userId AND date = @date`,
      );
  }
  return {
    action: "check_out",
    time: checkOutTime,
    confidence: faceResult.confidence,
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
             check_in_image_url, check_out_image_url,
             late_minutes, early_minutes
      FROM Attendance
      WHERE user_id = @userId AND date BETWEEN @from AND @to
      ORDER BY date DESC
    `);

  return result.recordset.map((row) => ({
    ...row,
    check_in: row.check_in ? row.check_in.toISOString().replace("Z", "") : null,
    check_out: row.check_out
      ? row.check_out.toISOString().replace("Z", "")
      : null,
    date: row.date ? row.date.toISOString().replace("Z", "") : null,
  }));
}
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
// ================== ADMIN FUNCTIONS ==================
export async function getAttendanceHistoryAdmin({
  employeeId,
  month,
  cursor,
  limit = 20,
}) {
  const pool = getPool();

  // Parse month: "2026-05"
  const [y, m] = month.split("-");
  const fromDate = `${y}-${m}-01`;
  const last = new Date(parseInt(y), parseInt(m), 0).getDate();
  const toDate = `${y}-${m}-${last}`;

  let query = `
    SELECT TOP (${limit + 1})
      a.id, a.date, a.check_in, a.check_out,
      a.face_verified, a.location_verified,
      a.late_minutes, a.early_minutes,
      a.check_in_image_url, a.check_out_image_url,
      u.full_name, u.employee_code
    FROM Attendance a
    JOIN users u ON u.id = a.user_id
    WHERE a.date BETWEEN @from AND @to
  `;

  const req = pool
    .request()
    .input("from", sql.Date, fromDate)
    .input("to", sql.Date, toDate);

  if (employeeId) {
    query += ` AND a.user_id = @employeeId`;
    req.input("employeeId", sql.Int, employeeId);
  }

  if (cursor) {
    query += ` AND a.id < @cursor`;
    req.input("cursor", sql.Int, cursor);
  }

  query += ` ORDER BY a.id DESC`;

  const result = await req.query(query);
  const rows = result.recordset;

  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return {
    data: data.map((row) => ({
      ...row,
      check_in: row.check_in
        ? row.check_in.toISOString().replace("Z", "")
        : null,
      check_out: row.check_out
        ? row.check_out.toISOString().replace("Z", "")
        : null,
      date: row.date ? row.date.toISOString().replace("Z", "") : null,
    })),
    nextCursor,
    hasMore,
  };
}
//===================== API thống kê chấm công cá nhân =======================
export async function getAttendanceStats(userId, month) {
  const pool = getPool();
  const [y, m] = month.split("-");
  const fromDate = `${y}-${m}-01`;
  const last = new Date(parseInt(y), parseInt(m), 0).getDate();
  const toDate = `${y}-${m}-${last}`;

  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("from", sql.Date, fromDate)
    .input("to", sql.Date, toDate).query(`
      SELECT
        COUNT(*) AS total_present,
        SUM(CASE WHEN late_minutes > 0 THEN 1 ELSE 0 END) AS total_late,
        SUM(ISNULL(late_minutes, 0)) AS total_late_minutes,
        SUM(ISNULL(early_minutes, 0)) AS total_early_minutes,
        SUM(
          CASE WHEN check_in IS NOT NULL AND check_out IS NOT NULL
          THEN DATEDIFF(MINUTE, check_in, check_out)
          ELSE 0 END
        ) AS total_work_minutes
      FROM Attendance
      WHERE user_id = @userId AND date BETWEEN @from AND @to
    `);

  const row = result.recordset[0];
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const workDaysResult = await pool
    .request()
    .input("from", sql.Date, fromDate)
    .input("to", sql.Date, todayStr < toDate ? todayStr : toDate).query(`
      WITH dates AS (
        SELECT DATEADD(DAY, number, @from) AS d
        FROM master..spt_values
        WHERE type = 'P'
        AND DATEADD(DAY, number, @from) <= @to
      )
      SELECT COUNT(*) AS work_days
      FROM dates
      WHERE DATEPART(WEEKDAY, d) NOT IN (1)
    `);

  const workDays = workDaysResult.recordset[0]?.work_days ?? 0;
  const totalPresent = row.total_present ?? 0;
  const totalWorkMins = row.total_work_minutes ?? 0;
  const overtime = Math.max(0, totalWorkMins - totalPresent * (9 * 60 + 25));

  return {
    month,
    work_days_total: workDays,
    total_present: totalPresent,
    total_absent: workDays - totalPresent,
    total_late: row.total_late ?? 0,
    total_late_minutes: row.total_late_minutes ?? 0,
    total_early_minutes: row.total_early_minutes ?? 0,
    total_work_hours: Math.round((totalWorkMins / 60) * 10) / 10,
    overtime_minutes: overtime,
    attendance_rate:
      workDays > 0 ? Math.round((totalPresent / workDays) * 100) : 0,
  };
}
