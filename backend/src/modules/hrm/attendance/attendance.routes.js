import express from "express";
import * as attendanceController from "./attendance.controller.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";
import { requireRole } from "../../../shared/middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/register-face", attendanceController.registerFace);
router.post("/check-in", attendanceController.checkIn);
router.get("/history", attendanceController.getHistory);
router.post("/check-out", attendanceController.checkOut);
router.get("/leave", attendanceController.getLeaveRequests);
router.post("/leave", attendanceController.createLeaveRequest);
router.get("/history/admin", attendanceController.getHistoryAdmin);

// ============ ADMIN ROUTES ============
router.get("/stats", attendanceController.getAttendanceStats);
router.get("/leave/stats", attendanceController.getLeaveStats);
router.get(
  "/leave/all",
  requireRole("admin"),
  attendanceController.getAllLeaveRequests,
);
router.put(
  "/leave/:id/approve",
  requireRole("admin"),
  attendanceController.approveLeaveRequest,
);
router.put(
  "/leave/:id/reject",
  requireRole("admin"),
  attendanceController.rejectLeaveRequest,
);

router.get(
  "/history/admin",
  requireRole("admin"),
  attendanceController.getHistoryAdmin,
);
export default router;
