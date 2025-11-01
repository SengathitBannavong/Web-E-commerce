import { Sequelize } from "sequelize";

let sequelize = null;

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
    console.log("✅ Database connected!");

    return sequelize;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

export const getDB = () => sequelize;
