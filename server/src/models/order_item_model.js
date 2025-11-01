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
      field: "Order_Id",
      nonNull: true
    },
    Product_Id: {
      type: DataTypes.STRING(8),
      field: "Product_Id",
      nonNull: true
    },
    Quantity: {
      type: DataTypes.INTEGER,
      field: "Quantity",
      nonNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(10, 2),
      field: "Amount",
      nonNull: true
    },
  }, {
    tableName: "Order_Item",
    timestamps: false
  });
};
