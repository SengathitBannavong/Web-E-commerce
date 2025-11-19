import express from "express";
import {
  create_order,
  delete_order_by_id,
  get_all_order_items,
  get_orders,
} from "../controllers/order_controller.js";

const order_router = express.Router();
// Order routes
order_router.get("/", get_orders);
order_router.get("/:id", get_orders);
order_router.get("/:userId", get_orders);
order_router.get("/:type", get_orders);

order_router.post("/", create_order);

order_router.delete("/", delete_order_by_id);
order_router.delete("/:id", delete_order_by_id);


export { order_router };

