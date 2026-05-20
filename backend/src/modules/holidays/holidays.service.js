import { getPool } from "../../config/db.js";

export async function getHolidays(year) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("year", year)
    .query(`SELECT * FROM holidays WHERE year = @year ORDER BY holiday_date`);
  return result.recordset;
}

export async function createHoliday({ name, holiday_date, year }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("name", name)
    .input("holiday_date", holiday_date)
    .input("year", year)
    .query(`
      INSERT INTO holidays (name, holiday_date, year, created_at)
      OUTPUT INSERTED.id
      VALUES (@name, @holiday_date, @year, GETDATE())
    `);
  return result.recordset[0].id;
}

export async function deleteHoliday(id) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .query(`DELETE FROM holidays WHERE id = @id`);
  if (result.rowsAffected[0] === 0) throw new Error("Không tìm thấy ngày lễ");
}

export async function getHolidayDates(year) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("year", year)
    .query(`SELECT holiday_date FROM holidays WHERE year = @year`);
  return result.recordset.map((r) => r.holiday_date.toISOString().split("T")[0]);
}
