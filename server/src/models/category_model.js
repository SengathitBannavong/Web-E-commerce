import { DataTypes } from "sequelize";

export function Category(sequelize) {
  return sequelize.define("Category", {
      Category_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Photo_Id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Category",
      timestamps: false,
    }
  );
}
