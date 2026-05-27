import { getPool, sql } from "../../../shared/config/db.js";
import ExcelJS from "exceljs";

export async function exportAttendanceExcel({ month, departmentId, branchId }) {
  const pool = getPool();
  const [y, m] = month.split("-");
  const fromDate = `${y}-${m}-01`;
  const last = new Date(parseInt(y), parseInt(m), 0).getDate();
  const toDate = `${y}-${m}-${last}`;

  // ── Query dữ liệu ─────────────────────────────────────────────────────────
  let query = `
    SELECT
      u.employee_code,
      u.full_name,
      d.name AS department_name,
      u.job_title,
      ol.name AS branch_name,
      a.date,
      a.check_in,
      a.check_out,
      a.late_minutes,
      a.early_minutes,
      CASE
        WHEN a.check_in IS NOT NULL AND a.check_out IS NOT NULL
        THEN DATEDIFF(MINUTE, a.check_in, a.check_out)
        ELSE 0
      END AS work_minutes
    FROM users u
    LEFT JOIN Attendance a ON a.user_id = u.id
      AND a.date BETWEEN @from AND @to
    LEFT JOIN departments d ON d.id = u.department_id
    LEFT JOIN office_locations ol ON ol.id = u.branch_id
    WHERE u.is_active = 1
  `;

  const req = pool
    .request()
    .input("from", sql.Date, fromDate)
    .input("to", sql.Date, toDate);

  if (departmentId) {
    query += ` AND u.department_id = @departmentId`;
    req.input("departmentId", sql.BigInt, departmentId);
  }
  if (branchId) {
    query += ` AND u.branch_id = @branchId`;
    req.input("branchId", sql.Int, branchId);
  }

  query += ` ORDER BY u.department_name, u.full_name, a.date`;

  const result = await req.query(query);
  const rows = result.recordset;

  // ── Tạo workbook ──────────────────────────────────────────────────────────
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "HCNS_MT";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(`Bảng công ${month}`, {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });

  // ── Tiêu đề ───────────────────────────────────────────────────────────────
  sheet.mergeCells("A1:K1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = `BẢNG CHẤM CÔNG THÁNG ${m}/${y}`;
  titleCell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E293B" },
  };
  sheet.getRow(1).height = 36;

  sheet.mergeCells("A2:K2");
  const subCell = sheet.getCell("A2");
  subCell.value = departmentId
    ? `Phòng ban: ${rows[0]?.department_name || ""}`
    : branchId
      ? `Chi nhánh: ${rows[0]?.branch_name || ""}`
      : "Tất cả phòng ban / chi nhánh";
  subCell.font = { italic: true, size: 11, color: { argb: "FF64748B" } };
  subCell.alignment = { horizontal: "center" };
  sheet.getRow(2).height = 22;

  // ── Header columns ────────────────────────────────────────────────────────
  const headers = [
    { header: "Mã NV", key: "employee_code", width: 12 },
    { header: "Họ và tên", key: "full_name", width: 22 },
    { header: "Phòng ban", key: "department_name", width: 18 },
    { header: "Chi nhánh", key: "branch_name", width: 18 },
    { header: "Chức vụ", key: "job_title", width: 16 },
    { header: "Ngày", key: "date", width: 12 },
    { header: "Giờ vào", key: "check_in", width: 10 },
    { header: "Giờ ra", key: "check_out", width: 10 },
    { header: "Số giờ công", key: "work_hours", width: 12 },
    { header: "Phút muộn", key: "late_minutes", width: 12 },
    { header: "Trạng thái", key: "status", width: 14 },
  ];

  sheet.columns = headers;

  // Header row style
  const headerRow = sheet.getRow(3);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h.header;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF334155" },
    };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF475569" } },
      bottom: { style: "thin", color: { argb: "FF475569" } },
      left: { style: "thin", color: { argb: "FF475569" } },
      right: { style: "thin", color: { argb: "FF475569" } },
    };
  });
  headerRow.height = 28;

  // ── Data rows ─────────────────────────────────────────────────────────────
  let rowIdx = 4;
  rows.forEach((r, i) => {
    const workHours =
      r.work_minutes > 0 ? (r.work_minutes / 60).toFixed(1) : "—";

    const checkIn = r.check_in
      ? new Date(r.check_in).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";
    const checkOut = r.check_out
      ? new Date(r.check_out).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

    const dateStr = r.date ? new Date(r.date).toLocaleDateString("vi-VN") : "—";

    // Xác định trạng thái
    let status = "—";
    let statusColor = "FF374151";
    if (!r.check_in) {
      status = "Vắng mặt";
      statusColor = "FFDC2626";
    } else if (r.late_minutes > 0) {
      status = `Đi muộn ${r.late_minutes}p`;
      statusColor = "FFD97706";
    } else if (r.check_in && !r.check_out) {
      status = "Thiếu ra";
      statusColor = "FF9333EA";
    } else {
      status = "Đúng giờ";
      statusColor = "FF16A34A";
    }

    const row = sheet.addRow([
      r.employee_code || "—",
      r.full_name,
      r.department_name || "—",
      r.branch_name || "—",
      r.job_title || "—",
      dateStr,
      checkIn,
      checkOut,
      workHours,
      r.late_minutes > 0 ? r.late_minutes : "—",
      status,
    ]);

    // Màu xen kẽ
    const bgColor = i % 2 === 0 ? "FFFAFAFA" : "FFFFFFFF";
    row.eachCell((cell, colNum) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: bgColor },
      };
      cell.border = {
        top: { style: "hair", color: { argb: "FFE2E8F0" } },
        bottom: { style: "hair", color: { argb: "FFE2E8F0" } },
        left: { style: "hair", color: { argb: "FFE2E8F0" } },
        right: { style: "hair", color: { argb: "FFE2E8F0" } },
      };
      cell.alignment = { vertical: "middle", wrapText: false };
      // Tô màu cột trạng thái
      if (colNum === 11) {
        cell.font = { bold: true, color: { argb: statusColor } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      }
    });

    row.height = 22;
    rowIdx++;
  });

  // ── Tổng kết cuối ─────────────────────────────────────────────────────────
  const totalRow = sheet.addRow([
    "",
    `Tổng: ${rows.length} bản ghi`,
    "",
    "",
    "",
    "",
    "",
    "",
    `${(rows.reduce((s, r) => s + (r.work_minutes || 0), 0) / 60).toFixed(1)}h`,
    rows.reduce((s, r) => s + (r.late_minutes || 0), 0),
    "",
  ]);
  totalRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF1F5F9" },
    };
    cell.border = {
      top: { style: "medium", color: { argb: "FF334155" } },
      bottom: { style: "medium", color: { argb: "FF334155" } },
    };
  });
  totalRow.height = 24;

  // ── Freeze header ─────────────────────────────────────────────────────────
  sheet.views = [{ state: "frozen", ySplit: 3 }];

  // ── Auto filter ───────────────────────────────────────────────────────────
  sheet.autoFilter = { from: "A3", to: "K3" };

  return workbook;
}

export async function getDepartments() {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT id, name FROM departments ORDER BY name
  `);
  return result.recordset;
}

export async function getBranches() {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT id, name FROM office_locations ORDER BY name
  `);
  return result.recordset;
}

export async function getDeptStats(date) {
  const pool = getPool();
  const today = date || new Date().toISOString().slice(0, 10);
  const result = await pool
    .request()
    .input("date", sql.Date, today)
    .query(`
      SELECT
        d.id,
        d.name AS department_name,
        COUNT(DISTINCT u.id) AS total_nv,
        COUNT(DISTINCT CASE WHEN a.check_in IS NOT NULL THEN a.user_id END) AS da_cham,
        COUNT(DISTINCT CASE WHEN a.late_minutes > 0 THEN a.user_id END) AS di_muon,
        COUNT(DISTINCT CASE WHEN a.check_in IS NULL AND u.id IS NOT NULL THEN u.id END) AS vang_mat
      FROM departments d
      LEFT JOIN users u ON u.department_id = d.id AND u.status = 1
      LEFT JOIN Attendance a ON a.user_id = u.id AND a.date = @date
      GROUP BY d.id, d.name
      ORDER BY d.name
    `);
  return result.recordset;
}
