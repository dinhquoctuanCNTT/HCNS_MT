import {
  exportAttendanceExcel,
  getDepartments,
  getBranches,
  getDeptStats,
} from "./report.service.js";

export async function exportExcel(req, res) {
  try {
    const { month, departmentId, branchId } = req.query;
    const targetMonth = month || new Date().toISOString().slice(0, 7);

    const workbook = await exportAttendanceExcel({
      month: targetMonth,
      departmentId: departmentId ? parseInt(departmentId) : null,
      branchId: branchId ? parseInt(branchId) : null,
    });

    const filename = `bang-cong-${targetMonth}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function listDepartments(req, res) {
  try {
    const data = await getDepartments();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function listBranches(req, res) {
  try {
    const data = await getBranches();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deptStats(req, res) {
  try {
    const data = await getDeptStats(req.query.date);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
