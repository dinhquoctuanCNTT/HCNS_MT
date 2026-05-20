import { Router } from "express";
import * as ctrl from "./holidays.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/",    authMiddleware, ctrl.getHolidays);
router.post("/",   authMiddleware, requireRole("admin"), ctrl.createHoliday);
router.delete("/:id", authMiddleware, requireRole("admin"), ctrl.deleteHoliday);

export default router;
