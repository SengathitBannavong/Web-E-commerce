import express from "express";
import {
  delete_stock,
  get_all_stocks,
  get_stock_by_product_id,
  update_stock_quantity,
  upsert_stock
} from "../controllers/stock_controller.js";
import { adminMiddleware } from "../middleware/admin.js";
import { authMiddleware } from "../middleware/auth.js";

const stock_router = express.Router();

// Public routes - anyone can view stock
stock_router.get("/", get_all_stocks);
stock_router.get("/:productId", get_stock_by_product_id);

// Admin only routes - manage stock
stock_router.post("/", authMiddleware, adminMiddleware, upsert_stock);
stock_router.put("/:productId", authMiddleware, adminMiddleware, update_stock_quantity);
stock_router.delete("/:productId", authMiddleware, adminMiddleware, delete_stock);

export { stock_router };
