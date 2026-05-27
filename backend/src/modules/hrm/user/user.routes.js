import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getQrCode,
  // Quản lý nhân viên
  listEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  toggleStatus,
  removeEmployee,
  uploadEmployeeAvatar,
  resetFace,
} from "./user.controller.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

const imgFilter = (_req, file, cb) => {
  cb(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
};

// Avatar cho chính user đang đăng nhập
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/avatars/"),
  filename: (req, file, cb) => {
    cb(null, `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imgFilter });

// Avatar cho nhân viên bất kỳ (admin upload)
const empAvatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/avatars/"),
  filename: (req, file, cb) => {
    cb(null, `avatar-emp-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const uploadEmpAvatar = multer({ storage: empAvatarStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imgFilter });

router.use(authMiddleware);

// ── Profile ───────────────────────────────────────────────────────────────────
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.get("/qr", getQrCode);

// ── Quản lý nhân viên ─────────────────────────────────────────────────────────
router.get("/employees", listEmployees);
router.post("/employees", addEmployee);
router.get("/employees/:id", getEmployee);
router.put("/employees/:id", editEmployee);
router.patch("/employees/:id/status", toggleStatus);
router.delete("/employees/:id", removeEmployee);
router.post("/employees/:id/avatar", uploadEmpAvatar.single("avatar"), uploadEmployeeAvatar);
router.delete("/employees/:id/face", resetFace);

export default router;
