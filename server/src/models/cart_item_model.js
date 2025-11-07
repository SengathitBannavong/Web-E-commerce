import { DataTypes } from "sequelize";

export const CartItem = (sequelize) => {
  return sequelize.define("CartItem", {
    Cart_Item_Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Cart_Item_Id",
    },
    Cart_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "Cart_Id",
    },
    Product_Id: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: "Product_Id",
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "Quantity",
    }
  }, {
    tableName: "CartItem",
    timestamps: false
  });
};
