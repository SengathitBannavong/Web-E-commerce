import { getDB } from "../config/database.js";
import { OrderItem as OrderItemModel } from "../models/order_item_model.js";

const get_all_order_items = (req, res) => {
    const db = getDB();
    const OrderItem = OrderItemModel(db);
    OrderItem.findAll()
    .then(orderItems => {
        res.json(orderItems);
    })
    .catch(err => {
        console.error("Error fetching order items:", err);
        res.status(500).json({ error: "Internal server error" });
    });
};


// Helper function to create order items
const create_order_items_helper = async (items) => {
    const db = getDB();
    const OrderItem = OrderItemModel(db);
    
    try {
        const newOrderItems = await OrderItem.bulkCreate(items);
        return newOrderItems;
    } catch (err) {
        console.error("Error creating multiple order items:", err);
        throw err;
    }
};

// Helper function to delete order items by user ID
const delete_order_items_by_user_id_helper = async (userId) => {
    const db = getDB();
    const OrderItem = OrderItemModel(db);
    
    try {
        const deletedCount = await OrderItem.destroy({
            where: { User_Id: userId }
        });
        return deletedCount;
    } catch (err) {
        console.error("Error deleting order items by user ID:", err);
        throw err;
    }
};

// Helper function to delete order item by ID
const delete_order_item_by_id_helper = async (id) => {
    const db = getDB();
    const OrderItem = OrderItemModel(db);
    
    try {
        const deletedCount = await OrderItem.destroy({
            where: { Order_Item_Id: id }
        });
        return deletedCount;
    } catch (err) {
        console.error("Error deleting order item by ID:", err);
        throw err;
    }
};

// Helper function to delete order items by order ID
const delete_order_items_by_order_id_helper = async (orderId) => {
    const db = getDB();
    const OrderItem = OrderItemModel(db);
    
    try {
        const deletedCount = await OrderItem.destroy({
            where: { Order_Id: orderId }
        });
        return deletedCount;
    } catch (err) {
        console.error("Error deleting order items by order ID:", err);
        throw err;
    }
};

export {
    // helper functions
    create_order_items_helper,
    delete_order_item_by_id_helper,
    delete_order_items_by_order_id_helper,
    delete_order_items_by_user_id_helper,
    // api call
    get_all_order_items
};

