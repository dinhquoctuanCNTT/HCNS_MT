import { getSettingsByUserId, upsertSettings } from "./settings.service.js";

// ─── GET /api/settings ────────────────────────────────────────────────────────
export const getSettings = async (req, res) => {
  try {
    const settings = await getSettingsByUserId(req.user.id);
    return res.json({ success: true, settings });
  } catch (error) {
    console.error("getSettings error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── PUT /api/settings ────────────────────────────────────────────────────────
export const updateSettings = async (req, res) => {
  try {
    const settings = await upsertSettings(req.user.id, req.body);
    return res.json({
      success: true,
      message: "Cập nhật cài đặt thành công",
      settings,
    });
  } catch (error) {
    console.error("updateSettings error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
