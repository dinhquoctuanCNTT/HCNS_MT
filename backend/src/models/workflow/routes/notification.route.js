import express from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import {
  getNotifications,
  readNotification,
  readAllNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/read-all", authMiddleware, readAllNotifications);
router.patch("/:id/read", authMiddleware, readNotification);

export default router;
