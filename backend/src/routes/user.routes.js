import express from "express";
import * as userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../config/multer.js";

const router = express.Router();

router.get("/", authMiddleware, userController.getUsers);
router.put("/profile", authMiddleware, userController.updateProfile);

router.post(
  "/avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  userController.uploadAvatarController,
);

export default router;
