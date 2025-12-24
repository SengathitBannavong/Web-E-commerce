import { DataTypes } from "sequelize";

export const OrderItem = (sequelize) => {
  return sequelize.define("Order_Item", {
    Order_Item_Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Order_Item_Id",
    },
    Order_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "Order_Id",
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
    Amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "Amount",
    },
  }, {
    tableName: "Order_Item",
    timestamps: false
  });
};
