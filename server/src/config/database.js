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

export const connectDB = async () => {
  try {
    if (!sequelize) {
      // Use individual env vars instead of a single URL string
      const dbName = process.env.DB_NAME;
      const dbUser = process.env.DB_USER;
      const dbPass = process.env.DB_PASS;
      const dbHost = process.env.DB_HOST;
      const dbPort = process.env.DB_PORT;

      if (!dbName || !dbUser || !dbPass || !dbHost || !dbPort) {
        throw new Error("One or more database environment variables are missing!");
      }

      // Check if it's a local database (localhost or 127.0.0.1)
      const isLocalDB = dbHost === 'localhost' || dbHost === '127.0.0.1';
      
      // For remote DBs, enable SSL
      const dialectOptions = isLocalDB ? {} : {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      };
      
      // Pass a configuration object instead of a URL string
      sequelize = new Sequelize({
        database: dbName,
        username: dbUser,
        password: dbPass,
        host: dbHost,
        port: dbPort,
        dialect: "postgres",
        dialectOptions,
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
