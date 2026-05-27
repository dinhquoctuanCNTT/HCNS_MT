import express from "express";
import * as shiftController from "./shift.controller.js";

const router = express.Router();

router.get("/", shiftController.listShifts);
router.get("/:id", shiftController.getShift);
router.post("/", shiftController.createShift);
router.put("/:id", shiftController.updateShift);
router.delete("/:id", shiftController.deleteShift);

export default router;
