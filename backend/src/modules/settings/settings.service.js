import { getPool, sql } from "../../config/db.js";

// ─── Lấy settings, tự tạo nếu chưa có ────────────────────────────────────────
export const getSettingsByUserId = async (userId) => {
  const pool = getPool();

  await pool.request().input("user_id", sql.BigInt, userId).query(`
      IF NOT EXISTS (SELECT 1 FROM user_settings WHERE user_id = @user_id)
        INSERT INTO user_settings (user_id, notify_email, notify_push, language, theme, updated_at)
        VALUES (@user_id, 1, 1, 'vi', 'light', SYSDATETIME())
    `);

  const result = await pool
    .request()
    .input("user_id", sql.BigInt, userId)
    .query(`SELECT * FROM user_settings WHERE user_id = @user_id`);

  return result.recordset[0];
};

// ─── Upsert settings ──────────────────────────────────────────────────────────
export const upsertSettings = async (userId, fields) => {
  const { notify_email, notify_push, language, theme } = fields;
  const pool = getPool();

  await pool
    .request()
    .input("user_id", sql.BigInt, userId)
    .input("notify_email", sql.Bit, notify_email ?? 1)
    .input("notify_push", sql.Bit, notify_push ?? 1)
    .input("language", sql.NVarChar(10), language || "vi")
    .input("theme", sql.NVarChar(20), theme || "light").query(`
      IF EXISTS (SELECT 1 FROM user_settings WHERE user_id = @user_id)
        UPDATE user_settings SET
          notify_email = @notify_email,
          notify_push  = @notify_push,
          language     = @language,
          theme        = @theme,
          updated_at   = SYSDATETIME()
        WHERE user_id = @user_id
      ELSE
        INSERT INTO user_settings (user_id, notify_email, notify_push, language, theme, updated_at)
        VALUES (@user_id, @notify_email, @notify_push, @language, @theme, SYSDATETIME())
    `);

  return getSettingsByUserId(userId);
};
