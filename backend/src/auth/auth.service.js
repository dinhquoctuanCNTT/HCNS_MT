import sql from "mssql";
import { getPool } from "../shared/config/db.js";

// 1. Tìm user bằng Username
export const findUserByUsername = async (username) => {
  const pool = getPool();
  const result = await pool.request().input("phone", sql.VarChar, username)
    .query(`
      SELECT TOP 1 * FROM users WHERE phone = @phone
    `);
  return result.recordset[0];
};
// 2. Tìm user bằng Email
export const findUserByEmail = async (email) => {
  const pool = getPool();
  const result = await pool.request().input("email", sql.VarChar, email).query(`
    SELECT TOP 1 * FROM users WHERE email = @email
  `);
  return result.recordset[0];
};

// 3. Lấy danh sách tất cả user
export const getAllUsers = async () => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT id, full_name, username, email, phone, role, status, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `);
  return result.recordset;
};

// 4. Tạo User mới
export const createUser = async ({
  fullName,
  username,
  email,
  phone,
  passwordHash,
  dateOfBirth,
  address,
  gender,
  jobTitle,
  departmentName,
}) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("full_name", sql.NVarChar, fullName)
    .input("username", sql.NVarChar, username)
    .input("email", sql.VarChar, email)
    .input("phone", sql.VarChar, phone)
    .input("password_hash", sql.VarChar, passwordHash)
    .input("date_of_birth", sql.Date, dateOfBirth || null)
    .input("address", sql.NVarChar, address || null)
    .input("gender", sql.NVarChar, gender || null)
    .input("job_title", sql.NVarChar, jobTitle || null)
    .input("department_name", sql.NVarChar, departmentName || null).query(`
      INSERT INTO users (
        full_name, username, email, phone, password_hash, 
        role, status, is_verified, date_of_birth, address, 
        gender, job_title, department_name, created_at, updated_at
      )
      OUTPUT INSERTED.*
      VALUES (
        @full_name, @username, @email, @phone, @password_hash, 
        'employee', 1, 1, @date_of_birth, @address, 
        @gender, @job_title, @department_name, SYSDATETIME(), SYSDATETIME()
      )
    `);
  return result.recordset[0];
};

// 5. Cập nhật Profile cá nhân
export const updateMyProfile = async ({
  userId,
  fullName,
  phone,
  dateOfBirth,
  address,
  gender,
  jobTitle,
  departmentName,
}) => {
  const pool = getPool();

  await pool
    .request()
    .input("id", sql.BigInt, parseInt(userId))
    .input("full_name", sql.NVarChar, fullName)
    .input("phone", sql.VarChar, phone || null)
    .input("date_of_birth", sql.Date, dateOfBirth || null)
    .input("address", sql.NVarChar, address || null)
    .input("gender", sql.NVarChar, gender || null)
    .input("job_title", sql.NVarChar, jobTitle || null)
    .input("department_name", sql.NVarChar, departmentName || null).query(`
      UPDATE users
      SET full_name = @full_name, phone = @phone, date_of_birth = @date_of_birth,
          address = @address, gender = @gender, job_title = @job_title,
          department_name = @department_name, updated_at = SYSDATETIME()
      WHERE id = @id
    `);

  const result = await pool
    .request()
    .input("id", sql.BigInt, userId)
    .query(`SELECT * FROM users WHERE id = @id`);

  return result.recordset[0];
};

// 6. Cập nhật Avatar (Hàm bị thiếu gây lỗi SyntaxError của bạn)
export const updateAvatar = async (userId, avatarUrl) => {
  console.log("=== updateAvatar called ===", { userId, avatarUrl });
  const pool = getPool();

  console.log("=== pool ok, running UPDATE ===");
  await pool
    .request()
    .input("id", sql.BigInt, parseInt(userId))
    .input("avatar_url", sql.VarChar, avatarUrl)
    .query(
      `
      UPDATE users
      SET avatar_url = @avatar_url, updated_at = SYSDATETIME()
      WHERE id = @id
    `,
    )
    .then(() => console.log("=== UPDATE success ==="))
    .catch((err) => {
      console.error("=== UPDATE FAILED ===", err.message);
      throw err;
    });

  console.log("=== running SELECT ===");
  const result = await pool
    .request()
    .input("id", sql.BigInt, parseInt(userId))
    .query(`SELECT avatar_url FROM users WHERE id = @id`)
    .then((r) => {
      console.log("=== SELECT success ===", r.recordset[0]);
      return r;
    })
    .catch((err) => {
      console.error("=== SELECT FAILED ===", err.message);
      throw err;
    });

  return result.recordset[0];
};
