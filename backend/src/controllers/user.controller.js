import bcrypt from "bcryptjs";
import { getPool, sql } from "../config/db.js";

// GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().input("id", sql.Int, req.user.id)
      .query(`
        SELECT id, email, full_name, role, avatar_url, department, phone
        FROM users
        WHERE id = @id
      `);

    const user = result.recordset[0];
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { full_name, department, phone } = req.body;
    const pool = getPool();

    await pool
      .request()
      .input("id", sql.Int, req.user.id)
      .input("full_name", sql.NVarChar(255), full_name || null)
      .input("department", sql.NVarChar(255), department || null)
      .input("phone", sql.NVarChar(50), phone || null).query(`
        UPDATE users
        SET
          full_name  = COALESCE(@full_name, full_name),
          department = COALESCE(@department, department),
          phone      = COALESCE(@phone, phone)
        WHERE id = @id
      `);

    // Trả về user đã cập nhật
    const result = await pool.request().input("id", sql.Int, req.user.id)
      .query(`
        SELECT id, email, full_name, role, avatar_url, department, phone
        FROM users WHERE id = @id
      `);

    return res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: result.recordset[0],
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// PUT /api/users/change-password
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
    }

    const pool = getPool();

    // Lấy password hiện tại
    const result = await pool
      .request()
      .input("id", sql.Int, req.user.id)
      .query(`SELECT password FROM users WHERE id = @id`);

    const user = result.recordset[0];
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu hiện tại không đúng" });
    }

    const hashed = await bcrypt.hash(new_password, 10);

    await pool
      .request()
      .input("id", sql.Int, req.user.id)
      .input("password", sql.NVarChar(255), hashed)
      .query(`UPDATE users SET password = @password WHERE id = @id`);

    return res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
// POST /api/users/avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Không có file được upload" });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const pool = getPool();

    await pool
      .request()
      .input("id", sql.Int, req.user.id)
      .input("avatar_url", sql.NVarChar(500), avatarUrl)
      .query(`UPDATE users SET avatar_url = @avatar_url WHERE id = @id`);

    return res.json({ success: true, avatarUrl });
  } catch (error) {
    console.error("uploadAvatar error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
