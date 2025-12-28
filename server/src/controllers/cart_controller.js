import { getModel } from "../config/database.js";

// ==================== CART MIDDLEWARE ====================
const getActiveCart = async (req, res, next) => {
  try {
    const { Cart, CartItem, Product } = getModel();

    const cart = await Cart.findOne({
      where: { 
        User_Id: req.userId, 
        Status: 'active' 
      },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['Product_Id', 'Index', 'Name', 'Description', 'Price', 'Photo_Id'] // Price in VND
            }
          ]
        }
      ],
      order: [
        ['Cart_Id', 'ASC'],
        [{ model: CartItem, as: 'items' }, 'Cart_Item_Id', 'ASC']
      ]
    });

    if (!cart) {
      return res.status(404).json({ error: "No active cart found" });
    }

    req.cart = cart;
    next();
  } catch (err) {
    console.error("Error fetching active cart:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ==================== CART VALIDATION ====================
const validateCartFields = (fields, isUpdate = false) => {
  const errors = [];

  // For create, User_Id is required
  if (!isUpdate && !fields.User_Id) {
    errors.push("User_Id is required");
  }

  // Validate Status if provided
  if (fields.Status !== undefined) {
    const validStatuses = ['active', 'completed'];
    if (!validStatuses.includes(fields.Status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== CART ITEM VALIDATION ====================
const validateCartItemFields = (fields, isUpdate = false) => {
  const errors = [];

  // For create, Cart_Id and Product_Id (product code) are required
  if (!isUpdate) {
    if (!fields.Cart_Id) {
      errors.push("Cart_Id is required");
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

const get_all_details_cart_by_user_id = async (req, res) => {
  const userId = req.userId;

  try {
    const { Cart, CartItem, Product } = getModel();

    const cart = await Cart.findOne({
      where: { 
        User_Id: userId, 
        Status: 'active' 
      },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['Product_Id', 'Index', 'Name', 'Description', 'Price', 'Photo_Id'] // Price in VND
            }
          ]
        }
      ],
      order: [
        ['Cart_Id', 'ASC'],
        [{ model: CartItem, as: 'items' }, 'Cart_Item_Id', 'ASC']
      ]
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    return res.status(200).json({
      message: "Cart details fetched successfully",
      data: cart
    });
  } catch (err) {
    console.error("Error fetching cart details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const get_cart = (req, res) => {
  const userId = req.userId;
  const status = req.query.status || 'active';

  // userId or status not exist
  if(!userId) {
    return res.status(400).json({ 
      error: "User ID is required",
    });
  }

  if(!['active', 'completed'].includes(status)) {
    return res.status(402).json({ 
      error: "Invalid status value",
      valid_statuses: ["active", "completed"],
    });
  }

  const { Cart } = getModel();
  try {
    Cart.findOne({ where: { User_Id: userId, Status: status } })
    .then(cart => {
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      } else {
        return res.status(200).json({
          message: "Cart fetched successfully",
          data: cart
        });
      }
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

}

// ==================== CART ITEM CRUD ====================
const get_cart_items_by_cart_id = async (req, res) => {
  const { CartItem, Product } = getModel();
  const cartId = req.params.cartId;

  if (!cartId) {
    return res.status(400).json({ error: "Cart ID is required" });
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [total, cartItems] = await Promise.all([
      CartItem.count({ where: { Cart_Id: cartId } }),
      CartItem.findAll({
        where: { Cart_Id: cartId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['Product_Id', 'Index', 'Name', 'Description', 'Price', 'Photo_Id']
          }
        ],
        limit,
        offset,
        order: [['Cart_Item_Id', 'ASC']]
      })
    ]);

    const totalPage = Math.ceil(total / limit);

    return res.status(200).json({
      totalPage,
      total,
      data: cartItems
    });
  } catch (err) {
    console.error("Error fetching cart items:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const create_cart_item = async (req, res) => {
  const { CartItem, Product } = getModel();
  const cartId = req.cart.Cart_Id;
  const productId = req.params.productId;
  const { quantity } = req.body;

  if (!cartId) {
    return res.status(400).json({ error: "Cart ID is required" });
  }

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  if (!quantity || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ error: "Quantity must be a positive number" });
  }

  try {
    // Check if product exists and get its index
    const product = await Product.findOne({ where: { Product_Id: productId }, attributes: ['Product_Id', 'Index'] });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productIndex = product.Index;

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: { Cart_Id: cartId, Product_Index: productIndex }
    });

    let result;
    if (existingItem) {
      // Update existing item by adding quantity
      const newQuantity = existingItem.Quantity + quantity;
      await existingItem.update({ Quantity: newQuantity });
      result = existingItem;
    } else {
      // Create new item
      result = await CartItem.create({
        Cart_Id: cartId,
        Product_Index: productIndex,
        Quantity: quantity
      });
    }

    return res.status(201).json({
      message: existingItem ? "Cart item updated successfully" : "Cart item created successfully",
      data: result
    });
  } catch (err) {
    console.error("Error creating/updating cart item:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const update_cart_item = async (req, res) => {
  const { CartItem, Product } = getModel();
  const cartId = req.cart.Cart_Id;
  const productId = req.params.productId;
  const { quantity } = req.body;

  if (!cartId) {
    return res.status(400).json({ error: "Cart ID is required" });
  }

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  if( quantity === undefined ) {
    return res.status(400).json({ error: "Quantity is required" });
  }

  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ error: "Quantity must be a positive number and type number"});
  }

  try {
    // Check if product exists and get its index
    const product = await Product.findOne({ where: { Product_Id: productId }, attributes: ['Product_Id', 'Index'] });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productIndex = product.Index;

    // Find the cart item
    const cartItem = await CartItem.findOne({
      where: { Cart_Id: cartId, Product_Index: productIndex }
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Update the quantity
    await cartItem.update({ Quantity: quantity });

    return res.status(200).json({
      message: "Cart item updated successfully",
      data: cartItem
    });
  } catch (err) {
    console.error("Error updating cart item:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const delete_cart_item = async (req, res) => {
  const { CartItem, Product } = getModel();
  const cartId = req.cart.Cart_Id;
  const productId = req.params.productId;

  if (!cartId) {
    return res.status(400).json({ error: "Cart ID is required" });
  }

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    // Check if product exists and get its index
    const product = await Product.findOne({ where: { Product_Id: productId }, attributes: ['Product_Id', 'Index'] });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productIndex = product.Index;

    // Find the cart item
    const cartItem = await CartItem.findOne({
      where: { Cart_Id: cartId, Product_Index: productIndex }
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Delete the cart item
    await CartItem.destroy({ where: { Cart_Item_Id: cartItem.Cart_Item_Id } });

    return res.status(200).json({
      message: "Cart item deleted successfully",
      deletedCartItemId: cartItem.Cart_Item_Id
    });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ==================== CART CRUD ====================

const create_cart = async (req, res) => {
  try {
    const { Cart } = getModel();
    const newCart = req.body;

    // Validate fields
    const validation = validateCartFields(newCart, false);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if active cart already exists
    const existingCart = await Cart.findOne({ 
      where: { User_Id: newCart.User_Id, Status: 'active' } 
    });

    if (existingCart) {
      return res.status(409).json({ 
        error: "Active cart for this user already exists",
        existingCartId: existingCart.Cart_Id
      });
    }

    // Create only active carts
    newCart.Status = 'active';

    // Create cart
    const createdCart = await Cart.create(newCart);
    return res.status(201).json({ 
      message: "Cart created successfully", 
      data: createdCart 
    });
  } catch (err) {
    console.error("Error creating cart:", err);
    return res.status(500).json({ 
      error: "Internal server error",
      details: err.message 
    });
  }
};

const update_cart = async (req, res) => {
  const { Cart } = getModel();
  const userId = req.userId;
  const updatedData = req.body;

  if (!updatedData || Object.keys(updatedData).length === 0) {
    return res.status(400).json({ error: "No data provided for update" });
  }

  // Validate fields
  const validation = validateCartFields(updatedData, true);
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }

  Cart.update(updatedData, { where: { User_Id: userId } })
  .then(([updated]) => {
      if (updated) {
          res.json({ message: "Cart updated successfully" });
      } else {
          res.status(404).json({ error: "Cart not found" });
      }
  })
  .catch(err => {
      console.error("Error updating cart:", err);
      res.status(500).json({ error: "Internal server error" });
  });
};

const delete_all_cart = async (req, res) => {
  try {
    const { Cart, CartItem } = getModel();
    const userId = req.userId;
    let status = req.query.status;
    let res_message = [];
    
    // Authentication and authorization handled by middleware

    if(!status) {
      status = 'active';
      res_message.push("No status provided, defaulting to 'active'");
    }

    // Check if cart exists
    const carts = await Cart.findAll({ where: { User_Id: userId, Status: status } });
    if (!carts || carts.length === 0) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Get all cart IDs
    const cartIds = carts.map(cart => cart.Cart_Id);

    // Delete all cart items associated with these carts
    await CartItem.destroy({ where: { Cart_Id: cartIds } });

    // Delete the carts themselves
    await Cart.destroy({ where: { User_Id: userId, Status: status } });
    
    res.json({ 
      message: "Cart and associated items deleted successfully",
      deletedUserId: userId,
      deletedCartCount: carts.length,
      info: res_message.length > 0 ? res_message : 'nothing additional'
    });
  } catch (err) {
    console.error("Error deleting cart:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const delete_all_cart_items = async (req, res) => {
  const { CartItem } = getModel();
  const cartId = req.cart.Cart_Id;

  if (!cartId) {
    return res.status(400).json({ error: "Cart Access Denied" });
  }

  try {
    // Delete all cart items associated with this cart
    await CartItem.destroy({ where: { Cart_Id: cartId } });

    return res.status(200).json({
      message: "All cart items deleted successfully",
      deletedCartId: cartId
    });
  } catch (err) {
    console.error("Error deleting cart items:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export {
  // Cart functions
  create_cart,
  // Cart Item functions
  create_cart_item, delete_all_cart, delete_all_cart_items, delete_cart_item, get_all_details_cart_by_user_id, get_cart,
  get_cart_items_by_cart_id,
  // Middleware
  getActiveCart, update_cart, update_cart_item
};

