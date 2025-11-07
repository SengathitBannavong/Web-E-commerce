import { DataTypes } from "sequelize";

export const Product = (sequelize) => {
  return sequelize.define("Product", {
    Index: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Index",
    },
    Product_Id: {
      type: DataTypes.STRING(8),
      unique: true,
      allowNull: false,
      field: "Product_Id",
    },
    Name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: "Name",
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "Description",
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      field: "Price",
      nonNull: true
    },
    Photo_Id: {
      type: DataTypes.STRING(8),
      field: "Photo_Id"
    },
    Category_Id: {
      type: DataTypes.INTEGER,
      field: "Category_Id"
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    }
  }, {
    tableName: "Product",
    timestamps: false
  });
};
