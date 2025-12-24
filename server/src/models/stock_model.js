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
    },
    Last_Updated: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "Last_Updated",
    }
  }, {
    tableName: "Stock",
    timestamps: false
  });
};
