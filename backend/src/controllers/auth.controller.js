import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  updateMyProfile,
} from "../services/auth.service.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/jwt.js";

// 1. Xử lý Đăng ký
const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      dateOfBirth,
      address,
      gender,
      jobTitle,
      departmentName,
    } = req.body;

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
    }

    const existingEmail = await findUserByEmail(email);
    if (existingEmail)
      return res.status(400).json({ message: "Email đã tồn tại" });

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      fullName,
      email,
      phone,
      passwordHash,
      dateOfBirth,
      address,
      gender,
      jobTitle,
      departmentName,
    });

    return res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// 2. Đăng nhập bằng số điện thoại
const login = async (req, res) => {
  try {
    const { phone, password } = req.body; // ✅ đổi username → phone

    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập số điện thoại và mật khẩu" });
    }

    const user = await findUserByUsername(phone); // tìm theo phone
    if (!user) {
      return res.status(400).json({ message: "Số điện thoại không tồn tại" });
    }

    if (user.status !== 1) {
      return res.status(403).json({ message: "Tài khoản đang bị khóa" });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    const token = generateToken({
      id: user.id,
      phone: user.phone,
      role: user.role,
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role,
        avatar_url: user.avatar_url || null,
        date_of_birth: user.date_of_birth || null,
        address: user.address || null,
        gender: user.gender || null,
        job_title: user.job_title || null,
        department_name: user.department_name || null,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// 3. Cập nhật thông tin cá nhân
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      phone,
      dateOfBirth,
      address,
      gender,
      jobTitle,
      departmentName,
    } = req.body;

    if (!fullName)
      return res.status(400).json({ message: "Họ tên không được để trống" });

    const user = await updateMyProfile({
      userId,
      fullName,
      phone,
      dateOfBirth,
      address,
      gender,
      jobTitle,
      departmentName,
    });

    return res.status(200).json({ message: "Cập nhật thành công", user });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// 4. Lấy thông tin User hiện tại
const me = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

export { register, login, me, updateProfile };
