import express from "express";
import * as attendanceController from "../controllers/attendance.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Tất cả route đều cần đăng nhập
router.use(authMiddleware);

router.post("/register-face", attendanceController.registerFace); // Đăng ký khuôn mặt
router.post("/check-in", attendanceController.checkIn); // Chấm công
router.get("/history", attendanceController.getHistory); // Lịch sử
router.post("/check-out", attendanceController.checkOut); // chấm ra về

export default router;
