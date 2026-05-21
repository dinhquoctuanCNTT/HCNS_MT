import * as explanationService from "./explanation.service.js";
import { getPool } from "../../config/db.js";

async function getDepartmentId(userId) {
  const pool = await getPool();
  const res = await pool.request().input("id", userId)
    .query(`SELECT department_id FROM users WHERE id = @id`);
  return res.recordset[0]?.department_id ?? null;
}

export async function createExplanation(req, res) {
  try {
    const userId = req.user.id;
    const { workDate, reason, requestedCheckIn, requestedCheckOut } = req.body;

    if (!workDate || !reason) {
      return res
        .status(400)
        .json({ message: "Thiếu ngày hoặc lý do giải trình " });
    }
    const id = await explanationService.createExplanation({
      userId,
      workDate,
      reason,
      requestedCheckIn,
      requestedCheckOut,
    });
    res.status(201).json({ message: "tạo đơn giải trình thành cồng ", id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getMyExplanations(req, res) {
  try {
    const data = await explanationService.getUserExplanations(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function getAllExplanations(req, res) {
  try {
    const { status, page, limit } = req.query;
    const isDeptHead = req.user.role === "department_head";
    const departmentId = isDeptHead ? await getDepartmentId(req.user.id) : null;
    const data = await explanationService.getAllExplanations({
      status,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      departmentId,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function approveExplanation(req, res) {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;
    const approverId = req.user.id;
    const isDeptHead = req.user.role === "department_head";
    const departmentId = isDeptHead ? await getDepartmentId(approverId) : null;
    await explanationService.approveExplanation({ id, approverId, adminNote, departmentId });
    res.json({ message: "Đã duyệt đơn giải trình" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function rejectExplanation(req, res) {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;
    const approverId = req.user.id;
    const isDeptHead = req.user.role === "department_head";
    const departmentId = isDeptHead ? await getDepartmentId(approverId) : null;
    await explanationService.rejectExplanation({ id, approverId, adminNote, departmentId });
    res.json({ message: "Đã từ chối đơn giải trình" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getPendingCountHandler(req, res) {
  try {
    const isDeptHead = req.user.role === "department_head";
    const departmentId = isDeptHead ? await getDepartmentId(req.user.id) : null;
    const count = await explanationService.getPendingCount({ departmentId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
