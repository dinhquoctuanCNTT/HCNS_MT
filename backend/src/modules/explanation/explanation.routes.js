import express from "express";
import * as ctrl from "./explanation.controller.js";
import { requireMinRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

// user routes
router.post("/", ctrl.createExplanation);
router.get("/my", ctrl.getMyExplanations);

// department_head + admin routes
router.get("/pending-count", requireMinRole("department_head"), ctrl.getPendingCountHandler);
router.get("/", requireMinRole("department_head"), ctrl.getAllExplanations);
router.post("/:id/approve", requireMinRole("department_head"), ctrl.approveExplanation);
router.post("/:id/reject", requireMinRole("department_head"), ctrl.rejectExplanation);

export default router;
