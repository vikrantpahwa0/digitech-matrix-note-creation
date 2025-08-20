"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.users, {
        through: models.user_roles,
        foreignKey: "roleId",
        otherKey: "userId",
        as: "users",
      });
    }
  }

  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "roles",
      tableName: "roles",
      timestamps: true,
    }
  );

  return Role;
};
