import { Router } from "express";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";
import { requireMinRole } from "../../../shared/middlewares/role.middleware.js";
import * as ctrl from "./overtime.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/my",         ctrl.getMyRequests);
router.post("/",          ctrl.create);

router.get("/summary",    requireMinRole("department_head"), ctrl.getMonthlySummary);
router.get("/",           requireMinRole("department_head"), ctrl.getAll);
router.patch("/:id/approve", requireMinRole("department_head"), ctrl.approve);
router.patch("/:id/reject",  requireMinRole("department_head"), ctrl.reject);

export default router;
