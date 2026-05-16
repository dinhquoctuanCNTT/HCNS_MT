import { getPool, sql } from "../../config/db.js";

export async function getDashboardStats(date, branchId, status) {
  const pool = getPool();
  const today = date || new Date().toISOString().slice(0, 10);
  const bid = branchId ? parseInt(branchId) : null;

  // status → điều kiện SQL trên bảng Attendance (chỉ dùng cột của a)
  const statusCond =
    status === "late"   ? "AND (a.late_minutes > 0 OR a.early_minutes > 0)" :
    status === "normal" ? "AND a.check_in IS NOT NULL AND (a.late_minutes IS NULL OR a.late_minutes = 0) AND a.check_out IS NOT NULL" :
    status === "absent" ? "AND a.check_in IS NULL" : "";

  const addBase = (req) => {
    req.input("date", sql.Date, today);
    if (bid) req.input("branchId", sql.Int, bid);
    return req;
  };

  // JOIN users chỉ cần khi có branchId filter
  const userJoin  = bid ? "JOIN users u ON u.id = a.user_id" : "";
  const userWhere = bid ? "AND u.branch_id = @branchId" : "";
  const userWhereNV = bid ? "AND u.branch_id = @branchId" : "";

  // KPI hôm nay
  const kpiReq = addBase(pool.request());
  const kpi = await kpiReq.query(`
    SELECT
      (SELECT COUNT(*) FROM users u WHERE u.status = 1 ${userWhereNV}) AS total_nv,
      (SELECT COUNT(*) FROM Attendance a ${userJoin} WHERE a.date = @date ${userWhere} ${statusCond}) AS da_cham,
      (SELECT COUNT(*) FROM Attendance a ${userJoin} WHERE a.date = @date AND a.late_minutes > 0 ${userWhere}) AS di_muon,
      (SELECT COUNT(*) FROM Attendance a ${userJoin} WHERE a.date = @date AND a.check_out IS NULL AND a.check_in IS NOT NULL ${userWhere}) AS chua_ra,
      (SELECT COUNT(*) FROM leave_requests lr ${bid ? "JOIN users u ON u.id = lr.user_id" : ""}
        WHERE lr.status = 'approved' AND @date BETWEEN lr.from_date AND lr.to_date ${userWhere}) AS nghi_phep
  `);

  // 7 ngày gần nhất
  const chartReq = addBase(pool.request());
  const chart = await chartReq.query(`
    SELECT
      CAST(a.date AS DATE) AS ngay,
      COUNT(*) AS da_cham,
      SUM(CASE WHEN a.check_out IS NOT NULL THEN 1 ELSE 0 END) AS da_checkout,
      SUM(CASE WHEN a.late_minutes > 0 THEN 1 ELSE 0 END) AS di_muon,
      SUM(CASE WHEN a.check_out IS NULL THEN 1 ELSE 0 END) AS chua_ra
    FROM Attendance a
    ${userJoin}
    WHERE a.date >= DATEADD(DAY,-6,@date) AND a.date <= @date ${userWhere} ${statusCond}
    GROUP BY CAST(a.date AS DATE)
    ORDER BY ngay ASC
  `);

  // Top 5 đi muộn nhiều nhất tháng
  const topReq = addBase(pool.request());
  const topWhere = `WHERE a.late_minutes > 0 AND MONTH(a.date)=MONTH(@date) AND YEAR(a.date)=YEAR(@date) ${userWhere}`;
  const topLate = await topReq.query(`
    SELECT TOP 5
      u.full_name, u.employee_code,
      COUNT(*) AS so_lan_muon,
      SUM(a.late_minutes) AS tong_phut_muon
    FROM Attendance a
    JOIN users u ON u.id = a.user_id
    ${topWhere}
    GROUP BY u.id, u.full_name, u.employee_code
    ORDER BY so_lan_muon DESC
  `);

  return {
    date: today,
    kpi: kpi.recordset[0],
    chart: chart.recordset,
    topLate: topLate.recordset,
  };
}

export async function getLatestRequests(limit = 5) {
  const pool = getPool();
  const res = await pool
    .request()
    .input("limit", sql.Int, limit)
    .query(`
      SELECT TOP (@limit)
        ac.id,
        u.full_name AS name,
        N'Giải trình' AS type,
        ac.created_at AS submitted_at,
        ac.status
      FROM attendance_corrections ac
      JOIN users u ON u.id = ac.requested_by
      UNION ALL
      SELECT TOP (@limit)
        lr.id,
        u.full_name AS name,
        N'Nghỉ phép' AS type,
        lr.created_at AS submitted_at,
        lr.status
      FROM leave_requests lr
      JOIN users u ON u.id = lr.user_id
      ORDER BY submitted_at DESC
    `);
  return res.recordset.slice(0, limit);
}

export async function getPendingCounts() {
  const pool = getPool();
  const res = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM leave_requests WHERE status = 'pending') AS pending_leaves,
      (SELECT COUNT(*) FROM attendance_corrections WHERE status = 'pending') AS pending_explanations
  `);
  const { pending_leaves, pending_explanations } = res.recordset[0];
  return {
    total: pending_leaves + pending_explanations,
    leaves: pending_leaves,
    explanations: pending_explanations,
  };
}
