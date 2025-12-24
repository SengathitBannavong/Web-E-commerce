export const setupAssociations = (models) => {
  const { User, Product, Category, Order, OrderItem, Cart, CartItem, Payment, Stock } = models;

  // User ↔ Order (One-to-Many)
  // One user can have many orders
  User.hasMany(Order, {
    foreignKey: 'User_Id',
    sourceKey: 'User_Id',
    as: 'orders'
  });
  Order.belongsTo(User, {
    foreignKey: 'User_Id',
    targetKey: 'User_Id',
    as: 'user'
  });

  // User ↔ Cart (One-to-Many)
  // One user can have many carts (active, archived, etc.)
  User.hasMany(Cart, {
    foreignKey: 'User_Id',
    sourceKey: 'User_Id',
    as: 'carts'
  });
  Cart.belongsTo(User, {
    foreignKey: 'User_Id',
    targetKey: 'User_Id',
    as: 'user'
  });

  // Order ↔ OrderItem (One-to-Many)
  // One order contains many order items
  Order.hasMany(OrderItem, {
    foreignKey: 'Order_Id',
    as: 'items'
  });
  OrderItem.belongsTo(Order, {
    foreignKey: 'Order_Id',
    as: 'order'
  });

  // Product ↔ OrderItem (One-to-Many)
  // One product can appear in many order items (use Index as key)
  Product.hasMany(OrderItem, {
    foreignKey: 'Product_Index',
    sourceKey: 'Index',
    as: 'orderItems'
  });
  OrderItem.belongsTo(Product, {
    foreignKey: 'Product_Index',
    targetKey: 'Index',
    as: 'product'
  });

  // Order ↔ Product (Many-to-Many through OrderItem)
  // Orders can have many products, products can be in many orders
  Order.belongsToMany(Product, {
    through: OrderItem,
    foreignKey: 'Order_Id',
    otherKey: 'Product_Index',
    as: 'products'
  });
  Product.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: 'Product_Index',
    otherKey: 'Order_Id',
    as: 'orders'
  });

  // Cart ↔ CartItem (One-to-Many)
  // One cart contains many cart items
  Cart.hasMany(CartItem, {
    foreignKey: 'Cart_Id',
    as: 'items'
  });
  CartItem.belongsTo(Cart, {
    foreignKey: 'Cart_Id',
    as: 'cart'
  });

  // Product ↔ CartItem (One-to-Many)
  // One product can appear in many cart items (use Index as key)
  Product.hasMany(CartItem, {
    foreignKey: 'Product_Index',
    sourceKey: 'Index',
    as: 'cartItems'
  });
  CartItem.belongsTo(Product, {
    foreignKey: 'Product_Index',
    targetKey: 'Index',
    as: 'product'
  });

  // Cart ↔ Product (Many-to-Many through CartItem)
  // Carts can have many products, products can be in many carts
  Cart.belongsToMany(Product, {
    through: CartItem,
    foreignKey: 'Cart_Id',
    otherKey: 'Product_Index',
    as: 'products'
  });
  Product.belongsToMany(Cart, {
    through: CartItem,
    foreignKey: 'Product_Index',
    otherKey: 'Cart_Id',
    as: 'carts'
  });

  // Category ↔ Product (One-to-Many)
  // One category can have many products
  Category.hasMany(Product, {
    foreignKey: 'Category_Id',
    as: 'products'
  });
  Product.belongsTo(Category, {
    foreignKey: 'Category_Id',
    as: 'category'
  });

  // Payment ↔ Order (Many-to-One)
  // Many payments can belong to one order
  Order.hasMany(Payment, {
    foreignKey: 'Order_Id',
    as: 'payments'
  });
  Payment.belongsTo(Order, {
    foreignKey: 'Order_Id',
    as: 'order'
  });

  // Payment ↔ User (Many-to-One)
  // Many payments can belong to one user
  User.hasMany(Payment, {
    foreignKey: 'User_Id',
    sourceKey: 'User_Id',
    as: 'payments'
  });
  Payment.belongsTo(User, {
    foreignKey: 'User_Id',
    targetKey: 'User_Id',
    as: 'user'
  });

  // Stock ↔ Product (One-to-One)
  // One product can have one stock record
  Product.hasOne(Stock, {
    foreignKey: 'Product_Index',
    sourceKey: 'Index',
    as: 'stock'
  });
  Stock.belongsTo(Product, {
    foreignKey: 'Product_Index',
    targetKey: 'Index',
    as: 'product'
  });

  console.log('[INFO] Database associations have been set up successfully');
};
