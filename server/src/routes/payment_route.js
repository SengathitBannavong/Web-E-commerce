import express from "express";
import { create_payment, delete_payment, get_all_payments, get_payments_by_order_id, update_payment } from "../controllers/payment_controller.js";

const payment_router = express.Router();

payment_router.get("/", get_all_payments);
payment_router.get("/order/:orderId", get_payments_by_order_id);
payment_router.post("/", create_payment);
payment_router.put("/:id", update_payment);
payment_router.delete("/:id", delete_payment);

export { payment_router };
