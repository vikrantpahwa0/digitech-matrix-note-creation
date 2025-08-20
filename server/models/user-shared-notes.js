"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserSharedNote extends Model {
    static associate(models) {
      UserSharedNote.belongsTo(models.notes, {
        foreignKey: "noteId",
        as: "note",
      });
      UserSharedNote.belongsTo(models.users, {
        foreignKey: "sharedBy",
        as: "sharer",
      });
      UserSharedNote.belongsTo(models.roles, {
        foreignKey: "roleId",
        as: "role",
      });
      UserSharedNote.belongsTo(models.users, {
        foreignKey: "userId",
        as: "recipient",
      });
    }
  }

  UserSharedNote.init(
    {
      noteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "notes",
          key: "id",
        },
      },
      sharedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "roles",
          key: "id",
        },
      },
      userId: {
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
      modelName: "UserSharedNote",
      tableName: "user_shared_notes",
      timestamps: true,
    }
  );

  return UserSharedNote;
};
