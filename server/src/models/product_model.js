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
      type: DataTypes.STRING,
      allowNull: false,
      field: "Name",
    },
    Author: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: "Author",
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "Description",
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "Price",
      comment: "Price in VND"
    },
    Photo_Id: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "Photo_Id",
    },
    Category_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "Category_Id",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    }
  }, {
    tableName: "Product",
    timestamps: false
  });
};
