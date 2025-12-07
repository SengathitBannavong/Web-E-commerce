import { Sequelize } from "sequelize";
import { CartItem } from "../models/cart_item_model.js";
import { Cart } from "../models/cart_model.js";
import { Category } from "../models/category_model.js";
import { OrderItem } from "../models/order_item_model.js";
import { Order } from "../models/order_model.js";
import { Payment } from "../models/payment_model.js";
import { Product } from "../models/product_model.js";
import { Stock } from "../models/stock_model.js";
import { User } from "../models/user_model.js";
import { setupAssociations } from "./associations.js";
import { initializeAdmin } from "./env.js";

let sequelize = null;
let models = {};

export const connectDB = async (dbUrl) => {
  try {
    if (!sequelize) {
      if (!dbUrl) throw new Error("Database URL not provided!");
      
      sequelize = new Sequelize(dbUrl, {
        dialect: "postgres",
        logging: false,
      });
    }
    await sequelize.authenticate();
    console.log("[INFO] Database connected!");

    // Initialize models
    models = {
      User: User(sequelize),
      Product: Product(sequelize),
      Category: Category(sequelize),
      Order: Order(sequelize),
      OrderItem: OrderItem(sequelize),
      Cart: Cart(sequelize),
      CartItem: CartItem(sequelize),
      Payment: Payment(sequelize),
      Stock: Stock(sequelize),
    };

    // Setup associations
    setupAssociations(models);

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log("[INFO] Database synchronized!");

    // Initialize admin user
    await initializeAdmin(models);

    return sequelize;
  } catch (error) {
    console.error("[ERROR] Database connection failed:", error.message);
    throw error;
  }
};

export const getModel = () => {
  if(!models) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return models;
};

export const getDB = () => sequelize;
