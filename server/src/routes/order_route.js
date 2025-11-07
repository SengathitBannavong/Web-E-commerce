import express from "express";
import {
    create_order,
    delete_order_by_id,
    get_all_orders,
    get_order_by_id,
    get_order_by_user_id,
    get_all_order_items
} from "../controllers/order_controller.js";

const order_router = express.Router();
// Order routes
order_router.get("/view-all-orders", get_all_orders);
order_router.post("/create-order", create_order);
order_router.delete("/delete-order/:id", delete_order_by_id);               // url sent pass parameter
order_router.delete("/delete-order", delete_order_by_id);                   // url sent pass query
order_router.get("/view-order/:id", get_order_by_id);                       // url sent pass parameter
order_router.get("/view-order", get_order_by_id);                           // url sent pass query
order_router.get("/view-orders-by-user/:userId", get_order_by_user_id);     // url sent pass parameter
order_router.get("/view-orders-by-user", get_order_by_user_id);             // url sent pass query
// Order items route
order_router.get("/view-all-order-items", get_all_order_items);

export { order_router };

