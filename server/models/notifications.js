const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Each notification belongs to a user
      Notification.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  Notification.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      notificationMessage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "notifications",
      tableName: "notifications",
      timestamps: true, // optional: createdAt & updatedAt
    }
  );

  return Notification;
};
