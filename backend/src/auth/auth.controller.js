import bcrypt from "bcryptjs";
import { getPool, sql } from "../shared/config/db.js";
import { generateToken } from "../shared/utils/jwt.js";

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { email, password, full_name, role = "employee", phone } = req.body;

    if (!email || !password || !full_name) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
    }

    const pool = getPool();

    const existing = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query(`SELECT id FROM users WHERE email = @email`);

    if (existing.recordset.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email đã được sử dụng" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool
      .request()
      .input("email", sql.NVarChar(255), email)
      .input("password", sql.NVarChar(255), hashedPassword)
      .input("full_name", sql.NVarChar(255), full_name)
      .input("role", sql.NVarChar(50), role)
      .input("phone", sql.NVarChar(50), phone || null).query(`
        INSERT INTO users (email, password_hash, full_name, role, phone)
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.role
        VALUES (@email, @password, @full_name, @role, @phone)
      `);

    const newUser = result.recordset[0];
    await pool
      .request()
      .input("user_id", sql.Int, newUser.id)
      .input("project_id", sql.Int, 5)
      .input("project_role", sql.NVarChar(50), "member").query(`
    INSERT INTO project_members (user_id, project_id, project_role)
    VALUES (@user_id, @project_id, @project_role)
  `);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      token,
      user: { ...newUser, has_registered_face: false },
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { employee_code, password } = req.body;

    if (!employee_code || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập mã nhân viên và mật khẩu",
      });
    }

    const pool = getPool();

    const result = await pool.request()
      .input("employee_code", sql.NVarChar, employee_code.trim().toUpperCase())
      .query(`
        SELECT u.id, u.email, u.password_hash, u.full_name, u.role, u.avatar_url, u.phone,
               u.employee_code, u.job_title, u.created_at, u.branch_id,
               ol.name AS branch_name,
               CASE WHEN u.face_descriptor IS NULL THEN 0 ELSE 1 END AS has_registered_face
        FROM users u
        LEFT JOIN office_locations ol ON ol.id = u.branch_id
        WHERE u.employee_code = @employee_code
      `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Mã nhân viên hoặc mật khẩu không đúng",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mã nhân viên hoặc mật khẩu không đúng",
      });
    }

    const token = generateToken(user);
    const { password_hash: _, ...userWithoutPassword } = user;
    userWithoutPassword.has_registered_face = !!userWithoutPassword.has_registered_face;

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu mới phải ít nhất 6 ký tự" });
    }

    const pool = getPool();
    const result = await pool.request()
      .input("id", sql.Int, req.user.id)
      .query("SELECT password_hash FROM users WHERE id = @id");

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng" });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await pool.request()
      .input("id", sql.Int, req.user.id)
      .input("hash", sql.NVarChar, newHash)
      .query("UPDATE users SET password_hash = @hash WHERE id = @id");

    return res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().input("id", sql.Int, req.user.id)
      .query(`
        SELECT id, email, full_name, role, avatar_url, phone,
               CASE WHEN face_descriptor IS NULL THEN 0 ELSE 1 END AS has_registered_face
        FROM users
        WHERE id = @id
      `);

    const user = result.recordset[0];
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    user.has_registered_face = !!user.has_registered_face;

    return res.json({ success: true, user });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
