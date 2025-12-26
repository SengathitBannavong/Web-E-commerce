import { DataTypes } from "sequelize";

export const Stock = (sequelize) => {
  return sequelize.define("Stock", {
    Stock_Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Stock_Id",
    },
    Product_Index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "Product_Index",
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "Quantity",
    }
  }, {
    tableName: "Stock",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
};
