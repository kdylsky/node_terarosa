const Sequelize = require("sequelize");

class OrderItem extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        orderId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: Sequelize.Order,
            key: "id",
          },
        },
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: Sequelize.Product,
            key: "id",
          },
        },
        sizeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: Sequelize.Size,
            key: "id",
          },
        },
        grindingId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: Sequelize.Grinding,
            key: "id",
          },
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "orderitems",
        modelName: "OrderItem",
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
      }
    );
  }
  static associate(db) {
    db.OrderItem.belongsTo(db.Product, {
      foreignKey: "productId",
      targetKey: "id",
    });
    db.OrderItem.belongsTo(db.Order, {
      foreignKey: "orderId",
      targetKey: "id",
    });
    db.OrderItem.belongsTo(db.Size, {
      foreignKey: "sizeId",
      targetKey: "id",
    });
    db.OrderItem.belongsTo(db.Grinding, {
      foreignKey: "grindingId",
      targetKey: "id",
    });
  }
}

module.exports = OrderItem;
