import express from "express";
import {
  create_product,
  delete_product,
  get_all_products,
  get_product_by_id,
  get_product_by_index,
  update_product
} from "../controllers/product_controller.js";

const product_router = express.Router();

product_router.get("/view-all-products", get_all_products);
product_router.get("/view-product/:id", get_product_by_id);                  // url sent pass parameter
product_router.get("/view-product", get_product_by_id);                      // url sent pass query
product_router.get("/view-product-by-index/:index", get_product_by_index);    // url sent pass parameter
product_router.get("/view-product-by-index", get_product_by_index);           // url sent pass query
product_router.put("/update-product/:id", update_product);                 // url sent pass parameter
product_router.put("/update-product", update_product);                     // url sent pass query
product_router.post("/create-product", create_product);
product_router.delete("/delete-product/:id/:auth", delete_product);                // url sent pass parameter
product_router.delete("/delete-product", delete_product);                    // url sent pass query

export { product_router };
