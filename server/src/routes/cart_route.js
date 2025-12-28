import express from "express";
import {
  // Cart Item functions
  create_cart_item,
  delete_all_cart_items,
  delete_cart_item,
  get_all_details_cart_by_user_id,
  // Middleware
  getActiveCart,
  update_cart_item
} from "../controllers/cart_controller.js";
import { getCartSummary, validateCartStock } from "../controllers/checkout_controller.js";
import { authMiddleware } from "../middleware/auth.js";

const cart_router = express.Router();

// All cart routes require authentication
cart_router.use(authMiddleware);
cart_router.use(getActiveCart);

// ==================== CHECKOUT ROUTES ====================
cart_router.post("/validate-stock", validateCartStock);
cart_router.get("/summary", getCartSummary);

// ==================== CART ROUTES ====================
// cart_router.get("/", get_cart);
// cart_router.post("/", create_cart); This should created automatically registered user
// cart_router.put("/", update_cart); Not needed for now
// cart_router.delete("/clear", delete_all_cart); Not needed for now
cart_router.delete("/clear", delete_all_cart_items);

// ==================== CART ITEM ROUTES ====================
cart_router.get("/items", get_all_details_cart_by_user_id);
cart_router.post("/items/:productId", create_cart_item); 
cart_router.put("/items/:productId", update_cart_item);
cart_router.delete("/items/:productId", delete_cart_item);
export { cart_router };
