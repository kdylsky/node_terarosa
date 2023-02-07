const Sequelize = require("sequelize");

class Order extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        statusId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "orders",
        modelName: "Order",
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
      }
    );
  }

  static associate(db) {
    db.Order.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
      as: "user",
      onDelete: "cascade",
    });
    db.Order.belongsTo(db.Status, {
      foreignKey: "statusId",
      targetKey: "id",
      as: "status",
      onDelete: "cascade",
    });
    db.Order.belongsToMany(db.Product, {
      through: db.OrderItem,
      foreignKey: "orderId",
      as: "products",
    });
  }
}

module.exports = Order;
