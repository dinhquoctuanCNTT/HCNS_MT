import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import workflowRoutes from "../models/workflow/routes/workflow.routes.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);

// Chỉ admin mới quản lý users
router.use("/users", authMiddleware, requireRole("admin"), userRoutes);

// Workflow: đã xử lý phân quyền chi tiết bên trong
router.use("/workflow", workflowRoutes);

export default router;
