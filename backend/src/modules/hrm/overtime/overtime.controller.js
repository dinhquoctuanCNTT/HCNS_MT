import * as svc from "./overtime.service.js";
import { getPool, sql } from "../../../shared/config/db.js";

export async function getMyRequests(req, res) {
  try { res.json(await svc.getMyRequests(req.user.id)); }
  catch (e) { res.status(500).json({ message: e.message }); }
}

export async function getAll(req, res) {
  try {
    const { status, month, year } = req.query;
    let deptId = null;
    if (req.user.role === "department_head") {
      const pool = await getPool();
      const r = await pool.request()
        .input("id", sql.BigInt, req.user.id)
        .query("SELECT department_id FROM users WHERE id=@id");
      deptId = r.recordset[0]?.department_id ?? null;
    }
    res.json(await svc.getAllRequests({
      status,
      month: month ? parseInt(month) : null,
      year:  year  ? parseInt(year)  : null,
      deptId,
    }));
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function create(req, res) {
  try {
    const result = await svc.createRequest(req.user.id, req.body);
    res.status(201).json(result);
  } catch (e) { res.status(400).json({ message: e.message }); }
}

export async function approve(req, res) {
  try {
    await svc.approve(parseInt(req.params.id), req.user.id, req.body.note);
    res.json({ message: "Đã duyệt" });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function reject(req, res) {
  try {
    await svc.reject(parseInt(req.params.id), req.user.id, req.body.note);
    res.json({ message: "Đã từ chối" });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function getMonthlySummary(req, res) {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year  = parseInt(req.query.year)  || new Date().getFullYear();
    res.json(await svc.getMonthlySummary(month, year));
  } catch (e) { res.status(500).json({ message: e.message }); }
}
