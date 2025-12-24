import { getDB, getModel } from "../config/database.js";

/**
 * Checkout - Convert Cart to Order
 * POST /carts/:userId/checkout
 * 
 * This function:
 * 1. Validates that cart exists and has items
 * 2. Validates stock availability for all items
 * 3. Creates an Order with OrderItems
 * 4. Deducts stock for each item
 * 5. Clears the cart (marks as completed)
 * 6. Returns the created order
 */
export const checkout = async (req, res) => {
  const sequelize = getDB();
  const transaction = await sequelize.transaction();

  try {
    const userId = req.params.userId;

    if (!userId) {
      await transaction.rollback();
      return res.status(400).json({ error: "User ID is required" });
    }

    const { Cart, CartItem, Order, OrderItem, Product, Stock, User } = getModel();

    // 1. Get user's active cart with items
    const cart = await Cart.findOne({
      where: { User_Id: userId, Status: 'active' },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['Product_Id', 'Name', 'Price', 'Index']
        }]
      }],
      transaction
    });

    if (!cart) {
      await transaction.rollback();
      return res.status(404).json({ error: "No active cart found" });
    }

    if (!cart.items || cart.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2. Validate stock for all items
    const stockErrors = [];
    const stockUpdates = [];

    for (const item of cart.items) {
      const prodIndex = item.Product_Index ?? item.product?.Index;

      const stock = await Stock.findOne({
        where: { Product_Index: prodIndex },
        transaction,
        lock: transaction.LOCK.UPDATE // Lock row to prevent race conditions
      });

      if (!stock) {
        stockErrors.push({
          productId: item.product?.Product_Id ?? prodIndex,
          productName: item.product?.Name || 'Unknown',
          error: "Stock record not found"
        });
        continue;
      }

      if (stock.Quantity < item.Quantity) {
        stockErrors.push({
          productId: item.product?.Product_Id ?? prodIndex,
          productName: item.product?.Name || 'Unknown',
          requested: item.Quantity,
          available: stock.Quantity,
          error: "Insufficient stock"
        });
        continue;
      }

      // Prepare stock update
      stockUpdates.push({
        stock,
        deductQuantity: item.Quantity
      });
    }

    // If any stock errors, rollback and return errors
    if (stockErrors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: "Stock validation failed",
        details: stockErrors
      });
    }

    // 3. Calculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      const itemPrice = parseFloat(item.product?.Price || 0);
      totalAmount += itemPrice * item.Quantity;
    }

    const providedAddress = (req.body.Shipping_Address || req.body.shipping_address || '').toString().trim();
    let shippingAddress = providedAddress;
    if(!providedAddress) {
      // 4. Create Order (prefer Shipping_Address from request body, fallback to user's Address)
      const userRecord = await User.findOne({ where: { User_Id: userId }, transaction });
      shippingAddress = providedAddress.length > 0 ? providedAddress : (userRecord?.Address || '');
    }

    if (!shippingAddress) {
      await transaction.rollback();
      return res.status(400).json({ error: "Shipping address is required: provide 'Shipping_Address' in request body or set Address on user profile" });
    }

    const order = await Order.create({
      User_Id: userId,
      Date: new Date(),
      Status: 'pending',
      Amount: totalAmount,
      Shipping_Address: shippingAddress
    }, { transaction });

    // 5. Create OrderItems
    const orderItems = [];
    for (const item of cart.items) {
      const itemPrice = parseFloat(item.product?.Price || 0);
      const prodIndex = item.Product_Index ?? item.product?.Index;
      const orderItem = await OrderItem.create({
        Order_Id: order.Order_Id,
        Product_Index: prodIndex,
        Quantity: item.Quantity,
        Amount: itemPrice * item.Quantity
      }, { transaction });
      orderItems.push(orderItem);
    }

    // 6. Deduct stock
    for (const { stock, deductQuantity } of stockUpdates) {
      await stock.update({
        Quantity: stock.Quantity - deductQuantity,
        Last_Updated: new Date()
      }, { transaction });
    }

    // 7. Mark cart as completed and clear items
    await cart.update({ Status: 'completed' }, { transaction });

    // 8. Create a new active cart for the user
    await Cart.create({
      User_Id: userId,
      Status: 'active'
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    // 9. Return success response
    res.status(201).json({
      success: true,
      message: "Checkout successful",
      order: {
        Order_Id: order.Order_Id,
        User_Id: order.User_Id,
        Date: order.Date,
        Status: order.Status,
        Amount: totalAmount,
          items: orderItems.map(item => ({
          Order_Item_Id: item.Order_Item_Id,
          Product_Index: item.Product_Index,
          Quantity: item.Quantity,
          Amount: item.Amount
        }))
      }
    });

  } catch (err) {
    await transaction.rollback();
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

/**
 * Validate cart items stock without checkout
 * POST /carts/:userId/validate-stock
 */
export const validateCartStock = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { Cart, CartItem, Product, Stock } = getModel();

    // Get user's active cart with items
    const cart = await Cart.findOne({
      where: { User_Id: userId, Status: 'active' },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['Product_Id', 'Name', 'Price']
        }]
      }]
    });

    if (!cart) {
      return res.status(404).json({ error: "No active cart found" });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Check stock for all items
    const validationResults = [];
    let allValid = true;

    for (const item of cart.items) {
      const prodIndex = item.Product_Index ?? item.product?.Index;
      const stock = await Stock.findOne({ where: { Product_Index: prodIndex } });

      const isValid = stock && stock.Quantity >= item.Quantity;
      if (!isValid) allValid = false;

      validationResults.push({
        productId: item.product?.Product_Id ?? prodIndex,
        productName: item.product?.Name || 'Unknown',
        requestedQuantity: item.Quantity,
        availableQuantity: stock?.Quantity || 0,
        isValid
      });
    }

    res.json({
      valid: allValid,
      items: validationResults
    });

  } catch (err) {
    console.error("Stock validation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get cart summary with totals
 * GET /carts/:userId/summary
 */
export const getCartSummary = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { Cart, CartItem, Product, Stock } = getModel();

    const cart = await Cart.findOne({
      where: { User_Id: userId, Status: 'active' },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['Product_Id', 'Name', 'Price', 'Photo_Id']
        }]
      }]
    });

    if (!cart) {
      return res.status(404).json({ error: "No active cart found" });
    }

    // Calculate totals and check stock
    let subtotal = 0;
    let totalItems = 0;
    const items = [];

    for (const item of cart.items || []) {
      const price = parseFloat(item.product?.Price || 0);
      const itemTotal = price * item.Quantity;
      subtotal += itemTotal;
      totalItems += item.Quantity;

      // Check stock
      const prodIndex = item.Product_Index ?? item.product?.Index;
      const stock = await Stock.findOne({ where: { Product_Index: prodIndex } });

      items.push({
        cartItemId: item.Cart_Item_Id,
        productId: item.product?.Product_Id ?? prodIndex,
        productName: item.product?.Name,
        price: price,
        quantity: item.Quantity,
        total: itemTotal,
        inStock: stock ? stock.Quantity >= item.Quantity : false,
        availableStock: stock?.Quantity || 0
      });
    }

    res.json({
      cartId: cart.Cart_Id,
      userId: cart.User_Id,
      status: cart.Status,
      itemCount: cart.items?.length || 0,
      totalQuantity: totalItems,
      subtotal: subtotal,
      // You can add tax, shipping, discounts here
      total: subtotal,
      items
    });

  } catch (err) {
    console.error("Cart summary error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};