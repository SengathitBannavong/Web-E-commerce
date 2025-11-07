import express from "express";
import {
  create_cart,
  delete_cart,
  get_all_cart_items,
  get_all_carts,
  get_all_details_cart_by_user_id,
  get_cart_by_id,
  get_cart_by_user_id,
  update_cart
} from "../controllers/cart_controller.js";

const cart_router = express.Router();
// Cart API routes
cart_router.get("/view-all-carts", get_all_carts);
cart_router.get("/view-cart/:id", get_cart_by_id);                                        // url sent pass parameter
cart_router.get("/view-cart", get_cart_by_id);                                            // url sent pass query  
cart_router.get("/view-cart-by-user/:userId", get_cart_by_user_id);                       // url sent pass parameter
cart_router.get("/view-cart-by-user", get_cart_by_user_id);                               // url sent pass query
cart_router.get("/view-detailed-cart-by-user/:userId", get_all_details_cart_by_user_id);  // url sent pass parameter
cart_router.get("/view-detailed-cart-by-user", get_all_details_cart_by_user_id);          // url sent pass query
cart_router.post("/create-cart", create_cart);
cart_router.delete("/delete-cart/:id/:auth", delete_cart);                                // url sent pass parameter
cart_router.delete("/delete-cart", delete_cart);                                          // url sent pass query
cart_router.put("/update-cart/:id", update_cart);                                         // url sent pass parameter
cart_router.put("/update-cart", update_cart);                                             // url sent pass query

// Cart Items routes
cart_router.get("/view-all-cart-items", get_all_cart_items);

export { cart_router };
