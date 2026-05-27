import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Auth
import authRoutes from "./auth/auth.routes.js";

// Shared
import { loadModels } from "./shared/services/face.service.js";
import authMiddleware from "./shared/middlewares/auth.middleware.js";

// HRM modules
import userRoutes from "./modules/hrm/user/user.routes.js";
import attendanceRoute from "./modules/hrm/attendance/attendance.routes.js";
import shiftRoutes from "./modules/hrm/shift/shift.routes.js";
import holidaysRoutes from "./modules/hrm/holidays/holidays.routes.js";
import leaveRoutes from "./modules/hrm/leave/leave.routes.js";
import overtimeRoutes from "./modules/hrm/overtime/overtime.routes.js";
import explanationRoutes from "./modules/hrm/explanation/explanation.routes.js";
import reportRoutes from "./modules/hrm/report/report.routes.js";

// Other modules
import workflowRoutes from "./modules/workflow/routes/workflow.routes.js";
import notificationRoutes from "./modules/workflow/routes/notification.route.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import supportRoutes from "./modules/support/support.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

loadModels()
  .then(() => console.log("[Server] Face models preloaded"))
  .catch((err) => console.error("[Server] Face model load error:", err));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ── Auth ──
app.use("/api/auth", authRoutes);

// ── HRM ──
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoute);
app.use("/api/shifts", authMiddleware, shiftRoutes);
app.use("/api/holidays", holidaysRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/overtime", overtimeRoutes);
app.use("/api/explanations", authMiddleware, explanationRoutes);
app.use("/api/report", reportRoutes);

// ── Other modules ──
app.use("/api/workflow", workflowRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/setting", settingsRoutes);
app.use("/api/support", supportRoutes);

// ── Serve Frontend ──
const frontendPath = process.env.FRONTEND_PATH || path.join(__dirname, "../../frontend");
app.use(express.static(frontendPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
