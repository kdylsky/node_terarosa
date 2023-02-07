const Sequelize = require("sequelize");

class Order extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        orderStatus: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isIn: {
              args: [
                ["결제전", "결제완료", "배송준비중", "배송중", "배송완료"],
              ],
              msg: "[결제전, 결제완료, 배송 준비중, 배송중, 배송완료 중 하나를 고르세요",
            },
          },
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
    db.Order.belongsToMany(db.Product, {
      through: db.OrderItem,
      foreignKey: "orderId",
      as: "products",
    });
  }
}

module.exports = Order;
