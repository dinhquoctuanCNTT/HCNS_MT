import bcrypt from "bcryptjs";
import {
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserPasswordHash,
  updateUserPassword,
  getUserQr,
  getEmployeeList,
  getEmployeeDetail,
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
  updateEmployeeAvatar,
  clearEmployeeFace,
} from "./user.service.js";

const ALLOWED_ROLES = [
  "admin",
  "director",
  "branch_manager",
  "department_head",
];

// ─── GET /api/users/profile ───────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    return res.json({ success: true, user });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── PUT /api/users/profile ───────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const user = await updateUserProfile(req.user.id, req.body);
    return res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── PUT /api/users/change-password ──────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
    }
    const hash = await getUserPasswordHash(req.user.id);
    if (!hash)
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });

    const isMatch = await bcrypt.compare(current_password, hash);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu hiện tại không đúng" });

    const newHash = await bcrypt.hash(new_password, 10);
    await updateUserPassword(req.user.id, newHash);
    return res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── POST /api/users/avatar ───────────────────────────────────────────────────
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Không có file được upload" });
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const result = await updateUserAvatar(req.user.id, avatarUrl);
    return res.json({ success: true, avatarUrl: result.avatar_url });
  } catch (error) {
    console.error("uploadAvatar error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── GET /api/users/qr ────────────────────────────────────────────────────────
export const getQrCode = async (req, res) => {
  try {
    const qr_code = await getUserQr(req.user.id);
    return res.json({ success: true, qr_code });
  } catch (error) {
    console.error("getQrCode error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// QUẢN LÝ NHÂN VIÊN
// ══════════════════════════════════════════════════════════════════════════════

// ─── GET /api/users/employees ─────────────────────────────────────────────────
export const listEmployees = async (req, res) => {
  try {
    if (!ALLOWED_ROLES.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền truy cập" });
    }
    const { search, departmentId, branchId, page, limit } = req.query;
    const { employees, total } = await getEmployeeList(req.user, {
      search,
      departmentId,
      branchId,
      page,
      limit,
    });
    return res.json({
      success: true,
      employees,
      total,
      page: parseInt(page || 1),
      totalPages: Math.ceil(total / parseInt(limit || 20)),
    });
  } catch (error) {
    console.error("listEmployees error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── GET /api/users/employees/:id ─────────────────────────────────────────────
export const getEmployee = async (req, res) => {
  try {
    if (!ALLOWED_ROLES.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền truy cập" });
    }
    const employee = await getEmployeeDetail(req.params.id);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy nhân viên" });
    return res.json({ success: true, employee });
  } catch (error) {
    console.error("getEmployee error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── POST /api/users/employees ────────────────────────────────────────────────
export const addEmployee = async (req, res) => {
  try {
    if (!["admin", "director"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền thêm nhân viên" });
    }
    const { email, password, ...rest } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email và mật khẩu là bắt buộc" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const employee = await createEmployee({ ...rest, email, password_hash });
    return res
      .status(201)
      .json({ success: true, message: "Thêm nhân viên thành công", employee });
  } catch (error) {
    console.error("addEmployee error:", error);
    if (error.message?.includes("UNIQUE") || error.number === 2627) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã tồn tại" });
    }
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── PUT /api/users/employees/:id ─────────────────────────────────────────────
export const editEmployee = async (req, res) => {
  try {
    if (!ALLOWED_ROLES.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền chỉnh sửa" });
    }
    const employee = await updateEmployee(req.params.id, req.body);
    return res.json({
      success: true,
      message: "Cập nhật thành công",
      employee,
    });
  } catch (error) {
    console.error("editEmployee error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── PATCH /api/users/employees/:id/status ───────────────────────────────────
export const toggleStatus = async (req, res) => {
  try {
    if (!["admin", "director", "branch_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền thay đổi trạng thái",
      });
    }
    const { is_active } = req.body;
    const employee = await toggleEmployeeStatus(req.params.id, is_active);
    return res.json({
      success: true,
      message: is_active ? "Đã mở khoá tài khoản" : "Đã khoá tài khoản",
      employee,
    });
  } catch (error) {
    console.error("toggleStatus error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── POST /api/users/employees/:id/avatar ────────────────────────────────────
export const uploadEmployeeAvatar = async (req, res) => {
  try {
    if (!["admin", "director"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Không có quyền" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Không có file được upload" });
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await updateEmployeeAvatar(req.params.id, avatarUrl);
    return res.json({ success: true, avatarUrl });
  } catch (error) {
    console.error("uploadEmployeeAvatar error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── DELETE /api/users/employees/:id/face ────────────────────────────────────
export const resetFace = async (req, res) => {
  try {
    if (!["admin", "director"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Không có quyền" });
    }
    await clearEmployeeFace(req.params.id);
    return res.json({ success: true, message: "Đã xóa dữ liệu khuôn mặt" });
  } catch (error) {
    console.error("resetFace error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── DELETE /api/users/employees/:id ─────────────────────────────────────────
export const removeEmployee = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền xóa nhân viên" });
    }
    await deleteEmployee(req.params.id);
    return res.json({ success: true, message: "Đã xóa nhân viên" });
  } catch (error) {
    console.error("removeEmployee error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
