import express from "express";
import {
  create_cart,
  delete_cart,
  get_carts,
  update_cart
} from "../controllers/cart_controller.js";

const cart_router = express.Router();
// Cart API routes
cart_router.get("/", get_carts);
cart_router.get("/:id", get_carts);
cart_router.get("/:userId", get_carts);
cart_router.get("/:type/:userId", get_carts);

cart_router.post("/", create_cart);

cart_router.delete("/", delete_cart);
cart_router.delete("/:id/:auth", delete_cart);

cart_router.put("/", update_cart);
cart_router.put("/:id", update_cart);


export { cart_router };
