import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import workflowRoutes from "../modules/workflow/routes/workflow.routes.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import attendanceRoutes from "./attendance.routes.js";
import shiftRoutes from "../modules/shift/shift.routes.js";
import reportRoutes from "../modules/report/report.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import explanationRoutes from "../modules/explanation/explanation.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", authMiddleware, requireRole("admin"), userRoutes);
router.use("/workflow", workflowRoutes);
router.use("/dashboard", authMiddleware, dashboardRoutes);
router.use("/report", authMiddleware, reportRoutes);
router.use("/attendance", authMiddleware, attendanceRoutes);
router.use("/shifts", authMiddleware, shiftRoutes);
router.use("/explanations", authMiddleware, explanationRoutes);

export default router;
