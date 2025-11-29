import { DataTypes } from "sequelize";

export function Payment(sequelize) {
  return sequelize.define(
    "Payment",
    {
      Payment_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Order_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      User_Id: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      Type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      Status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Pending",
        // Values: "Pending", "Completed", "Failed"
      },
    },
    {
      tableName: "Payment",
      timestamps: false,
    }
  );
}
