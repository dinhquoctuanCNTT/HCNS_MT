import { Router } from "express";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
} from "./support.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// User
router.post("/tickets", createTicket);
router.get("/my-tickets", getMyTickets);

// Admin
router.get("/admin/tickets", getAllTickets);
router.patch("/admin/tickets/:id", updateTicketStatus);

export default router;
