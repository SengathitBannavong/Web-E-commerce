import { DataTypes } from "sequelize";

export const Order = (sequelize) => {
  return sequelize.define("Order", {
    Order_Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Order_Id",
    },
    User_Id: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: "User_Id",
    },
    Date: {
      type: DataTypes.DATE,
      field: "Date",
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Status",
      defaultValue: "pending"
      // Values: "pending", "cancelled", "paid"
    },
    Amount: {
      type: DataTypes.DECIMAL(10, 2),
      field: "Amount",
    },
  }, {
    tableName: "Order",
    timestamps: false
  });
};
