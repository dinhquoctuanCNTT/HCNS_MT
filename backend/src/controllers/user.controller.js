import {
  getAllUsers,
  updateMyProfile,
  updateAvatar,
} from "../services/auth.service.js";

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

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

    if (!fullName) {
      return res.status(400).json({ message: "Họ tên không được để trống" });
    }

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

    return res
      .status(200)
      .json({ message: "Cập nhật thông tin thành công", user });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// ✅ Thêm mới
const uploadAvatarController = async (req, res) => {
  try {
    console.log("=== UPLOAD AVATAR ===");
    console.log("req.user:", req.user);
    console.log("req.file:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "Không có file ảnh!" });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const updated = await updateAvatar(req.user.id, avatarUrl);

    return res.status(200).json({
      message: "Cập nhật avatar thành công!",
      avatarUrl: updated.avatar_url,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

export { getUsers, updateProfile, uploadAvatarController };
