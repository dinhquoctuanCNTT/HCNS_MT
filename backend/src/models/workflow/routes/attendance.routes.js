import express from "express";
import * as attendanceController from "../controllers/attendance.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

// ── Face ──────────────────────────────────────────────────
router.post("/register-face", attendanceController.registerFace);

// ── Chấm công ─────────────────────────────────────────────
router.post("/check-in", attendanceController.checkIn);
router.post("/check-out", attendanceController.checkOut);
router.get("/history", attendanceController.getHistory);

// ── GPS Fence (admin) ─────────────────────────────────────
router.get("/locations", attendanceController.getLocations);
router.post("/locations", attendanceController.createLocation);
router.put("/locations/:id", attendanceController.updateLocation);
router.delete("/locations/:id", attendanceController.deleteLocation);

// ── Đơn xin nghỉ ─────────────────────────────────────────
router.get("/leave", attendanceController.getLeaveRequests);
router.post("/leave", attendanceController.createLeaveRequest);
router.get("/leave/all", attendanceController.getAllLeaveRequests);
router.patch("/leave/:id/approve", attendanceController.approveLeaveRequest);
router.patch("/leave/:id/reject", attendanceController.rejectLeaveRequest);

// ── Dashboard ─────────────────────────────────────────────
router.get("/dashboard", attendanceController.getDashboard);

export default router;
