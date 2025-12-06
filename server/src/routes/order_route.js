import express from "express";
import {
  // Order functions
  create_order,
  // Order Item functions
  create_order_item,
  delete_all_orders_by_user,
  delete_order,
  delete_order_item,
  get_all_details_order_by_user_id,
  get_order,
  get_order_items_by_order_id,
  update_order,
  update_order_item
} from "../controllers/order_controller.js";

const order_router = express.Router();

// ==================== ORDER ITEM ROUTES ====================
order_router.get("/items/:orderId", get_order_items_by_order_id);
order_router.post("/items/:orderId", create_order_item);
order_router.put("/items/:id", update_order_item);
order_router.delete("/items/:id", delete_order_item);

// ==================== ORDER ROUTES ====================
order_router.get("/:userId", get_order);
order_router.get("/details/:userId", get_all_details_order_by_user_id);
order_router.post("/:userId", create_order);
order_router.put("/:id", update_order);
order_router.delete("/:id", delete_order);
order_router.delete("/user/:userId", delete_all_orders_by_user);

export { order_router };

