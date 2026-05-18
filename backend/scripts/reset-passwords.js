// Chạy 1 lần: node --env-file=.env scripts/reset-passwords.js
import bcrypt from "bcryptjs";
import { connectDB, sql } from "../src/config/db.js";

const DEFAULT_PASSWORD = "123456";

async function main() {
  await connectDB();
  const pool = (await import("../src/config/db.js")).getPool();
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const result = await pool.request()
    .input("hash", sql.NVarChar, hash)
    .query("UPDATE Users SET password_hash = @hash");
  console.log(`Reset ${result.rowsAffected[0]} users to password 123456`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
