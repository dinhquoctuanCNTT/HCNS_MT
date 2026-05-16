import { getPool, sql } from "../config/db.js";

// ─── Lấy profile ──────────────────────────────────────────────────────────────
export const getUserById = async (userId) => {
  const pool = getPool();
  const result = await pool.request().input("id", sql.BigInt, userId).query(`
    SELECT 
      id, email, full_name, role, avatar_url, department, phone,
      date_of_birth, gender, job_title, department_id, branch_id,
      employee_code, address, national_id, cccd_date, cccd_place,
      username, country, city, ward, alley, house_number, qr_code
    FROM users
    WHERE id = @id
  `);
  return result.recordset[0];
};

// ─── Cập nhật profile ─────────────────────────────────────────────────────────
export const updateUserProfile = async (userId, fields) => {
  const {
    full_name,
    department,
    phone,
    date_of_birth,
    gender,
    job_title,
    national_id,
    cccd_date,
    cccd_place,
    address,
    username,
    country,
    city,
    ward,
    alley,
    house_number,
  } = fields;

  const pool = getPool();
  await pool
    .request()
    .input("id", sql.BigInt, userId)
    .input("full_name", sql.NVarChar(150), full_name || null)
    .input("department", sql.NVarChar(255), department || null)
    .input("phone", sql.NVarChar(20), phone || null)
    .input("date_of_birth", sql.Date, date_of_birth || null)
    .input("gender", sql.NVarChar(20), gender || null)
    .input("job_title", sql.NVarChar(100), job_title || null)
    .input("national_id",   sql.NVarChar(20),  national_id   || null)
    .input("cccd_date",     sql.Date,          cccd_date     || null)
    .input("cccd_place",    sql.NVarChar(200), cccd_place    || null)
    .input("address",       sql.NVarChar(300), address       || null)
    .input("username",      sql.NVarChar(100), username      || null)
    .input("country", sql.NVarChar(100), country || null)
    .input("city", sql.NVarChar(100), city || null)
    .input("ward", sql.NVarChar(100), ward || null)
    .input("alley", sql.NVarChar(100), alley || null)
    .input("house_number", sql.NVarChar(50), house_number || null).query(`
      UPDATE users SET
        full_name     = COALESCE(@full_name,     full_name),
        department    = COALESCE(@department,    department),
        phone         = COALESCE(@phone,         phone),
        date_of_birth = COALESCE(@date_of_birth, date_of_birth),
        gender        = COALESCE(@gender,        gender),
        job_title     = COALESCE(@job_title,     job_title),
        national_id   = COALESCE(@national_id,   national_id),
        cccd_date     = COALESCE(@cccd_date,     cccd_date),
        cccd_place    = COALESCE(@cccd_place,    cccd_place),
        address       = COALESCE(@address,       address),
        username      = COALESCE(@username,      username),
        country       = COALESCE(@country,       country),
        city          = COALESCE(@city,          city),
        ward          = COALESCE(@ward,          ward),
        alley         = COALESCE(@alley,         alley),
        house_number  = COALESCE(@house_number,  house_number),
        updated_at    = SYSDATETIME()
      WHERE id = @id
    `);

  return getUserById(userId);
};

// ─── Cập nhật avatar ──────────────────────────────────────────────────────────
export const updateUserAvatar = async (userId, avatarUrl) => {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.BigInt, userId)
    .input("avatar_url", sql.NVarChar(500), avatarUrl)
    .query(
      `UPDATE users SET avatar_url = @avatar_url, updated_at = SYSDATETIME() WHERE id = @id`,
    );
  return { avatar_url: avatarUrl };
};

// ─── Đổi mật khẩu ─────────────────────────────────────────────────────────────
export const getUserPasswordHash = async (userId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.BigInt, userId)
    .query(`SELECT password_hash FROM users WHERE id = @id`);
  return result.recordset[0]?.password_hash;
};

export const updateUserPassword = async (userId, newHash) => {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.BigInt, userId)
    .input("password_hash", sql.NVarChar(255), newHash)
    .query(
      `UPDATE users SET password_hash = @password_hash, updated_at = SYSDATETIME() WHERE id = @id`,
    );
};

// ─── QR code ──────────────────────────────────────────────────────────────────
export const getUserQr = async (userId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.BigInt, userId)
    .query(`SELECT qr_code, employee_code FROM users WHERE id = @id`);
  const row = result.recordset[0];
  return row?.qr_code || row?.employee_code || `USER_${userId}`;
};

// ══════════════════════════════════════════════════════════════════════════════
// QUẢN LÝ NHÂN VIÊN
// ══════════════════════════════════════════════════════════════════════════════

// ─── Lấy danh sách nhân viên theo role của người gọi ─────────────────────────
export const getEmployeeList = async (
  caller,
  { search, departmentId, branchId, page = 1, limit = 20 },
) => {
  const pool = getPool();
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const req = pool
    .request()
    .input("limit", sql.Int, parseInt(limit))
    .input("offset", sql.Int, offset);

  // Điều kiện phân quyền
  let scopeWhere = "";
  if (caller.role === "department_head") {
    scopeWhere = "AND u.department_id = @callerDeptId";
    req.input("callerDeptId", sql.BigInt, caller.department_id);
  } else if (caller.role === "branch_manager") {
    scopeWhere = "AND u.branch_id = @callerBranchId";
    req.input("callerBranchId", sql.Int, caller.branch_id);
  }
  // admin, director → không giới hạn

  // Filter thêm
  let filterWhere = "";
  if (search) {
    filterWhere +=
      " AND (u.full_name LIKE @search OR u.employee_code LIKE @search OR u.phone LIKE @search OR u.email LIKE @search)";
    req.input("search", sql.NVarChar(100), `%${search}%`);
  }
  if (departmentId) {
    filterWhere += " AND u.department_id = @deptId";
    req.input("deptId", sql.BigInt, parseInt(departmentId));
  }
  if (branchId) {
    filterWhere += " AND u.branch_id = @branchId";
    req.input("branchId", sql.Int, parseInt(branchId));
  }

  const whereClause = `WHERE 1=1 ${scopeWhere} ${filterWhere}`;

  const result = await req.query(`
    SELECT
      u.id, u.full_name, u.email, u.phone, u.role,
      u.employee_code, u.job_title, u.avatar_url,
      u.gender, u.date_of_birth,
      u.department_id, u.branch_id,
      u.status,
      d.name AS department_name,
      ol.name AS branch_name,
      u.created_at
    FROM users u
    LEFT JOIN departments d ON d.id = u.department_id
    LEFT JOIN office_locations ol ON ol.id = u.branch_id
    ${whereClause}
    ORDER BY u.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `);

  // Count
  const countReq = pool.request();
  if (caller.role === "department_head")
    countReq.input("callerDeptId", sql.BigInt, caller.department_id);
  if (caller.role === "branch_manager")
    countReq.input("callerBranchId", sql.Int, caller.branch_id);
  if (search) countReq.input("search", sql.NVarChar(100), `%${search}%`);
  if (departmentId)
    countReq.input("deptId", sql.BigInt, parseInt(departmentId));
  if (branchId) countReq.input("branchId", sql.Int, parseInt(branchId));

  const countResult = await countReq.query(`
    SELECT COUNT(*) AS total
    FROM users u
    ${whereClause}
  `);

  return { employees: result.recordset, total: countResult.recordset[0].total };
};

// ─── Lấy chi tiết 1 nhân viên ─────────────────────────────────────────────────
export const getEmployeeDetail = async (employeeId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.BigInt, parseInt(employeeId)).query(`
      SELECT 
        u.*,
        d.name AS department_name,
        ol.name AS branch_name
      FROM users u
      LEFT JOIN departments d ON d.id = u.department_id
      LEFT JOIN office_locations ol ON ol.id = u.branch_id
      WHERE u.id = @id
    `);
  return result.recordset[0];
};

// ─── Tạo nhân viên mới ────────────────────────────────────────────────────────
export const createEmployee = async (fields) => {
  const {
    full_name, email, phone, password_hash, job_title, department_id, branch_id,
    employee_code, gender, date_of_birth, role = "employee",
    national_id, cccd_date, cccd_place, address, city, country, ward, alley, house_number,
  } = fields;

  const pool = getPool();
  const result = await pool
    .request()
    .input("full_name",     sql.NVarChar(150), full_name)
    .input("email",         sql.NVarChar(150), email)
    .input("phone",         sql.NVarChar(20),  phone         || null)
    .input("password_hash", sql.NVarChar(255), password_hash)
    .input("job_title",     sql.NVarChar(100), job_title     || null)
    .input("department_id", sql.BigInt,        department_id || null)
    .input("branch_id",     sql.Int,           branch_id     || null)
    .input("employee_code", sql.NVarChar(30),  employee_code || null)
    .input("gender",        sql.NVarChar(20),  gender        || null)
    .input("date_of_birth", sql.Date,          date_of_birth || null)
    .input("role",          sql.NVarChar(50),  role)
    .input("national_id",   sql.NVarChar(20),  national_id   || null)
    .input("cccd_date",     sql.Date,          cccd_date     || null)
    .input("cccd_place",    sql.NVarChar(200), cccd_place    || null)
    .input("address",       sql.NVarChar(300), address       || null)
    .input("city",          sql.NVarChar(100), city          || null)
    .input("country",       sql.NVarChar(100), country       || null)
    .input("ward",          sql.NVarChar(100), ward          || null)
    .input("alley",         sql.NVarChar(100), alley         || null)
    .input("house_number",  sql.NVarChar(50),  house_number  || null)
    .query(`
      INSERT INTO users (
        full_name, email, phone, password_hash,
        job_title, department_id, branch_id, employee_code,
        gender, date_of_birth, role, status, is_verified,
        national_id, cccd_date, cccd_place, address, city, country, ward, alley, house_number,
        created_at, updated_at
      )
      OUTPUT INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.role, INSERTED.employee_code
      VALUES (
        @full_name, @email, @phone, @password_hash,
        @job_title, @department_id, @branch_id, @employee_code,
        @gender, @date_of_birth, @role, 1, 1,
        @national_id, @cccd_date, @cccd_place, @address, @city, @country, @ward, @alley, @house_number,
        SYSDATETIME(), SYSDATETIME()
      )
    `);
  return result.recordset[0];
};

// ─── Cập nhật thông tin nhân viên ─────────────────────────────────────────────
export const updateEmployee = async (employeeId, fields) => {
  const {
    full_name, phone, job_title, department_id, branch_id,
    gender, date_of_birth, employee_code, role,
    national_id, cccd_date, cccd_place, address, city, country, ward, alley, house_number,
  } = fields;

  const pool = getPool();
  await pool
    .request()
    .input("id",            sql.BigInt,        parseInt(employeeId))
    .input("full_name",     sql.NVarChar(150), full_name     || null)
    .input("phone",         sql.NVarChar(20),  phone         || null)
    .input("job_title",     sql.NVarChar(100), job_title     || null)
    .input("department_id", sql.BigInt,        department_id || null)
    .input("branch_id",     sql.Int,           branch_id     || null)
    .input("gender",        sql.NVarChar(20),  gender        || null)
    .input("date_of_birth", sql.Date,          date_of_birth || null)
    .input("employee_code", sql.NVarChar(30),  employee_code || null)
    .input("role",          sql.NVarChar(50),  role          || null)
    .input("national_id",   sql.NVarChar(20),  national_id   || null)
    .input("cccd_date",     sql.Date,          cccd_date     || null)
    .input("cccd_place",    sql.NVarChar(200), cccd_place    || null)
    .input("address",       sql.NVarChar(300), address       || null)
    .input("city",          sql.NVarChar(100), city          || null)
    .input("country",       sql.NVarChar(100), country       || null)
    .input("ward",          sql.NVarChar(100), ward          || null)
    .input("alley",         sql.NVarChar(100), alley         || null)
    .input("house_number",  sql.NVarChar(50),  house_number  || null)
    .query(`
      UPDATE users SET
        full_name     = COALESCE(@full_name,     full_name),
        phone         = COALESCE(@phone,         phone),
        job_title     = COALESCE(@job_title,     job_title),
        department_id = COALESCE(@department_id, department_id),
        branch_id     = COALESCE(@branch_id,     branch_id),
        gender        = COALESCE(@gender,        gender),
        date_of_birth = COALESCE(@date_of_birth, date_of_birth),
        employee_code = COALESCE(@employee_code, employee_code),
        role          = COALESCE(@role,          role),
        national_id   = @national_id,
        cccd_date     = @cccd_date,
        cccd_place    = @cccd_place,
        address       = @address,
        city          = @city,
        country       = @country,
        ward          = @ward,
        alley         = @alley,
        house_number  = @house_number,
        updated_at    = SYSDATETIME()
      WHERE id = @id
    `);

  return getEmployeeDetail(employeeId);
};

// ─── Cập nhật avatar nhân viên (admin) ───────────────────────────────────────
export const updateEmployeeAvatar = async (employeeId, avatarUrl) => {
  const pool = getPool();
  await pool
    .request()
    .input("id",         sql.BigInt,       parseInt(employeeId))
    .input("avatar_url", sql.NVarChar(500), avatarUrl)
    .query(`UPDATE users SET avatar_url = @avatar_url, updated_at = SYSDATETIME() WHERE id = @id`);
  return avatarUrl;
};

// ─── Xóa khuôn mặt nhân viên ─────────────────────────────────────────────────
export const clearEmployeeFace = async (employeeId) => {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.BigInt, parseInt(employeeId))
    .query(`UPDATE users SET face_descriptor = NULL, updated_at = SYSDATETIME() WHERE id = @id`);
};

// ─── Khoá / Mở tài khoản ─────────────────────────────────────────────────────
export const toggleEmployeeStatus = async (employeeId, isActive) => {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.BigInt, parseInt(employeeId))
    .input("status", sql.Bit, isActive ? 1 : 0)
    .query(
      `UPDATE users SET status = @status, updated_at = SYSDATETIME() WHERE id = @id`,
    );
  return getEmployeeDetail(employeeId);
};

// ─── Xoá nhân viên ────────────────────────────────────────────────────────────
export const deleteEmployee = async (employeeId) => {
  const pool = getPool();
  await pool
    .request()
    .input("id", sql.BigInt, parseInt(employeeId))
    .query(`DELETE FROM users WHERE id = @id AND role = 'employee'`);
};
