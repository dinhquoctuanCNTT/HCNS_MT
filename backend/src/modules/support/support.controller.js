import {
  createSupportTicket,
  getTicketsByUserId,
  getAllSupportTickets,
  updateTicket,
} from "./support.service.js";

// ─── POST /api/support/tickets ────────────────────────────────────────────────
export const createTicket = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập tiêu đề và nội dung" });
    }
    const ticket = await createSupportTicket(req.user.id, { title, content });
    return res
      .status(201)
      .json({ success: true, message: "Gửi yêu cầu thành công", ticket });
  } catch (error) {
    console.error("createTicket error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── GET /api/support/my-tickets ─────────────────────────────────────────────
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await getTicketsByUserId(req.user.id);
    return res.json({ success: true, tickets });
  } catch (error) {
    console.error("getMyTickets error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── GET /api/support/admin/tickets ──────────────────────────────────────────
export const getAllTickets = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const { tickets, total } = await getAllSupportTickets({
      status,
      page,
      limit,
    });
    return res.json({
      success: true,
      tickets,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("getAllTickets error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ─── PATCH /api/support/admin/tickets/:id ────────────────────────────────────
export const updateTicketStatus = async (req, res) => {
  try {
    const { status, admin_reply } = req.body;
    const validStatuses = ["open", "pending", "resolved", "closed"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    const ticket = await updateTicket(req.params.id, { status, admin_reply });
    return res.json({ success: true, message: "Cập nhật thành công", ticket });
  } catch (error) {
    console.error("updateTicketStatus error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
