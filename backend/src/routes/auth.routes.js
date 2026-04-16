import express from "express";
import {
  register,
  login,
  me,
  updateProfile,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ Gọi trực tiếp, không dùng authController.xxx
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.put("/me", authMiddleware, updateProfile);

export default router;
