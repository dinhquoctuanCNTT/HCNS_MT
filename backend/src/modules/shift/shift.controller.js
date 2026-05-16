import * as shiftService from "./shift.service.js";
import { validateShift } from "./shift.validator.js";

export async function listShifts(req, res) {
  try {
    const data = await shiftService.getAllShifts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getShift(req, res) {
  try {
    const shift = await shiftService.getShiftById(parseInt(req.params.id));
    if (!shift) return res.status(404).json({ message: "Không tìm thấy ca làm việc" });
    res.json(shift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createShift(req, res) {
  const errors = validateShift(req.body);
  if (errors.length) return res.status(400).json({ errors });
  try {
    const shift = await shiftService.createShift(req.body);
    res.status(201).json(shift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateShift(req, res) {
  const errors = validateShift(req.body);
  if (errors.length) return res.status(400).json({ errors });
  try {
    const shift = await shiftService.updateShift(parseInt(req.params.id), req.body);
    if (!shift) return res.status(404).json({ message: "Không tìm thấy ca làm việc" });
    res.json(shift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteShift(req, res) {
  try {
    const deleted = await shiftService.deleteShift(parseInt(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy ca làm việc" });
    res.json({ message: "Xóa ca làm việc thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
