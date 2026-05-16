import { getPool, sql } from "../../config/db.js";

export async function getAllShifts() {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT id, name, start_time, end_time, days_of_week, grace_minutes, is_active
    FROM Shifts
    ORDER BY name
  `);
  return result.recordset;
}

export async function getShiftById(id) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`SELECT id, name, start_time, end_time, days_of_week, grace_minutes, is_active FROM Shifts WHERE id = @id`);
  return result.recordset[0] || null;
}

export async function createShift({ name, start_time, end_time, days_of_week, grace_minutes }) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("name", sql.NVarChar, name)
    .input("start_time", sql.VarChar, start_time)
    .input("end_time", sql.VarChar, end_time)
    .input("days_of_week", sql.VarChar, days_of_week)
    .input("grace_minutes", sql.Int, grace_minutes ?? 0)
    .query(`
      INSERT INTO Shifts (name, start_time, end_time, days_of_week, grace_minutes, is_active)
      OUTPUT INSERTED.*
      VALUES (@name, @start_time, @end_time, @days_of_week, @grace_minutes, 1)
    `);
  return result.recordset[0];
}

export async function updateShift(id, { name, start_time, end_time, days_of_week, grace_minutes, is_active }) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("name", sql.NVarChar, name)
    .input("start_time", sql.VarChar, start_time)
    .input("end_time", sql.VarChar, end_time)
    .input("days_of_week", sql.VarChar, days_of_week)
    .input("grace_minutes", sql.Int, grace_minutes ?? 0)
    .input("is_active", sql.Bit, is_active ?? 1)
    .query(`
      UPDATE Shifts
      SET name = @name, start_time = @start_time, end_time = @end_time,
          days_of_week = @days_of_week, grace_minutes = @grace_minutes, is_active = @is_active
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset[0] || null;
}

export async function deleteShift(id) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM Shifts OUTPUT DELETED.id WHERE id = @id`);
  return result.recordset[0] || null;
}
