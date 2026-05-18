// Chạy: node --env-file=.env scripts/seed-employees.js
import bcrypt from "bcryptjs";
import { connectDB, getPool, sql } from "../src/config/db.js";

const DEFAULT_PASSWORD = "123456";

const EMPLOYEES = [
  { employee_code: "MTH28", full_name: "Vũ Tiến Minh" },
  { employee_code: "MTH72", full_name: "Bùi Thị Vân" },
  { employee_code: "MTH73", full_name: "Bùi Hải Đình" },
  { employee_code: "MTH65", full_name: "Nguyễn Thị Ngân" },
  { employee_code: "MTH76", full_name: "Trần Thị Thu Hương" },
  { employee_code: "MTH19", full_name: "Đỗ Thanh Tùng" },
];

async function main() {
  await connectDB();
  const pool = getPool();
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const emp of EMPLOYEES) {
    const email = `${emp.employee_code.toLowerCase()}@mtholdings.vn`;

    // Kiểm tra đã tồn tại chưa
    const existing = await pool.request()
      .input("code", sql.NVarChar, emp.employee_code)
      .query("SELECT id FROM users WHERE employee_code = @code");

    if (existing.recordset.length > 0) {
      console.log(`⚠️  ${emp.employee_code} (${emp.full_name}) đã tồn tại, bỏ qua`);
      continue;
    }

    await pool.request()
      .input("email",         sql.NVarChar, email)
      .input("full_name",     sql.NVarChar, emp.full_name)
      .input("employee_code", sql.NVarChar, emp.employee_code)
      .input("password_hash", sql.NVarChar, hash)
      .input("role",          sql.NVarChar, "employee")
      .query(`
        INSERT INTO users (email, full_name, employee_code, password_hash, role)
        VALUES (@email, @full_name, @employee_code, @password_hash, @role)
      `);

    console.log(`✅  Đã tạo: ${emp.employee_code} - ${emp.full_name}`);
  }

  // Cập nhật employee_code cho Đinh Quốc Tuấn nếu chưa có
  await pool.request()
    .input("code", sql.NVarChar, "MTH67")
    .query("UPDATE users SET employee_code = @code WHERE full_name LIKE N'%Đinh Quốc Tuấn%' AND (employee_code IS NULL OR employee_code = '')");

  console.log("\n✅ Hoàn tất! Tất cả nhân viên dùng mật khẩu: 123456");
  process.exit(0);
}

main().catch(e => { console.error("❌ Lỗi:", e.message); process.exit(1); });
