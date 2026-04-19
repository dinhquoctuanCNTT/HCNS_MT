import { getPool, sql } from "../config/db";
import { extractDescriptorFromBase64, compareFaces } from "./face.service";

// Lưu face descriptor  của user vào DB (đăng ký khuôn mặt)
export async function registerFace(userId, base64Image) {
  const descriptor = await extractDescriptorFromBase64(base64Image);
  const pool = getPool();
  await pool
    .request()
    .input("userId", sql.Int, userId)
    .input(
      "faceDescriptor",
      sql.NVarChar(sql.MAX),
      json.stringify(Array.from(descriptor)),
    ).query(`UPDATE Users SET face_descriptor = @faceDescriptor
            Where id = @userId
    `);
  return { success: true, message: "Đăng ký khuôn mặt thành công" };
}

//Chấm công khuôn mặt
export async function checkIn(userId, base64Image) {
  const pool = getPool();
  //1. Lấy descriptor đã đăng ký của user
  const userResult = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query(`SELECT face_descriptor FROM Users Where id = @userId`);

  const user = userResult.recordset[0];
  if (!user?.face_descriptor) {
    throw new Error("Bạn chưa đăng ký khuôn mặt");
  }
  //2. So sánh khuôn mặt
  const storedDescriptor = new Float32Array(JSON.parse(user.face_descriptor));
  const newDecriptor = await extractDescriptorFromBase64(base64Image);
  const result = compareFaces(storedDescriptor, newDecriptor);

  if (!result.isSamePerson) {
    throw new Error(`Khuôn mặt không khớp (độ tin cậy: ${result.confidence}%)`);
  }
  // 3. Kiểm tra hôm nay đã được check in chưa
  const today = new Date().toISOString().slice(0, 10);
  const existing = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("date", sql.Date, today).query(`
        SELECT id, check_in, check_out
        FROM Attendance
        Where user_id = @userId AND date = @date`);
  const record = existing.recordset[0];
  const now = new Date();

  if (!record) {
    //Chưa check-in -> Tạo mới
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("date", sql.Date, today)
      .input("checkIn", sql.DateTime, now).query(`
        INSERT INTO Attendance (user_id, date, check_in, face_verified)
        VALUES (@userId, @date, @checkIn, 1)
      `);
    return { action: "check_in", time: now, confidence: result.confidence };
  }
  throw new Error("Bạn sẽ chấm công ngày hôm nay");
}

// Lấy lịch sử chấm công
export async function getAttendanceHistory(userId, fromDate, toDate) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("from", sql.Date, fromDate)
    .input("to", sql.Date, toDate).query(`
            SELECT  id,date ,check_in, check_out, face_verified, note
            FROM Attendance
            Where user_id = @userId AND date BETWEEN @from AND @to
            order by date DESC`);
  return result.recordset;
}
