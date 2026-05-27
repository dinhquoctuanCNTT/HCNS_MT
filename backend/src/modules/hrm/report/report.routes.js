import express from "express";
import {
  exportExcel,
  listDepartments,
  listBranches,
  deptStats,
} from "./report.controller.js";

const router = express.Router();

router.get("/export/attendance", exportExcel);
router.get("/departments", listDepartments);
router.get("/branches", listBranches);
router.get("/dept-stats", deptStats);

export default router;
