import { getModel } from "../config/database.js";

const validStatuses = ["pending", "paid", "cancelled", "processing", "shipped", "delivered"];

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

// Validate delete order by user fields
const validateDeleteOrderByUser = (fields) => {
  const errors = [];
  const allowedDeleteStatuses = ['pending', 'cancelled'];

  if (!fields.userId) {
    errors.push("User ID is required");
  }

  if (!fields.orderId) {
    errors.push("Order ID is required");
  } else if (isNaN(fields.orderId)) {
    errors.push("Invalid orderId provided, must be a number");
  }

  return {
    isValid: errors.length === 0,
    errors,
    allowedDeleteStatuses
  };
};

// Validate update order by user fields
const validateUpdateOrderByUser = (fields) => {
  const errors = [];
  // User can only toggle between pending and cancelled
  const allowedTransitions = {
    'pending': ['cancelled'],
    'cancelled': ['pending']
  };

  if (!fields.userId) {
    errors.push("User ID is required");
  }

  if (!fields.orderId) {
    errors.push("Order ID is required");
  } else if (isNaN(fields.orderId)) {
    errors.push("Invalid orderId provided, must be a number");
  }

  if (!fields.newStatus) {
    errors.push("New status is required");
  } else if (!['pending', 'cancelled'].includes(fields.newStatus)) {
    errors.push("User can only set status to 'pending' or 'cancelled'");
  }

  return {
    isValid: errors.length === 0,
    errors,
    allowedTransitions
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
  const status = req.query.status || 'pending';

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

const get_order_admin = async (req, res) => {
  const { Order } = getModel();
  const userId = req.params.userId || null;
  const status = req.query.status || null;

  let filter = {};
  if (userId) filter.User_Id = userId;
  if (status && validStatuses.includes(status)) filter.Status = status;

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [total, orders] = await Promise.all([
      Order.count({ where: filter }),
      Order.findAll({
        where: filter,
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

const get_order_detail = async (req, res) => {
  const { Order, OrderItem } = getModel();
  const orderId = req.params.orderId;
  const userId = req.userId;

  const order = await Order.findOne({ where: { Order_Id: orderId, User_Id: userId } });
  if (!order) {
    return res.status(404).json({ error: "Order not found for this user" });
  }

  // get all details of the order including items
  const orderDetails = await Order.findOne({
    where: { Order_Id: orderId, User_Id: userId },
    include: [
      {
        model: OrderItem,
        as: 'items'
      }
    ]
  });

  return res.status(200).json({
    data: orderDetails
  });
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

    // Get all Product_Ids from request and resolve to indexes/prices
    const productIds = items.map(item => item.Product_Id);

    // Fetch all products to get their prices and indexes
    const products = await Product.findAll({
      where: { Product_Id: productIds },
      attributes: ['Product_Id', 'Index', 'Price']
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

    // Create maps for quick lookup
    const priceMap = new Map(products.map(p => [p.Product_Id, parseFloat(p.Price)]));
    const indexMap = new Map(products.map(p => [p.Product_Id, p.Index]));

    // Find existing items in ONE query using Product_Index
    const productIndexes = products.map(p => p.Index);
    const existingItems = await OrderItem.findAll({
      where: { Order_Id: orderId, Product_Index: productIndexes }
    });

    // Create a map for quick lookup keyed by Product_Index
    const existingMap = new Map(
      existingItems.map(item => [item.Product_Index, item])
    );

    // Separate items into toCreate and toUpdate
    const toCreate = [];
    const toUpdate = [];

    for (const item of items) {
      const productPrice = priceMap.get(item.Product_Id);
      const pIndex = indexMap.get(item.Product_Id);
      const itemAmount = item.Quantity * productPrice;
      const existing = existingMap.get(pIndex);
      
      if (existing) {
        const newQuantity = existing.Quantity + item.Quantity;
        toUpdate.push({
          item: existing,
          newQuantity,
          newAmount: productPrice // Keep unit price
        });
      } else {
        toCreate.push({
          Product_Index: pIndex,
          Quantity: item.Quantity,
          Amount: productPrice, // Store unit price
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
    const totalAmount = allOrderItems.reduce((sum, item) => sum + (item.Quantity * parseFloat(item.Amount)), 0);
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

    // If Product_Id is being updated, verify it exists and set Product_Index on updatedData
    if (updatedData.Product_Id !== undefined) {
      const newProduct = await Product.findOne({ where: { Product_Id: updatedData.Product_Id }, attributes: ['Index', 'Price'] });
      if (!newProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      updatedData.Product_Index = newProduct.Index;
    }

    // Recalculate Amount if Quantity or Product_Id is being updated
    if (updatedData.Quantity !== undefined || updatedData.Product_Id !== undefined) {
      let product = null;

      // Prefer lookup by Product_Index (primary key) if available
      const lookupIndex = updatedData.Product_Index !== undefined ? updatedData.Product_Index : existingItem.Product_Index;
      if (lookupIndex !== undefined && lookupIndex !== null) {
        product = await Product.findByPk(lookupIndex, { attributes: ['Price'] });
      }

      // Fallback to lookup by Product_Id if no product found by PK
      if (!product && updatedData.Product_Id !== undefined) {
        product = await Product.findOne({ where: { Product_Id: updatedData.Product_Id }, attributes: ['Price'] });
      }

      if (product) {
        const quantity = updatedData.Quantity !== undefined ? updatedData.Quantity : existingItem.Quantity;
        updatedData.Amount = parseFloat(product.Price); // Store unit price
      }
    }

    // Update the order item
    await existingItem.update(updatedData);

    // Update order total amount
    const allOrderItems = await OrderItem.findAll({ where: { Order_Id: existingItem.Order_Id } });
    const totalAmount = allOrderItems.reduce((sum, item) => sum + (item.Quantity * parseFloat(item.Amount)), 0);
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
    const totalAmount = remainingItems.reduce((sum, item) => sum + (item.Quantity * parseFloat(item.Amount)), 0);
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
    let indexMap = new Map();

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

      // Verify all products exist and get their prices and indexes
      const productIds = items.map(item => item.Product_Id);
      const existingProducts = await Product.findAll({
        where: { Product_Id: productIds },
        attributes: ['Product_Id', 'Index', 'Price']
      });

      if (existingProducts.length !== new Set(productIds).size) {
        const existingProductIds = existingProducts.map(p => p.Product_Id);
        const missingProductIds = [...new Set(productIds)].filter(id => !existingProductIds.includes(id));
        return res.status(400).json({ 
          error: "Some products not found",
          missingProductIds
        });
      }

      // Create price and index maps for Amount calculation
      priceMap = new Map(existingProducts.map(p => [p.Product_Id, parseFloat(p.Price)]));
      indexMap = new Map(existingProducts.map(p => [p.Product_Id, p.Index]));
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

    // Ensure Shipping_Address is set (prefer request body, fallback to user.Address)
    const providedAddress = (req.body.Shipping_Address || req.body.shipping_address || '').toString().trim();
    newOrder.Shipping_Address = providedAddress.length > 0 ? providedAddress : (user.Address || '');

    if(!newOrder.Shipping_Address) {
      return res.status(400).json({ error: "Shipping address is required: provide 'Shipping_Address' in request body or set Address on user profile" });
    }

    // Create order
    const createdOrder = await Order.create(newOrder);

    // If items provided, create order items with calculated Amount
    if (items && items.length > 0) {
      // Add Order_Id and calculate Amount for all items
      const itemsWithOrderId = items.map(item => {
        const productPrice = priceMap.get(item.Product_Id);
        const pIndex = indexMap.get(item.Product_Id);
        const itemAmount = item.Quantity * productPrice;
        return {
          Product_Index: pIndex,
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

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
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

// Update order by user - only pending -> cancelled allowed
const update_order_by_user = async (req, res) => {
  try {
    const { Order } = getModel();
    const userId = req.userId;
    const orderId = req.params.orderId;
    const newStatus = 'cancelled'; // Force to 'cancelled' for user updates

    // Validate basic fields
    const validation = validateUpdateOrderByUser({ userId, orderId, newStatus });
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Ensure user intends to cancel
    if (newStatus !== 'cancelled') {
      return res.status(400).json({ error: "Users can only change order status to 'cancelled'" });
    }

    // Check order exists and belongs to user
    const order = await Order.findOne({ where: { Order_Id: orderId, User_Id: userId } });
    if (!order) {
      return res.status(404).json({ error: "Order not found for this user" });
    }

    // Only allow cancelling from pending state
    if (order.Status !== 'pending') {
      return res.status(400).json({ error: `Only orders with status 'pending' can be cancelled. Current status: '${order.Status}'` });
    }

    // Perform update
    const updatedOrder = await order.update({ Status: 'cancelled' });

    return res.status(200).json({
      message: "Order status updated to 'cancelled' successfully",
      data: updatedOrder
    });
  } catch (err) {
    console.error("Error updating order:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete order by user - only cancelled status allowed
const delete_order_by_user = async (req, res) => {
  try {
    const { Order, OrderItem } = getModel();
    const userId = req.userId;
    const orderId = req.params.orderId;

    // Validate using validation function
    const validation = validateDeleteOrderByUser({ userId, orderId });
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if order exists and belongs to user
    const order = await Order.findOne({ where: { Order_Id: orderId, User_Id: userId } });
    if (!order) {
      return res.status(404).json({ error: "Order not found for this user" });
    }

    // Only allow deletion when status is 'cancelled'
    if (order.Status !== 'cancelled') {
      return res.status(400).json({
        error: `Only orders with status 'cancelled' can be deleted. Current status: '${order.Status}'`
      });
    }

    // Delete all order items associated with this order
    await OrderItem.destroy({ where: { Order_Id: order.Order_Id } });

    // Delete the order itself
    await Order.destroy({ where: { Order_Id: order.Order_Id } });

    return res.status(200).json({
      message: "Order and associated items deleted successfully",
      deletedOrderId: order.Order_Id
    });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ==================== USER ORDER ITEM CRUD (with ownership check) ====================
// Create order item by user - must own the order and order must be pending
const create_order_item_by_user = async (req, res) => {
  const { OrderItem, Order, Product } = getModel();
  const userId = req.userId;
  const orderId = req.params.orderId;
  const items = Array.isArray(req.body) ? req.body : [req.body];

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    // Check if order exists and belongs to user
    const order = await Order.findOne({ where: { Order_Id: orderId, User_Id: userId } });
    if (!order) {
      return res.status(404).json({ error: "Order not found or you don't have permission" });
    }

    // Only allow adding items to pending orders
    if (order.Status !== 'pending') {
      return res.status(400).json({ error: "Can only add items to orders with 'pending' status" });
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

    // Get all Product_Ids from request and resolve to indexes/prices
    const productIds = items.map(item => item.Product_Id);
    const products = await Product.findAll({
      where: { Product_Id: productIds },
      attributes: ['Product_Id', 'Index', 'Price']
    });

    if (products.length !== new Set(productIds).size) {
      const existingProductIds = products.map(p => p.Product_Id);
      const missingProductIds = [...new Set(productIds)].filter(id => !existingProductIds.includes(id));
      return res.status(400).json({ error: 'Some products not found', missingProductIds });
    }

    const priceMap = new Map(products.map(p => [p.Product_Id, parseFloat(p.Price)]));
    const indexMap = new Map(products.map(p => [p.Product_Id, p.Index]));
    const productIndexes = products.map(p => p.Index);

    // Find existing items in ONE query using Product_Index
    const existingItems = await OrderItem.findAll({ where: { Order_Id: orderId, Product_Index: productIndexes } });
    const existingMap = new Map(existingItems.map(item => [item.Product_Index, item]));

    // Separate items into toCreate and toUpdate
    const toCreate = [];
    const toUpdate = [];

    for (const item of items) {
      const productPrice = priceMap.get(item.Product_Id);
      const pIndex = indexMap.get(item.Product_Id);
      const itemAmount = item.Quantity * productPrice;
      const existing = existingMap.get(pIndex);

      if (existing) {
        const newQuantity = existing.Quantity + item.Quantity;
        const newAmount = productPrice; // Store unit price
        toUpdate.push({ item: existing, newQuantity, newAmount });
      } else {
        toCreate.push({ Product_Index: pIndex, Quantity: item.Quantity, Amount: productPrice, Order_Id: orderId });
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
    const totalAmount = allOrderItems.reduce((sum, item) => sum + (item.Quantity * parseFloat(item.Amount)), 0);
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

// Update order item by user - must own the order and order must be pending
const update_order_item_by_user = async (req, res) => {
  const { OrderItem, Order, Product } = getModel();
  const userId = req.userId;
  const orderItemId = req.params.orderItemId;
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

    // Check if order belongs to user
    const order = await Order.findOne({ where: { Order_Id: existingItem.Order_Id, User_Id: userId } });
    if (!order) {
      return res.status(403).json({ error: "You don't have permission to update this order item" });
    }

    // Only allow updating items in pending orders
    if (order.Status !== 'pending') {
      return res.status(400).json({ error: "Can only update items in orders with 'pending' status" });
    }

    // If Product_Id is being updated, verify it exists and set Product_Index on updatedData
    if (updatedData.Product_Id !== undefined) {
      const newProduct = await Product.findOne({ where: { Product_Id: updatedData.Product_Id }, attributes: ['Index', 'Price'] });
      if (!newProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      updatedData.Product_Index = newProduct.Index;
    }

    // Recalculate Amount if Quantity or Product_Id is being updated
    if (updatedData.Quantity !== undefined || updatedData.Product_Id !== undefined) {
      const product = updatedData.Product_Id !== undefined
        ? await Product.findOne({ where: { Product_Id: updatedData.Product_Id }, attributes: ['Price'] })
        : await Product.findOne({ where: { Index: existingItem.Product_Index }, attributes: ['Price'] });
      if (product) {
        const quantity = updatedData.Quantity !== undefined 
          ? updatedData.Quantity 
          : existingItem.Quantity;
        updatedData.Amount = parseFloat(product.Price); // Store unit price
      }
    }

    // Update the order item
    await existingItem.update(updatedData);

    // Update order total amount
    const allOrderItems = await OrderItem.findAll({ where: { Order_Id: existingItem.Order_Id } });
    const totalAmount = allOrderItems.reduce((sum, item) => sum + (item.Quantity * parseFloat(item.Amount)), 0);
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

// Delete order item by user - must own the order and order must be pending
const delete_order_item_by_user = async (req, res) => {
  const { OrderItem, Order } = getModel();
  const userId = req.userId;
  const orderItemId = req.params.orderItemId;

  if (!orderItemId) {
    return res.status(400).json({ error: "Order Item ID is required" });
  }

  try {
    // Get the order item first
    const orderItem = await OrderItem.findByPk(orderItemId);
    if (!orderItem) {
      return res.status(404).json({ error: "Order item not found" });
    }

    // Check if order belongs to user
    const order = await Order.findOne({ where: { Order_Id: orderItem.Order_Id, User_Id: userId } });
    if (!order) {
      return res.status(403).json({ error: "You don't have permission to delete this order item" });
    }

    // Only allow deleting items in pending orders
    if (order.Status !== 'pending') {
      return res.status(400).json({ error: "Can only delete items from orders with 'pending' status" });
    }

    const orderId = orderItem.Order_Id;

    // Delete the order item
    await OrderItem.destroy({ where: { Order_Item_Id: orderItemId } });

    // Update order total amount
    const remainingItems = await OrderItem.findAll({ where: { Order_Id: orderId } });
    const totalAmount = remainingItems.reduce((sum, item) => sum + (item.Quantity * parseFloat(item.Amount)), 0);
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

export {
  // Order functions
  create_order,
  // Order Item functions (admin)
  create_order_item,
  // User order item functions
  create_order_item_by_user, delete_order, delete_order_by_user, delete_order_item, delete_order_item_by_user, get_all_details_order_by_user_id, get_order_admin, get_order_detail, get_order_items_by_order_id, update_order,
  // User order functions
  update_order_by_user, update_order_item, update_order_item_by_user
};

