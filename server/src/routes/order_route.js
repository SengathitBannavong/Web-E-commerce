import express from "express";
import {
  // Order Item functions (admin)
  create_order_item,
  // User order item functions
  create_order_item_by_user,
  delete_order,
  delete_order_by_user,
  delete_order_item,
  delete_order_item_by_user,
  get_all_details_order_by_user_id,
  get_order_admin,
  get_order_detail,
  get_order_items_by_order_id,
  update_order,
  // User order functions
  update_order_by_user,
  update_order_item,
  update_order_item_by_user
} from "../controllers/order_controller.js";
import { adminMiddleware } from "../middleware/admin.js";
import { authMiddleware } from "../middleware/auth.js";

const order_router = express.Router();

// All order routes require authentication
order_router.use(authMiddleware);

// ==================== ADMIN ROUTES ====================
order_router.get("/admin", adminMiddleware, get_order_admin);
order_router.get("/admin/:userId", adminMiddleware, get_order_admin);
order_router.put("/admin/:id", adminMiddleware, update_order);
order_router.delete("/admin/:id", adminMiddleware, delete_order);

order_router.get("/admin/items/:orderId", adminMiddleware, get_order_items_by_order_id);
order_router.post("/admin/items/:orderId", adminMiddleware, create_order_item);
order_router.put("/admin/items/:id", adminMiddleware, update_order_item);
order_router.delete("/admin/items/:id", adminMiddleware, delete_order_item);

// ==================== USER ORDER ROUTES ====================
// Users can only access their own orders
order_router.get("/all", get_all_details_order_by_user_id);
order_router.get("/:orderId", get_order_detail);
order_router.put("/cancel/:orderId", update_order_by_user);
order_router.delete("/delete/:orderId", delete_order_by_user); 

// ==================== USER ORDER ITEM ROUTES ====================
order_router.post("/items/:orderId", create_order_item_by_user); 
order_router.put("/items/:orderItemId", update_order_item_by_user); 
order_router.delete("/items/:orderItemId", delete_order_item_by_user); 



export { order_router };

