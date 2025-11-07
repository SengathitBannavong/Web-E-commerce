import { DataTypes } from "sequelize";

export const Cart = (sequelize) => {
  return sequelize.define("Cart", {
    Cart_Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Cart_Id",
    },
    User_Id: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: "User_Id",
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Status",
      defaultValue: "active"
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    }
  }, {
    tableName: "Cart",
    timestamps: false
  });
};
