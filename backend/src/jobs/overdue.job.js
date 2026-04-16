import cron from "node-cron";
import { sendOverdueEmail } from "../services/mail.service.js";
import { getPool, sql } from "../config/db.js";

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
}
