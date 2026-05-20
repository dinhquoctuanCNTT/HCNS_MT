import * as holidaysService from "./holidays.service.js";

export async function getHolidays(req, res) {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const data = await holidaysService.getHolidays(year);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createHoliday(req, res) {
  try {
    const { name, holiday_date, year } = req.body;
    if (!name || !holiday_date) {
      return res.status(400).json({ message: "Thiếu tên hoặc ngày" });
    }
    const y = year || new Date(holiday_date).getFullYear();
    const id = await holidaysService.createHoliday({ name, holiday_date, year: y });
    res.status(201).json({ message: "Đã thêm ngày lễ", id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteHoliday(req, res) {
  try {
    await holidaysService.deleteHoliday(req.params.id);
    res.json({ message: "Đã xóa ngày lễ" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
