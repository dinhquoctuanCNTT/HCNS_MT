import express from "express";
import { getStats, getPendingCount, latestRequests } from "./dashboard.controller.js";

const router = express.Router();

router.get("/stats", getStats);
router.get("/pending-count", getPendingCount);
router.get("/latest-requests", latestRequests);

export default router;
