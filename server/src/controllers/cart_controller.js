import { getModel } from "../config/database.js";

const get_all_carts = (res) => {
  const { Cart } = getModel();
  Cart.findAll()
  .then(carts => {
      res.json(carts);
  })
  .catch(err => {
      console.error("Error fetching carts:", err);
      res.status(500).json({ error: "Internal server error" });
  });
};

const get_all_cart_items = (res) => {
  const { CartItem } = getModel();
  CartItem.findAll()
  .then(cartItems => {
      res.json(cartItems);
  })
  .catch(err => {
      console.error("Error fetching cart items:", err);
      res.status(500).json({ error: "Internal server error" });
  });
};

const get_cart_by_id = (id, res) => {
  const { Cart } = getModel();
  const cartId = id;

  Cart.findByPk(cartId)
  .then(cart => {
      if (cart) {
          res.json(cart);
      } else {
          res.status(404).json({ error: "Cart not found" });
      }
  })
  .catch(err => {
      console.error("Error fetching cart:", err);
      res.status(500).json({ error: "Internal server error" });
  });
};

const get_cart_by_user_id = (userId, res) => {
  const { Cart } = getModel();

  Cart.findAll({ where: { User_Id: userId } })
  .then(carts => {
      res.json(carts);
  })
  .catch(err => {
      console.error("Error fetching carts by user ID:", err);
      res.status(500).json({ error: "Internal server error" });
  });
};

const get_all_details_cart_by_user_id = async (userId, res) => {
  try {
    /*
      Source SQL to get cart details by user ID:
      SELECT
        c."Cart_Id",
        c."User_Id",
        c."Status",
        c."created_at",
        ci."Cart_Item_Id",
        ci."Product_Id",
        ci."Quantity",
        p."Index",
        p."Name",
        p."Description",
        p."Price",
        p."Photo_Id"
      FROM "Cart" AS c
      LEFT JOIN "CartItem" AS ci 
      ON c."Cart_Id" = ci."Cart_Id"
      LEFT JOIN "Product" AS p
      ON ci."Product_Id" = p."Product_Id"
      WHERE c."User_Id" = 'U0000001' AND c."Status" = 'active'
      ORDER BY c."Cart_Id", ci."Cart_Item_Id";

      TODO: Implement the above SQL query using Sequelize ORM
    */

    res.status(200).json({
      message: "Not implemented yet",
    });
  } catch (err) {
    console.error("Error fetching cart details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const get_carts = (req, res) => {
  const id = req.params.id || req.query.id;
  const userId = req.params.userId || req.query.userId;
  const type = req.params.type || req.query.type;

  if(type === 'items') {
    // TODO: Implement proper authentication and authorization
    return get_all_cart_items(res);
  }

  if (userId && type === 'details') {
    return get_all_details_cart_by_user_id(userId, res);
  } 
  
  if (id) {
    return get_cart_by_id(id, res);
  } else if (userId) {
    return get_cart_by_user_id(userId, res);
  } else {
    var isAdmin = true; // TODO: Replace with real admin check
    if (isAdmin) {
      return get_all_carts(res);
    }
  }
  return res.status(400).json({ error: "Invalid request parameters" });
}

const create_cart_item = async (items, Cart_Id) => {
  const { CartItem } = getModel();

  try {
    // Validate all items first
    for (let i = 0; i < items.length; i++) {
      if (!items[i].Product_Id || !items[i].Quantity) {
        throw new Error(`Item at index ${i} is missing Product_Id or Quantity`);
      }
    }

    // Add Cart_Id to all items
    const itemsWithCartId = items.map(item => ({
      Cart_Id,
      Product_Id: item.Product_Id,
      Quantity: item.Quantity
    }));

    // Create all items in ONE query using bulkCreate
    const createdItems = await CartItem.bulkCreate(itemsWithCartId);
    return createdItems;
  } catch (err) {
    console.error("Error creating cart items:", err);
    throw err;
  }
};

const create_cart = async (req, res) => {
  try {
    const { Cart } = getModel();
    const newCart = req.body;

    // Validate User_Id
    if (!newCart.User_Id) {
      return res.status(400).json({ error: "User_Id is required" });
    }

    // Check if active cart already exists
    const existingCart = await Cart.findOne({ 
      where: { User_Id: newCart.User_Id, Status: 'active' } 
    });

    if (existingCart) {
      return res.status(400).json({ 
        error: "Active cart for this user already exists",
        existingCartId: existingCart.Cart_Id
      });
    }

    // Set default status if not provided
    if (!newCart.Status) {
      newCart.Status = 'active';
    }

    // Create cart
    const { items, ...cartData } = newCart;
    const createdCart = await Cart.create(cartData);

    // If there are cart items, create them
    if (items && Array.isArray(items) && items.length > 0) {
      const createdItems = await create_cart_item(items, createdCart.Cart_Id);
      return res.status(201).json({ 
        message: "Cart and items created successfully", 
        cart: createdCart,
        items: createdItems
      });
    } else {
      return res.status(201).json({ 
        message: "Cart created successfully", 
        cart: createdCart 
      });
    }
  } catch (err) {
    console.error("Error creating cart:", err);
    return res.status(500).json({ 
      error: "Internal server error",
      details: err.message 
    });
  }
};

const update_cart = (req, res) => {
  const { Cart } = getModel();
  const cartId = req.params.id || req.query.id;
  const updatedData = req.body;

  if(!cartId) {
    return  res.status(400).json({ error: "Cart ID is required" });
  }

  if(!updatedData || Object.keys(updatedData).length === 0) {
    return res.status(400).json({ error: "No data provided for update" });
  }

  Cart.update(updatedData, { where: { Cart_Id: cartId } })
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

const delete_cart = async (req, res) => {
  try {
    const { Cart, CartItem } = getModel();
    const cartId = req.params.id || req.query.id;
    const auth = req.params.auth || req.query.auth;
    
    if(!cartId) {
      return res.status(400).json({ error: "Cart ID is required" });
    }
    
    // TODO: Implement proper authentication and authorization
    if (!auth || auth !== "admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if cart exists
    const cart = await Cart.findOne({ where: { Cart_Id: cartId } });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Delete all cart items associated with this cart
    await CartItem.destroy({ where: { Cart_Id: cartId } });

    // Delete the cart itself
    await Cart.destroy({ where: { Cart_Id: cartId } });

    res.json({ 
      message: "Cart and associated items deleted successfully",
      deletedCartId: cartId
    });
  } catch (err) {
    console.error("Error deleting cart:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export {
  create_cart,
  delete_cart,
  get_carts,
  update_cart
};

