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
    // attachment_type: 'assignment' (giao việc) hoặc 'report' (báo cáo) - mặc định 'report'
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
