import { DataTypes } from "sequelize";

export const User = (sequelize) => {
  return sequelize.define("User", {
    Index: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Index",
    },
    User_Id: {
      type: DataTypes.STRING(8),
      field: "User_Id",
      unique: true,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: "Name",
    },
    Email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
      field: "Email",
    },
    Password: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: "Password",
    },
    Address: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: "Address",
    },
    PhoneNumber: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: "PhoneNumber",
    },
    Gender: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: "Gender",
    },
    Role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "Role",
    },
    Photo_Id: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "Photo_Id",
    },
    Photo_URL: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "Photo_URL",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  }, {
    tableName: "User",
    timestamps: false
  });
};
