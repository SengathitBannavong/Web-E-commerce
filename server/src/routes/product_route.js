import express from "express";
import {
    create_product,
    delete_product,
    get_products,
    update_product
} from "../controllers/product_controller.js";

const product_router = express.Router();

product_router.get("/", get_products);
product_router.get("/:id", get_products);
product_router.post("/", create_product);
product_router.put("/:id", update_product);
product_router.delete("/:id", delete_product);

export { product_router };
