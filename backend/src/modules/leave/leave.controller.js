import * as svc from "./leave.service.js";

const year = () => new Date().getFullYear();

// ── Balance ───────────────────────────────────────────────────────────────────

export async function getMyBalance(req, res) {
  try {
    const y = parseInt(req.query.year) || year();
    const data = await svc.getLeaveBalance(req.user.id, y);
    res.json(data ?? { total_days: 0, used_days: 0, carried_over: 0 });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function getAllBalances(req, res) {
  try {
    const y = parseInt(req.query.year) || year();
    res.json(await svc.getAllLeaveBalances(y));
  } catch (e) { res.status(500).json({ message: e.message }); }
}

// ── Requests — Employee ───────────────────────────────────────────────────────

export async function getMyRequests(req, res) {
  try {
    res.json(await svc.getMyLeaveRequests(req.user.id));
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function create(req, res) {
  try {
    const { from_date, to_date, leave_type, leave_category, total_days, reason } = req.body;
    if (!from_date || !to_date) return res.status(400).json({ message: "Thiếu ngày" });

    // Kiểm tra báo trước tối thiểu
    const daysAhead = Math.floor((new Date(from_date) - new Date()) / 86400000);
    const numDays = total_days ?? 1;
    if (leave_category !== "emergency") {
      if (numDays <= 1 && daysAhead < 1)
        return res.status(400).json({ message: "Nghỉ 1 ngày phải báo trước ít nhất 1 ngày" });
      if (numDays > 1 && daysAhead < 2)
        return res.status(400).json({ message: "Nghỉ nhiều hơn 1 ngày phải báo trước ít nhất 2 ngày" });
    }

    // Kiểm tra số ngày phép còn lại nếu là phép năm
    if ((leave_category ?? "annual") === "annual") {
      const bal = await svc.getLeaveBalance(req.user.id, new Date(from_date).getFullYear());
      const remaining = (bal?.total_days ?? 0) - (bal?.used_days ?? 0);
      if (remaining < numDays)
        return res.status(400).json({ message: `Không đủ ngày phép. Còn lại: ${remaining} ngày` });
    }

    const result = await svc.createRequest(req.user.id, req.body);
    res.status(201).json(result);
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function cancel(req, res) {
  try {
    const result = await svc.cancelRequest(parseInt(req.params.id), req.user.id);
    if (!result) return res.status(400).json({ message: "Không thể huỷ đơn này" });
    res.json(result);
  } catch (e) { res.status(500).json({ message: e.message }); }
}

// ── Requests — Admin / HCNS / TBP ────────────────────────────────────────────

export async function getAll(req, res) {
  try {
    const { status, month, year: y } = req.query;
    let deptId = null;
    if (req.user.role === "department_head") {
      const pool = await (await import("../../config/db.js")).getPool();
      const r = await pool.request()
        .input("id", (await import("../../config/db.js")).sql.BigInt, req.user.id)
        .query("SELECT department_id FROM users WHERE id=@id");
      deptId = r.recordset[0]?.department_id ?? null;
    }
    res.json(await svc.getAllRequests({ status, deptId, month: month ? parseInt(month) : null, year: y ? parseInt(y) : null }));
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function getOne(req, res) {
  try {
    const data = await svc.getRequestById(parseInt(req.params.id));
    if (!data) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
}

// Trưởng bộ phận duyệt bước 1
export async function tbpApprove(req, res) {
  try {
    await svc.tbpApprove(parseInt(req.params.id), req.user.id, req.body.note);
    res.json({ message: "Đã duyệt bước 1" });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function tbpReject(req, res) {
  try {
    await svc.tbpReject(parseInt(req.params.id), req.user.id, req.body.note);
    res.json({ message: "Đã từ chối" });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

// HCNS duyệt bước 2
export async function hcnsApprove(req, res) {
  try {
    await svc.hcnsApprove(parseInt(req.params.id), req.user.id, req.body.note);
    res.json({ message: "Đã duyệt - đơn hoàn tất" });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function hcnsReject(req, res) {
  try {
    await svc.hcnsReject(parseInt(req.params.id), req.user.id, req.body.note);
    res.json({ message: "Đã từ chối" });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function getStats(req, res) {
  try {
    const y = parseInt(req.query.year) || year();
    res.json(await svc.getLeaveStats(y));
  } catch (e) { res.status(500).json({ message: e.message }); }
}
