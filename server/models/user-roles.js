"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      UserRole.belongsTo(models.users, { foreignKey: "userId", as: "user" });
      UserRole.belongsTo(models.roles, { foreignKey: "roleId", as: "role" });
      UserRole.belongsTo(models.users, {
        foreignKey: "updatedBy",
        as: "updater",
      }); // reference updatedBy
    }
  }

  UserRole.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "user_roles",
      tableName: "user_roles",
      timestamps: true,
    }
  );

  return UserRole;
};
