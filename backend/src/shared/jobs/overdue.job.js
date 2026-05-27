import cron from "node-cron";
import { sendOverdueEmail, sendAbsenceWarningEmail, sendHcnsReminderEmail } from "../services/mail.service.js";
import { getPool, sql } from "../config/db.js";
import { addLeaveDay } from "../../modules/hrm/leave/leave.service.js";

// ── Job 2: Cảnh báo nghỉ không phép — chạy mỗi ngày lúc 9:00 ─────────────────
function startAbsenceWarningJob() {
  cron.schedule("0 9 * * 1-6", async () => {
    console.log("[AbsenceJob] Quét vắng không phép...");
    try {
      const pool = await getPool();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().slice(0, 10);
      const dow = yesterday.getDay();
      if (dow === 0) return; // Chủ nhật bỏ qua

      // Tìm nhân viên active không có chấm công và không có đơn nghỉ được duyệt
      const absent = await pool.request()
        .input("date", sql.Date, dateStr)
        .query(`
          SELECT u.id, u.full_name, u.email
          FROM users u
          WHERE u.status = 1 AND u.role NOT IN ('admin','director')
            AND NOT EXISTS (
              SELECT 1 FROM Attendance a WHERE a.user_id=u.id AND a.date=@date
            )
            AND NOT EXISTS (
              SELECT 1 FROM leave_requests lr
              WHERE lr.user_id=u.id AND lr.status='approved'
                AND @date BETWEEN lr.from_date AND lr.to_date
            )
            AND NOT EXISTS (
              SELECT 1 FROM holidays h WHERE h.holiday_date=@date
            )
        `);

      for (const emp of absent.recordset) {
        // Đếm số lần vắng trong tháng hiện tại
        const month = yesterday.getMonth() + 1;
        const year  = yesterday.getFullYear();
        const countRes = await pool.request()
          .input("userId", sql.BigInt, emp.id)
          .input("month", sql.Int, month)
          .input("year",  sql.Int, year)
          .query(`
            SELECT COUNT(*) AS cnt FROM absence_warnings
            WHERE user_id=@userId AND MONTH(absence_date)=@month AND YEAR(absence_date)=@year
          `);
        const warningCount = (countRes.recordset[0]?.cnt ?? 0) + 1;

        // Lưu cảnh báo
        await pool.request()
          .input("userId",       sql.BigInt, emp.id)
          .input("absenceDate",  sql.Date,   dateStr)
          .input("warningCount", sql.Int,    warningCount)
          .query(`
            INSERT INTO absence_warnings (user_id, absence_date, warning_count)
            VALUES (@userId, @absenceDate, @warningCount)
          `);

        // Gửi email nếu có email
        if (emp.email) {
          await sendAbsenceWarningEmail({
            to: emp.email,
            employeeName: emp.full_name,
            absenceDate: dateStr,
            warningCount,
          });
          await pool.request()
            .input("userId",      sql.BigInt, emp.id)
            .input("absenceDate", sql.Date,   dateStr)
            .query(`
              UPDATE absence_warnings SET email_sent=1, sent_at=GETDATE()
              WHERE user_id=@userId AND absence_date=@absenceDate
            `);
        }
      }
      console.log(`[AbsenceJob] Xử lý ${absent.recordset.length} trường hợp vắng`);
    } catch (err) {
      console.error("[AbsenceJob] Lỗi:", err.message);
    }
  });
}

// ── Job 3: Cộng ngày phép đầu tháng — chạy ngày 1 lúc 7:00 ───────────────────
function startLeaveAccrualJob() {
  cron.schedule("0 7 1 * *", async () => {
    console.log("[LeaveAccrual] Cộng ngày phép tháng mới...");
    try {
      const pool = await getPool();
      const now = new Date();
      const year = now.getFullYear();

      // Lấy nhân viên đã đủ 6 tháng làm việc
      const eligible = await pool.request()
        .query(`
          SELECT id FROM users
          WHERE status=1
            AND hire_date IS NOT NULL
            AND DATEDIFF(MONTH, hire_date, GETDATE()) >= 6
        `);

      for (const emp of eligible.recordset) {
        await addLeaveDay(emp.id, year);
      }
      console.log(`[LeaveAccrual] Cộng 1 ngày phép cho ${eligible.recordset.length} nhân viên`);
    } catch (err) {
      console.error("[LeaveAccrual] Lỗi:", err.message);
    }
  });
}

// ── Job 4: Nhắc HCNS ngày mùng 2 lúc 8:00 ────────────────────────────────────
function startHcnsReminderJob() {
  cron.schedule("0 8 2 * *", async () => {
    console.log("[HcnsReminder] Gửi nhắc nhở HCNS...");
    try {
      const pool = await getPool();
      const now = new Date();
      // Tháng cần hoàn thiện là tháng trước
      const month = now.getMonth() === 0 ? 12 : now.getMonth();
      const year  = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

      const hcnsStaff = await pool.request()
        .query(`
          SELECT email, full_name FROM users
          WHERE status=1 AND role IN ('admin','branch_manager')
            AND email IS NOT NULL
        `);

      for (const staff of hcnsStaff.recordset) {
        await sendHcnsReminderEmail({ to: staff.email, month, year });
      }
      console.log(`[HcnsReminder] Gửi nhắc cho ${hcnsStaff.recordset.length} HCNS`);
    } catch (err) {
      console.error("[HcnsReminder] Lỗi:", err.message);
    }
  });
}

export function startOverdueJob() {
  cron.schedule("* * * * *", async () => {
    console.log("[OverdueJob] Đang quét task quá hạn...");

    try {
      const pool = getPool();

      const result = await pool.request().query(`
        SELECT
          t.id,
          t.title,
          t.due_date,
          u1.email      AS assignee_email,
          u1.full_name  AS assignee_name,
          u2.email      AS reporter_email,
          u2.full_name  AS reporter_name
        FROM tasks t
        LEFT JOIN users u1 ON t.assignee_id = u1.id
        LEFT JOIN users u2 ON t.reporter_id = u2.id
        WHERE CAST(t.due_date AS DATE) <= CAST(DATEADD(DAY, 1, GETDATE()) AS DATE)
  AND t.is_completed = 0
  AND (t.is_archived = 0 OR t.is_archived IS NULL)
  AND t.notified_at IS NULL
      `);

      const rows = result.recordset;
      console.log(`[OverdueJob] Tìm thấy ${rows.length} task cần thông báo`);

      for (const task of rows) {
        try {
          if (task.assignee_email) {
            await sendOverdueEmail({
              to: task.assignee_email,
              taskTitle: task.title,
              dueDate: task.due_date,
              roleText: "bạn thực hiện",
            });
          }

          if (task.reporter_email) {
            await sendOverdueEmail({
              to: task.reporter_email,
              taskTitle: task.title,
              dueDate: task.due_date,
              roleText: "bạn giao",
            });
          }
        } catch (emailErr) {
          console.error(
            `[OverdueJob] Lỗi gửi email task ${task.id}:`,
            emailErr.message,
          );
        } finally {
          // Luôn đánh dấu đã xử lý dù thành công hay lỗi
          await pool
            .request()
            .input("id", sql.Int, task.id)
            .query("UPDATE tasks SET notified_at = GETDATE() WHERE id = @id");
        }
      }
    } catch (err) {
      console.error("[OverdueJob] Lỗi:", err.message);
    }
  });

  startAbsenceWarningJob();
  startLeaveAccrualJob();
  startHcnsReminderJob();
}
