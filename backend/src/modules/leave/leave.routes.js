import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { requireMinRole } from "../../middlewares/role.middleware.js";
import * as ctrl from "./leave.controller.js";

const router = Router();
router.use(authMiddleware);

// Employee
router.get("/my",          ctrl.getMyRequests);
router.get("/my/balance",  ctrl.getMyBalance);
router.post("/",           ctrl.create);
router.patch("/:id/cancel", ctrl.cancel);

// TBP + HCNS + Admin
router.get("/",            requireMinRole("department_head"), ctrl.getAll);
router.get("/balances",    requireMinRole("department_head"), ctrl.getAllBalances);
router.get("/stats",       requireMinRole("department_head"), ctrl.getStats);
router.get("/:id",         requireMinRole("department_head"), ctrl.getOne);

// Trưởng bộ phận duyệt bước 1
router.patch("/:id/tbp-approve", requireMinRole("department_head"), ctrl.tbpApprove);
router.patch("/:id/tbp-reject",  requireMinRole("department_head"), ctrl.tbpReject);

// HCNS / Admin duyệt bước 2
router.patch("/:id/hcns-approve", requireMinRole("branch_manager"), ctrl.hcnsApprove);
router.patch("/:id/hcns-reject",  requireMinRole("branch_manager"), ctrl.hcnsReject);

export default router;
