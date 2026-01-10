import { getDB, getModel } from "../config/database.js";

export const checkout_middle = async (req, res, next) => {
  const sequelize = getDB();
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const cart = req.cart; // Cart already fetched by getActiveCart middleware

    if (!userId) {
      await transaction.rollback();
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!cart) {
      await transaction.rollback();
      return res.status(404).json({ error: "No active cart found" });
    }

    if (!cart.items || cart.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: "Cart is empty" });
    }

    const {  Order, OrderItem, Product, Stock, User, CartItem, Payment } = getModel();

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

    // 3. Calculate total amount in VND
    let totalAmount = 0;
    for (const item of cart.items) {
      const itemPrice = Math.round(parseFloat(item.product?.Price || 0)); // Price in VND as integer
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

    // 5. Create OrderItems - Bulk fetch all products first
    const productIndexes = cart.items.map(item => item.Product_Index ?? item.product?.Index);
    const products = await Product.findAll({
      where: { Index: productIndexes },
      attributes: ['Index', 'Price'],
      transaction
    });

    // Create price map for quick lookup
    const priceMap = new Map(products.map(p => [p.Index, Math.round(parseFloat(p.Price))]));

    const orderItems = [];
    for (const item of cart.items) {
      const prodIndex = item.Product_Index ?? item.product?.Index;
      const productPrice = priceMap.get(prodIndex);

      if (productPrice === undefined) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Product with index ${prodIndex} not found`
        });
      }

      const orderItem = await OrderItem.create({
        Order_Id: order.Order_Id,
        Product_Index: prodIndex,
        Quantity: item.Quantity,
        Amount: productPrice // store as integer for VND
      }, { transaction });
      orderItems.push(orderItem);
    }

    // 6. Clear user's cart
    await CartItem.destroy({ where: { Cart_Id: cart.Cart_Id } }, { transaction });

    // 7. Update stock quantities
    for (const update of stockUpdates) {
      const newQty = update.stock.Quantity - update.deductQuantity;
      await update.stock.update({ Quantity: newQty }, { transaction });
    }

    // 8. create Payment in my database for logs
    await Payment.create({
      Order_Id: order.Order_Id,
      User_Id: userId,
      Amount: totalAmount,
      Status: 'pending',
      Type: 'stripe'
    }, { transaction });

    // Set order data for next middleware
    req.order = order;
    req.orderItems = orderItems.map((item, index) => ({
      Order_Id: item.Order_Id,
      Product_Index: item.Product_Index,
      Quantity: item.Quantity,
      Amount: item.Amount,
      productName: cart.items[index].product?.Name || 'Unknown'
    }));
    req.totalAmount = totalAmount;
    req.userId = userId;
    req.transaction = transaction;

    // Call next middleware
    next();

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
    const userId = req.userId;

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
    const userId = req.userId;

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

export const createCODCheckout = async (req, res) => {
  try {
    const { userId } = req;
    const { Order_Id: orderId } = req.order;
    const { Payment, Cart, CartItem } = getModel();
    
    await Payment.update(
      { Type: 'cod' }, // Change from 'stripe' to 'cod'
      { 
        where: { Order_Id: orderId, User_Id: userId },
        transaction: req.transaction
      }
    );

    // Clear user's cart
    const cart = await Cart.findOne({ where: { User_Id: userId }, transaction: req.transaction });
    if (cart) {
      await CartItem.destroy({ where: { Cart_Id: cart.Cart_Id } }, { transaction: req.transaction });
    }

    await req.transaction.commit();

    // Respond with success but no redirect URL for COD
    res.json({ 
      success: true,
      orderId: orderId,
      paymentMethod: 'cod',
      message: 'COD order placed successfully'
    });

  } catch (error) {
    console.error("COD Checkout Error:", error);
    if (req.transaction) {
      await req.transaction.rollback();
    }
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to process COD order"
    });
  }
};