import express from "express";
import { deleteImage_Product, uploadImage_Product } from "../controllers/cloudinary_controller.js";
import {
    create_product,
    delete_product,
    get_bestsellers,
    get_new_releases,
    get_products,
    update_product,
    get_last_category_products
} from "../controllers/product_controller.js";
import { adminMiddleware } from "../middleware/admin.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/photo_upload.js";

const product_router = express.Router();

// Public routes - anyone can view products
product_router.get("/", get_products);
product_router.get("/bestsellers", get_bestsellers);
product_router.get("/new-releases", get_new_releases);
product_router.get("/last-category", get_last_category_products);
product_router.get("/:id", get_products);

// Admin only routes - create, update, delete products
product_router.post("/", authMiddleware, adminMiddleware, create_product);
product_router.put("/:id", authMiddleware, adminMiddleware, update_product);
product_router.delete("/:id", authMiddleware, adminMiddleware, delete_product);

product_router.post("/upload-image", authMiddleware, adminMiddleware, upload.single("image"), uploadImage_Product);
product_router.post("/delete-image", authMiddleware, adminMiddleware, deleteImage_Product);

export { product_router };
