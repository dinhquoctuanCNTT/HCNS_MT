import express from "express";
import * as ctrl from "./explanation.controller.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { getPendingCount } from "./explanation.service.js";

const router = express.Router();

// user routes
router.post("/", ctrl.createExplanation);
router.get("/my", ctrl.getMyExplanations);

// admin routes
router.get("/pending-count", requireRole("admin"), ctrl.getPendingCountHandler);
router.get("/", requireRole("admin"), ctrl.getAllExplanations);
router.post("/:id/approve", requireRole("admin"), ctrl.approveExplanation);
router.post("/:id/reject", requireRole("admin"), ctrl.rejectExplanation);

export default router;
