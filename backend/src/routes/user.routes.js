import express from "express";
import * as userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../config/multer.js";

const router = express.Router();

router.get("/", authMiddleware, userController.getUsers);
router.put("/profile", authMiddleware, userController.updateProfile);

router.post(
  "/avatar",
  (req, res, next) => {
    console.log("=== HIT /avatar route ===");
    console.log("Headers:", req.headers.authorization);
    next();
  },
  authMiddleware,
  (req, res, next) => {
    console.log("=== Passed authMiddleware ===");
    next();
  },
  uploadAvatar.single("avatar"),
  (req, res, next) => {
    console.log("=== Passed multer ===");
    next();
  },
  userController.uploadAvatarController,
);
export default router;
