import { Router } from "express";
import { register, login, getMe, changePassword } from "./auth.controller.js";
import authMiddleware from "../shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.put("/change-password", authMiddleware, changePassword);

export default router;
