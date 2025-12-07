import express from "express";
import { create_payment, delete_payment, get_all_payments, get_payments_by_order_id, update_payment } from "../controllers/payment_controller.js";
import { adminMiddleware } from "../middleware/admin.js";
import { authMiddleware } from "../middleware/auth.js";

const payment_router = express.Router();

// All payment routes require authentication
payment_router.use(authMiddleware);

// ==================== USER ROUTES ====================
// Users can view their own order payments and create payments
payment_router.get("/order/:orderId", get_payments_by_order_id);
payment_router.post("/", create_payment);

// ==================== ADMIN ROUTES ====================
// Admin can view all payments, update, and delete
payment_router.get("/", adminMiddleware, get_all_payments);
payment_router.put("/:id", adminMiddleware, update_payment);
payment_router.delete("/:id", adminMiddleware, delete_payment);

export { payment_router };
