import multer from "multer";
import path from "path";
import fs from "fs";
import {
  addAttachment,
  findAttachmentsByTaskId,
  deleteAttachment,
} from "../repositories/task.repository.js";

// Tạo thư mục uploads nếu chưa có
const uploadDir = "uploads/attachments";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// GET /api/workflow/tasks/:taskId/attachments
export async function getAttachments(req, res) {
  try {
    const { taskId } = req.params;
    const data = await findAttachmentsByTaskId(Number(taskId));
    res.json({ data });
  } catch (err) {
    console.error("getAttachments error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// POST /api/workflow/tasks/:taskId/attachments
export async function uploadAttachment(req, res) {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const file = req.file;
    const attachmentType = req.body.attachment_type || "report";

    if (!file) {
      return res.status(400).json({ message: "Không có file" });
    }

    const fileUrl = `/uploads/attachments/${file.filename}`;

    const result = await addAttachment(Number(taskId), {
      fileName: file.originalname,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: userId,
      attachmentType,
    });

    res.status(201).json({ data: result });
  } catch (err) {
    console.error("uploadAttachment error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// DELETE /api/workflow/tasks/:taskId/attachments/:attachmentId
export async function removeAttachment(req, res) {
  try {
    const { attachmentId } = req.params;
    await deleteAttachment(Number(attachmentId));
    res.json({ message: "Đã xoá file" });
  } catch (err) {
    console.error("removeAttachment error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// ── Face ──────────────────────────────────────────────────
export async function registerFace(req, res) {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "Thiếu ảnh" });
    const result = await attendanceService.registerFace(req.user.id, image);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ── Check-in ──────────────────────────────────────────────
export async function checkIn(req, res) {
  try {
    const { image, latitude, longitude } = req.body;
    if (!image) return res.status(400).json({ message: "Thiếu ảnh" });
    const result = await attendanceService.checkIn(req.user.id, image, {
      latitude,
      longitude,
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ── Check-out ─────────────────────────────────────────────
export async function checkOut(req, res) {
  try {
    const { image, latitude, longitude } = req.body;
    if (!image) return res.status(400).json({ message: "Thiếu ảnh" });
    const result = await attendanceService.checkOut(req.user.id, image, {
      latitude,
      longitude,
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ── Lịch sử ───────────────────────────────────────────────
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

// ── Office Locations (GPS Fence) ──────────────────────────
export async function getLocations(req, res) {
  try {
    const data = await attendanceService.getOfficeLocations();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createLocation(req, res) {
  try {
    const { name, latitude, longitude, radius } = req.body;
    if (!name || !latitude || !longitude) {
      return res.status(400).json({ message: "Thiếu thông tin vị trí" });
    }
    const result = await attendanceService.createOfficeLocation({
      name,
      latitude,
      longitude,
      radius,
    });
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateLocation(req, res) {
  try {
    const { id } = req.params;
    const result = await attendanceService.updateOfficeLocation(
      Number(id),
      req.body,
    );
    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteLocation(req, res) {
  try {
    const { id } = req.params;
    await attendanceService.deleteOfficeLocation(Number(id));
    res.json({ message: "Đã xóa vị trí" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ── Leave Requests (Đơn xin nghỉ) ────────────────────────
export async function getLeaveRequests(req, res) {
  try {
    const { status } = req.query;
    const data = await attendanceService.getLeaveRequests(req.user.id, status);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getAllLeaveRequests(req, res) {
  try {
    const { status } = req.query;
    const data = await attendanceService.getAllLeaveRequests(status);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createLeaveRequest(req, res) {
  try {
    const { leave_type, from_date, to_date, total_days, reason } = req.body;
    if (!leave_type || !from_date || !to_date) {
      return res.status(400).json({ message: "Thiếu thông tin đơn nghỉ" });
    }
    const result = await attendanceService.createLeaveRequest(req.user.id, {
      leave_type,
      from_date,
      to_date,
      total_days,
      reason,
    });
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function approveLeaveRequest(req, res) {
  try {
    const { id } = req.params;
    await attendanceService.approveLeaveRequest(Number(id), req.user.id);
    res.json({ message: "Đã duyệt đơn nghỉ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function rejectLeaveRequest(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await attendanceService.rejectLeaveRequest(Number(id), req.user.id, reason);
    res.json({ message: "Đã từ chối đơn nghỉ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ── Dashboard (Admin) ─────────────────────────────────────
export async function getDashboard(req, res) {
  try {
    const data = await attendanceService.getAttendanceDashboard();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
