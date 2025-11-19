import { getDB } from "../config/database.js";
import { OrderItem as OrderItemModel } from "../models/order_item_model.js";
import { Order as OrderModel } from "../models/order_model.js";

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


const get_all_orders = (res) => {
    const db = getDB();
    const Order = OrderModel(db);
    Order.findAll()
    .then(orders => {
        res.json(orders);
    })
    .catch(err => {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: "Internal server error" });
    });
};

const get_order_by_id = (id, res) => {
    if (!id) {
        return res.status(400).json({ error: "Order ID is required" });
    }

    const db = getDB();
    const Order = OrderModel(db);
    
    Order.findOne({ where: { Order_Id: id } })
    .then(order => {
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    })
    .catch(err => {
        console.error("Error fetching order:", err);
        res.status(500).json({ error: "Internal server error" });
    });
};

const get_order_by_user_id = (userId, res) => {
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const db = getDB();
    const Order = OrderModel(db);
    
    Order.findAll({ where: { User_Id: userId } })
    .then(orders => {
        res.json(orders);
    })
    .catch(err => {
        console.error("Error fetching orders for user:", err);
        res.status(500).json({ error: "Internal server error" });
    });
};

const get_orders = (req, res) => {
    const id = req.params.id || req.query.id;
    const userId = req.params.userId || req.query.userId;
    const type = req.params.type || req.query.type;

    if(type === "items"){
        return get_all_order_items(req, res);
    }

    if (id) {
        return get_order_by_id(id, res);
    } else if (userId) {
        return get_order_by_user_id(userId, res);
    } else {
        // TODO: Implement admin check here
        var isAdmin = true;
        if(isAdmin){
            return get_all_orders(res);
        }
    }

    return res.status(400).json({ error: "Invalid request parameters" });
};


// Helper function to create order items
const create_order_items_helper = async (items) => {
    const db = getDB();
    const OrderItem = OrderItemModel(db);
    
    try {
        // check validity of items array
        for (let i = 0; i < items.length; i++) {
            if (!items[i].Product_Id || !items[i].Quantity || !items[i].Amount) {
                throw new Error(`Item at index ${i} is missing required fields`);
            }
        }

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


const create_order = async (req, res) => {
    const db = getDB();
    const Order = OrderModel(db);
    const { User_Id, items, Status } = req.body;

    // Validate required fields
    if (!User_Id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
            error: "Missing required fields",
            required: ["User_Id", "items (array)", "Status"],
            example: {
                User_Id: "U000001",
                Status: "pending",
                items: [
                    { Product_Id: "P0000001", Quantity: 2, Amount: 49.99 }
                ]
            }
        });
    }

    // Validate each item has required fields
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.Product_Id || !item.Quantity || !item.Amount) {
            return res.status(400).json({ 
                error: `Item at index ${i} is missing required fields`,
                required: ["Product_Id", "Quantity", "Amount"]
            });
        }
    }

    try {
        // Step 1: Create the order first
        const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.Amount), 0);
        
        const newOrder = await Order.create({
            User_Id,
            Date: new Date(),
            Status,
            Amount: totalAmount
        });

        // Step 2: Add Order_Id to each item
        const itemsWithOrderId = items.map(item => ({
            Order_Id: newOrder.Order_Id,
            Product_Id: item.Product_Id,
            Quantity: item.Quantity,
            Amount: item.Amount
        }));

        // Step 3: Create order items using the helper function
        const orderItems = await create_order_items_helper(itemsWithOrderId);

        // Step 4: Return the complete order with items
        res.status(201).json({
            message: "Order created successfully",
            order: newOrder,
            items: orderItems
        });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

const delete_order_by_id = async (req, res) => {
    const db = getDB();
    const Order = OrderModel(db);
    const id = req.params.id || req.query.id;

    // Validate that id exists
    if (!id) {
        return res.status(400).json({ error: "Order ID is required" });
    }

    try {
        // Step 1: Delete all order items associated with this order first
        const deletedItemsCount = await delete_order_items_by_order_id_helper(id);
        
        // Step 2: Delete the order
        const deletedOrderCount = await Order.destroy({
            where: { Order_Id: id }
        });
        
        if (deletedOrderCount === 0) {
            return res.status(404).json({ error: "No order found with this ID" });
        }
        
        res.status(200).json({ 
            message: `Successfully deleted order with ID ${id}`,
            deletedItems: deletedItemsCount
        });
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


export { create_order, delete_order_by_id, get_all_order_items, get_orders };

