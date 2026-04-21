import {
  findNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead,
  countUnreadNotifications,
} from "../repositories/notification.repository.js";

// GET /api/notifications
export async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const limit = Number(req.query.limit) || 20;
    const data = await findNotificationsByUser(userId, limit);
    const unread = await countUnreadNotifications(userId);
    res.json({ success: true, data, unread });
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// PATCH /api/notifications/:id/read
export async function readNotification(req, res) {
  try {
    await markNotificationRead(Number(req.params.id), req.user.id);
    res.json({ success: true });
  } catch (err) {
    console.error("readNotification error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// PATCH /api/notifications/read-all
export async function readAllNotifications(req, res) {
  try {
    await markAllNotificationsRead(req.user.id);
    res.json({ success: true });
  } catch (err) {
    console.error("readAllNotifications error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}
