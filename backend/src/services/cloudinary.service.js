// src/services/cloudinary.service.js
// Xử lý upload ảnh Base64 lên Cloudinary

import { v2 as cloudinary } from "cloudinary";

// Cloudinary tự đọc từ env CLOUDINARY_URL nếu đúng format:
// cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// Nếu bạn dùng riêng lẻ thì config tay:
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload ảnh Base64 lên Cloudinary
 * @param {string} base64Image  - chuỗi base64 (có hoặc không có data:image/... prefix)
 * @param {string} folder       - thư mục trên Cloudinary, vd: "attendance/checkin"
 * @param {string} publicId     - tên file, vd: "user_5_2025-01-15_checkin"
 * @returns {Promise<string>}   - URL ảnh đã upload
 */
export async function uploadAttendanceImage(base64Image, folder, publicId) {
  // Đảm bảo có prefix data URI
  const dataUri = base64Image.startsWith("data:")
    ? base64Image
    : `data:image/jpeg;base64,${base64Image}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    format: "jpg",
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto:good" },
    ],
  });

  return result.secure_url; // https://res.cloudinary.com/...
}

/**
 * Xoá ảnh trên Cloudinary (dùng khi cần cleanup)
 * @param {string} publicId - vd: "attendance/checkin/user_5_2025-01-15_checkin"
 */
export async function deleteAttendanceImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("[Cloudinary] Delete failed:", err.message);
  }
}
