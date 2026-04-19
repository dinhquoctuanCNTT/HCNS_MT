import * as attendanceService from "../services/attendance.service.js";

export async function registerFace(req, res) {
  try {
    const { image } = req.body; // base64
    if (!image) return res.status(400).json({ message: "Thiếu ảnh" });
    const result = await attendanceService.registerFace(req.user.id, image);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function checkIn(req, res) {
  try {
    const { image } = req.body; // base64
    if (!image) return res.status(400).json({ message: "Thiếu ảnh" });
    const result = await attendanceService.checkIn(req.user.id, image);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getHistory(req, res) {
  try {
    const { from, to } = req.query;
    const fromDate = from || new Date().toISOString().slice(0, 7) + "-01";
    const toDate = to || new Date().toISOString().slice(0, 10);
    const data = await attendanceService.getAttendanceHistory(
      req.user.id,
      fromDate,
      toDate,
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
