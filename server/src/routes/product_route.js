import express from "express";
import {
  create_product,
  delete_product,
  get_products,
  update_product
} from "../controllers/product_controller.js";

const product_router = express.Router();
// get all products and handle get product by id or index
product_router.get("/", get_products);
product_router.get("/:id", get_products);
product_router.get("/:index", get_products);
// update product
product_router.put("/:id", update_product);
product_router.put("/", update_product);
// create product
product_router.post("/", create_product);
// delete product
// TODO: add authentication and authorization middleware
product_router.delete("/:id/:auth", delete_product);
product_router.delete("/", delete_product);

export { product_router };
