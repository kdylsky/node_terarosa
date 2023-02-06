const Sequelize = require("sequelize");

class Cart extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: Sequelize.User,
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
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        size: {
          type: Sequelize.STRING(),
          allowNull: false,
        },
        grinding: {
          type: Sequelize.STRING(),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Cart",
        tableName: "carts",
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
      }
    );
  }

  static associate(db) {
    db.Cart.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
      as: "user",
      ondelete: "cascade",
    });

    db.Cart.belongsTo(db.Product, {
      foreignKey: "productId",
      targetKey: "id",
      as: "product",
      ondelete: "cascade",
    });
  }
}

module.exports = Cart;
