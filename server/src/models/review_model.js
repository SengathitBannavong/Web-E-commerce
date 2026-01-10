import { DataTypes } from "sequelize";

export const Review = (sequelize) => {
  return sequelize.define("Review", {
    Index: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Index",
    },
    Review_Id: {
      type: DataTypes.STRING(8),
      unique: true,
      allowNull: false,
      field: "Review_Id",
    },
    User_Id: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: "User_Id",
    },
    Product_Id: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: "Product_Id",
    },
    Rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      },
      field: "Rating",
    },
    Title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "Title",
    },
    Content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "Content",
    },
    Status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'approved',
      allowNull: false,
      field: "Status",
    },
    Helpful_Count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: "Helpful_Count",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    }
  }, {
    tableName: "Review",
    timestamps: false,
    indexes: [
      {
        fields: ['Product_Id']
      },
      {
        fields: ['User_Id']
      },
      {
        unique: true,
        fields: ['User_Id', 'Product_Id'],
        name: 'unique_user_product_review'
      }
    ]
  });
};