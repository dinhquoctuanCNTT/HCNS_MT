import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import workflowRoutes from "./modules/workflow/routes/workflow.routes.js";
import notificationRoutes from "./modules/workflow/routes/notification.route.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import reportRoutes from "./modules/report/report.routes.js";
import { loadModels } from "./services/face.service.js";
import attendanceRoute from "./routes/attendance.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import supportRoutes from "./modules/support/support.routes.js";
import explanationRoutes from "./modules/explanation/explanation.routes.js";
import shiftRoutes from "./modules/shift/shift.routes.js";
import holidaysRoutes from "./modules/holidays/holidays.routes.js";
import authMiddleware from "./middlewares/auth.middleware.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
  }),
);
app.use(express.json({ limit: "10mb" }));
loadModels()
  .then(() => console.log("[Server] Face models preloaded"))
  .catch((err) => console.error("[Server] Face model load error:", err));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ---- API Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/report", reportRoutes);

app.use("/api/setting", settingsRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/explanations", authMiddleware, explanationRoutes);
app.use("/api/shifts", authMiddleware, shiftRoutes);
app.use("/api/holidays", holidaysRoutes);

// ---- Serve Frontend ----
const frontendPath =
  process.env.FRONTEND_PATH || path.join(__dirname, "../../frontend");
app.use(express.static(frontendPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ==== MOBILE ======
app.use("/api/attendance", attendanceRoute);
export default app;
