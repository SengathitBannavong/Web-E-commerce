import express from "express";
import {
    // Cart functions
    create_cart,
    // Cart Item functions
    create_cart_item,
    delete_all_cart,
    delete_cart,
    delete_cart_item,
    get_all_details_cart_by_user_id,
    get_cart,
    get_cart_items_by_cart_id,
    update_cart,
    update_cart_item
} from "../controllers/cart_controller.js";
import { authMiddleware, verifyUserOwnership } from "../middleware/auth.js";

const cart_router = express.Router();

// All cart routes require authentication
cart_router.use(authMiddleware);

// ==================== CART ROUTES ====================
cart_router.get("/:userId", verifyUserOwnership('userId'), get_cart);
cart_router.post("/", create_cart);
cart_router.put("/:userId", verifyUserOwnership('userId'), update_cart);
cart_router.delete("/:id", delete_cart);
cart_router.delete("/clear/:userId", verifyUserOwnership('userId'), delete_all_cart);

// ==================== CART ITEM ROUTES ====================
cart_router.get("/items/:userId", verifyUserOwnership('userId'), get_all_details_cart_by_user_id);
cart_router.get("/items/cart/:cartId", get_cart_items_by_cart_id);
cart_router.post("/items/:cartId", create_cart_item); 
cart_router.put("/items/:id", update_cart_item);
cart_router.delete("/items/:id", delete_cart_item);

export { cart_router };
