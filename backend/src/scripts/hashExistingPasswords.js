// src/scripts/hashExistingPasswords.js
import bcrypt from "bcrypt";
import { connectDB, sql } from "../config/db.js";

const users = [
  { email: "dinhtuna30@gmail.com", newPassword: "Admin@123" },
  { email: "b@gmail.com", newPassword: "Director@123" },
  { email: "c@gmail.com", newPassword: "DeptHead@123" },
  { email: "d@gmail.com", newPassword: "Branch@123" },
  { email: "e@gmail.com", newPassword: "Employee@123" },
];

async function run() {
  // Gọi connectDB() trước — đây là bước bị thiếu lúc nãy
  const pool = await connectDB();
  console.log("✅ Kết nối DB thành công!");

  for (const user of users) {
    const hash = await bcrypt.hash(user.newPassword, 10);

    await pool
      .request()
      .input("hash", sql.NVarChar, hash)
      .input("email", sql.NVarChar, user.email)
      .query("UPDATE users SET password_hash = @hash WHERE email = @email");

    console.log(`✅ Đã hash password cho: ${user.email}`);
  }

  console.log("🎉 Xong! Tất cả password đã được mã hóa.");
  await sql.close();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Lỗi:", err.message);
  process.exit(1);
});
