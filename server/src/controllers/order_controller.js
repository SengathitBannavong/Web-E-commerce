import { getModel } from "../config/database.js";

const validStatuses = ['pending', 'paid', 'cancelled'];

// ==================== ORDER VALIDATION ====================
const validateOrderFields = (fields, isUpdate = false) => {
  const errors = [];

  // For create, User_Id is required
  if (!isUpdate && !fields.User_Id) {
    errors.push("User_Id is required");
  }

  // Validate Status if provided
  if (fields.Status !== undefined) {
    if (!validStatuses.includes(fields.Status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  // Validate Amount if provided
  if (fields.Amount !== undefined) {
    if (typeof fields.Amount !== 'number' || fields.Amount < 0) {
      errors.push("Amount must be a non-negative number");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== ORDER ITEM VALIDATION ====================
const validateOrderItemFields = (fields, isUpdate = false) => {
  const errors = [];

  // For create, Order_Id, Product_Id, Quantity are required (Amount is auto-calculated)
  if (!isUpdate) {
    if (!fields.Order_Id) {
      errors.push("Order_Id is required");
    }
    if (!fields.Product_Id) {
      errors.push("Product_Id is required");
    }
    if (!fields.Quantity) {
      errors.push("Quantity is required");
    }
  }

  // Validate Quantity if provided
  if (fields.Quantity !== undefined) {
    if (typeof fields.Quantity !== 'number' || fields.Quantity < 1) {
      errors.push("Quantity must be a positive number");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== ORDER GET ====================
const get_all_details_order_by_user_id = async (req, res) => {
  const userId = req.params.userId;
  const status = req.query.status || 'paid';

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { Order, OrderItem, Product } = getModel();

    const whereClause = {
      User_Id: userId,
      Status: status
    };  

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [total, orders] = await Promise.all([
      Order.count({ where: whereClause }),
      Order.findAll({
        where: whereClause,
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['Product_Id', 'Index', 'Name', 'Description', 'Price', 'Photo_Id']
              }
            ]
          }
        ],
        order: [
          ['Order_Id', 'DESC'],
          [{ model: OrderItem, as: 'items' }, 'Order_Item_Id', 'ASC']
        ],
        limit,
        offset
      })
    ]);

    const totalPage = Math.ceil(total / limit);

    return res.status(200).json({
      totalPage,
      total,
      data: orders
    });
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const get_order = async (req, res) => {
  const userId = req.params.userId;
  const status = req.query.status || 'pending';

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (validStatuses.indexOf(status) === -1) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const { Order } = getModel();

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const whereClause = { 
      User_Id: userId,
      Status: status
    };

    const [total, orders] = await Promise.all([
      Order.count({ where: whereClause }),
      Order.findAll({
        where: whereClause,
        limit,
        offset,
        order: [['Order_Id', 'DESC']]
      })
    ]);

    const totalPage = Math.ceil(total / limit);

    return res.status(200).json({
      totalPage,
      total,
      data: orders
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ==================== ORDER ITEM CRUD ====================
const get_order_items_by_order_id = async (req, res) => {
  const { OrderItem, Product } = getModel();
  const orderId = req.params.orderId;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [total, orderItems] = await Promise.all([
      OrderItem.count({ where: { Order_Id: orderId } }),
      OrderItem.findAll({
        where: { Order_Id: orderId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['Product_Id', 'Index', 'Name', 'Description', 'Price', 'Photo_Id']
          }
        ],
        limit,
        offset,
        order: [['Order_Item_Id', 'ASC']]
      })
    ]);

    const totalPage = Math.ceil(total / limit);

    return res.status(200).json({
      totalPage,
      total,
      data: orderItems
    });
  } catch (err) {
    console.error("Error fetching order items:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const create_order_item = async (req, res) => {
  const { OrderItem, Order, Product } = getModel();
  const orderId = req.params.orderId;
  const items = Array.isArray(req.body) ? req.body : [req.body];

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  // Validate all items
  const validationErrors = [];
  items.forEach((item, index) => {
    const itemWithOrderId = { ...item, Order_Id: orderId };
    const validation = validateOrderItemFields(itemWithOrderId, false);
    if (!validation.isValid) {
      validationErrors.push({ index, errors: validation.errors });
    }
  });

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Get all Product_Ids from request
    const productIds = items.map(item => item.Product_Id);

    // Fetch all products to get their prices
    const products = await Product.findAll({
      where: { Product_Id: productIds },
      attributes: ['Product_Id', 'Price']
    });

    // Verify all products exist
    if (products.length !== new Set(productIds).size) {
      const existingProductIds = products.map(p => p.Product_Id);
      const missingProductIds = [...new Set(productIds)].filter(id => !existingProductIds.includes(id));
      return res.status(400).json({
        error: "Some products not found",
        missingProductIds
      });
    }

    // Create a price map for quick lookup
    const priceMap = new Map(
      products.map(p => [p.Product_Id, parseFloat(p.Price)])
    );

    // Find existing items in ONE query
    const existingItems = await OrderItem.findAll({
      where: { Order_Id: orderId, Product_Id: productIds }
    });

    // Create a map for quick lookup
    const existingMap = new Map(
      existingItems.map(item => [item.Product_Id, item])
    );

    // Separate items into toCreate and toUpdate
    const toCreate = [];
    const toUpdate = [];

    for (const item of items) {
      const productPrice = priceMap.get(item.Product_Id);
      const itemAmount = item.Quantity * productPrice;
      const existing = existingMap.get(item.Product_Id);
      
      if (existing) {
        const newQuantity = existing.Quantity + item.Quantity;
        const newAmount = newQuantity * productPrice;
        toUpdate.push({
          item: existing,
          newQuantity,
          newAmount
        });
      } else {
        toCreate.push({
          Product_Id: item.Product_Id,
          Quantity: item.Quantity,
          Amount: itemAmount,
          Order_Id: orderId
        });
      }
    }

    const results = {
      created: [],
      updated: []
    };

    // Bulk create new items
    if (toCreate.length > 0) {
      results.created = await OrderItem.bulkCreate(toCreate);
    }

    // Bulk update existing items using Promise.all
    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map(({ item, newQuantity, newAmount }) =>
          item.update({ Quantity: newQuantity, Amount: newAmount })
        )
      );
      results.updated = toUpdate.map(({ item }) => item);
    }

    // Update order total amount
    const allOrderItems = await OrderItem.findAll({ where: { Order_Id: orderId } });
    const totalAmount = allOrderItems.reduce((sum, item) => sum + parseFloat(item.Amount), 0);
    await order.update({ Amount: totalAmount });

    return res.status(201).json({
      message: "Order items processed successfully",
      data: results,
      orderTotal: totalAmount
    });
  } catch (err) {
    console.error("Error creating order items:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const update_order_item = async (req, res) => {
  const { OrderItem, Order, Product } = getModel();
  const orderItemId = req.params.id;
  const updatedData = req.body;

  if (!orderItemId) {
    return res.status(400).json({ error: "Order Item ID is required" });
  }

  if (!updatedData || Object.keys(updatedData).length === 0) {
    return res.status(400).json({ error: "No data provided for update" });
  }

  // Validate fields
  const validation = validateOrderItemFields(updatedData, true);
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }

  try {
    // Get the existing order item first
    const existingItem = await OrderItem.findByPk(orderItemId);
    if (!existingItem) {
      return res.status(404).json({ error: "Order item not found" });
    }

    // Determine which Product_Id to use for price lookup
    const productIdForPrice = updatedData.Product_Id !== undefined 
      ? updatedData.Product_Id 
      : existingItem.Product_Id;

    // If Product_Id is being updated, verify it exists
    if (updatedData.Product_Id !== undefined) {
      const newProduct = await Product.findOne({ where: { Product_Id: updatedData.Product_Id } });
      if (!newProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
    }

    // Recalculate Amount if Quantity or Product_Id is being updated
    if (updatedData.Quantity !== undefined || updatedData.Product_Id !== undefined) {
      const product = await Product.findOne(
        { 
          where: { Product_Id: productIdForPrice },
          attributes: ['Price']
        }
      );
      if (product) {
        const quantity = updatedData.Quantity !== undefined 
          ? updatedData.Quantity 
          : existingItem.Quantity;
        updatedData.Amount = quantity * parseFloat(product.Price);
      }
    }

    // Update the order item
    await existingItem.update(updatedData);

    // Update order total amount
    const allOrderItems = await OrderItem.findAll({ where: { Order_Id: existingItem.Order_Id } });
    const totalAmount = allOrderItems.reduce((sum, item) => sum + parseFloat(item.Amount), 0);
    await Order.update({ Amount: totalAmount }, { where: { Order_Id: existingItem.Order_Id } });

    return res.status(200).json({
      message: "Order item updated successfully",
      data: existingItem
    });
  } catch (err) {
    console.error("Error updating order item:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const delete_order_item = async (req, res) => {
  const { OrderItem, Order } = getModel();
  const orderItemId = req.params.id;

  if (!orderItemId) {
    return res.status(400).json({ error: "Order Item ID is required" });
  }

  try {
    // Get the order item first to know which order to update
    const orderItem = await OrderItem.findByPk(orderItemId);
    if (!orderItem) {
      return res.status(404).json({ error: "Order item not found" });
    }

    const orderId = orderItem.Order_Id;

    // Delete the order item
    await OrderItem.destroy({ where: { Order_Item_Id: orderItemId } });

    // Update order total amount
    const remainingItems = await OrderItem.findAll({ where: { Order_Id: orderId } });
    const totalAmount = remainingItems.reduce((sum, item) => sum + parseFloat(item.Amount), 0);
    await Order.update({ Amount: totalAmount }, { where: { Order_Id: orderId } });

    return res.status(200).json({
      message: "Order item deleted successfully",
      deletedOrderItemId: orderItemId,
      newOrderTotal: totalAmount
    });
  } catch (err) {
    console.error("Error deleting order item:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ==================== ORDER CRUD ====================
const create_order = async (req, res) => {
  try {
    const { Order, OrderItem, Product, User } = getModel();
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // check for valid userId
    const user = await User.findOne({ where: { User_Id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // check if already have order with status 'pending' for this user
    const existingOrder = await Order.findOne({ where: { User_Id: userId, Status: 'pending' } });

    if (existingOrder) {
      return res.status(409).json({ 
        error: "An active pending order for this user already exists",
        existingOrderId: existingOrder.Order_Id
      });
    }

    // Extract items from request body
    const { items, ...orderData } = req.body;

    // Build new order object
    let newOrder = {
      ...orderData,
      User_Id: userId
    };

    // Validate order fields
    const validation = validateOrderFields(newOrder, false);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Fetch products and create price map if items provided
    let priceMap = new Map();

    // Validate items if provided
    if (items !== undefined) {
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "items must be an array" });
      }

      if (items.length === 0) {
        return res.status(400).json({ error: "items array cannot be empty" });
      }

      // Validate each item
      const itemValidationErrors = [];
      items.forEach((item, index) => {
        const itemWithOrderId = { ...item, Order_Id: 1 }; // Temporary Order_Id for validation first
        const itemValidation = validateOrderItemFields(itemWithOrderId, false);
        if (!itemValidation.isValid) {
          itemValidationErrors.push({ index, errors: itemValidation.errors });
        }
      });

      if (itemValidationErrors.length > 0) {
        return res.status(400).json({ errors: itemValidationErrors });
      }

      // Verify all products exist and get their prices
      const productIds = items.map(item => item.Product_Id);
      const existingProducts = await Product.findAll({
        where: { Product_Id: productIds },
        attributes: ['Product_Id', 'Price']
      });

      if (existingProducts.length !== new Set(productIds).size) {
        const existingProductIds = existingProducts.map(p => p.Product_Id);
        const missingProductIds = [...new Set(productIds)].filter(id => !existingProductIds.includes(id));
        return res.status(400).json({ 
          error: "Some products not found",
          missingProductIds
        });
      }

      // Create price map for Amount calculation
      priceMap = new Map(
        existingProducts.map(p => [p.Product_Id, parseFloat(p.Price)])
      );
    }

    // Set default values
    if (!newOrder.Status) {
      newOrder.Status = 'pending';
    }
    if (!newOrder.Amount) {
      newOrder.Amount = 0;
    }
    if (!newOrder.Date) {
      newOrder.Date = new Date();
    }

    // Create order
    const createdOrder = await Order.create(newOrder);

    // If items provided, create order items with calculated Amount
    if (items && items.length > 0) {
      // Add Order_Id and calculate Amount for all items
      const itemsWithOrderId = items.map(item => {
        const productPrice = priceMap.get(item.Product_Id);
        const itemAmount = item.Quantity * productPrice;
        return {
          Product_Id: item.Product_Id,
          Quantity: item.Quantity,
          Amount: itemAmount,
          Order_Id: createdOrder.Order_Id
        };
      });

      // Bulk create order items
      const createdItems = await OrderItem.bulkCreate(itemsWithOrderId);

      // Calculate and update order total amount
      const totalAmount = itemsWithOrderId.reduce((sum, item) => sum + item.Amount, 0);
      await createdOrder.update({ Amount: totalAmount });

      return res.status(201).json({
        message: "Order and items created successfully",
        data: {
          order: { ...createdOrder.toJSON(), Amount: totalAmount },
          items: createdItems
        }
      });
    }

    return res.status(201).json({
      message: "Order created successfully",
      data: createdOrder
    });
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message
    });
  }
};

const update_order = async (req, res) => {
  const { Order } = getModel();
  const orderId = req.params.id;
  const updatedData = {
    Status: req.body.status,
    User_Id: req.body.user_id
  }

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  if (!updatedData || Object.keys(updatedData).length === 0) {
    return res.status(400).json({ 
      error: "No data provided for update",
      info: "Fields can update are: User_Id, Status"
    });
  }

  // Validate fields
  const validation = validateOrderFields(updatedData, true);
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }

  try {
    // Find order by primary key first
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order instance
    const newOrder = await order.update(updatedData);

    return res.status(200).json({
      message: "Order updated successfully",
      data: newOrder
    });
  } catch (err) {
    console.error("Error updating order:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const delete_order = async (req, res) => {
  const { Order, OrderItem } = getModel();
  const orderId = req.params.id;
  const auth = req.headers.authorization;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  // TODO: Implement proper authentication and authorization
  if (!auth || auth !== "admin-secret") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Delete all order items associated with this order
    await OrderItem.destroy({ where: { Order_Id: orderId } });

    // Delete the order itself
    await Order.destroy({ where: { Order_Id: orderId } });

    return res.status(200).json({
      message: "Order and associated items deleted successfully",
      deletedOrderId: orderId
    });
  } catch (err) {
    console.error("Error deleting order:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const delete_all_orders_by_user = async (req, res) => {
  try {
    const { Order, OrderItem } = getModel();
    const userId = req.params.userId;
    const auth = req.headers.authorization;
    let status = req.query.status;
    let res_message = [];

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // TODO: Implement proper authentication and authorization
    if (!auth || auth !== "admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let whereClause = { User_Id: userId };
    if (status) {
      whereClause.Status = status;
    } else {
      res_message.push("No status provided, deleting all orders for user");
    }

    // Check if orders exist
    const orders = await Order.findAll({ where: whereClause });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    // Get all order IDs
    const orderIds = orders.map(order => order.Order_Id);

    // Delete all order items associated with these orders
    await OrderItem.destroy({ where: { Order_Id: orderIds } });

    // Delete the orders themselves
    await Order.destroy({ where: whereClause });

    res.json({
      message: "Orders and associated items deleted successfully",
      deletedUserId: userId,
      deletedOrderCount: orders.length,
      info: res_message.length > 0 ? res_message : undefined
    });
  } catch (err) {
    console.error("Error deleting orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  // Order functions
  create_order,
  // Order Item functions
  create_order_item, delete_all_orders_by_user, delete_order, delete_order_item, get_all_details_order_by_user_id, get_order, get_order_items_by_order_id, update_order, update_order_item
};

