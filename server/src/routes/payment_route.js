import express from "express";
import { create_payment, delete_payment, get_payments, update_payment } from "../controllers/payment_controller.js";

const payment_router = express.Router();


payment_router.get("/", get_payments);
payment_router.get("/:id", get_payments);

payment_router.post("/", create_payment);

payment_router.put("/", update_payment);
payment_router.put("/:id", update_payment);
payment_router.patch("/", update_payment);
payment_router.patch("/:id", update_payment);

payment_router.delete("/", delete_payment);
payment_router.delete("/:id/:auth", delete_payment);

export { payment_router };
