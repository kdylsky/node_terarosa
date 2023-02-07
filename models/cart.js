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
          type: Sequelize.INTEGER(),
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
        userName: {
          type: Sequelize.STRING(),
          allowNull: false,
        },
        // 가상 속성 만들기
        totalPrice: {
          type: Sequelize.VIRTUAL(),
        },
        // totlaPrice: {
        //   type: Sequelize.VIRTUAL(),
        //   async get(value) {
        //     const products = await this.getProduct({});
        //     const sizes = await products.getSizes({
        //       where: { size: this.size },
        //     });
        //     return sizes[0].price * this.quantity;
        //   },
        //   set(value) {
        //     throw new Error("Do not try to set the `fullName` value!");
        //   },
        // },
      },
      {
        sequelize,
        modelName: "Cart",
        tableName: "carts",
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
        hooks: {
          afterFind: async (record, options) => {
            if (Array.isArray(record)) {
              for (let cart of record) {
                console.log(cart.size);
                const product = await cart.getProduct();
                const size = await product.getSizes({
                  where: { size: cart.size },
                });
                cart.totalPrice = size[0].price * cart.quantity;
              }
            } else {
              const product = await record.getProduct();
              const size = await product.getSizes({});

              record.totalPrice = size[0].price * record.quantity;
            }
          },
        },
      }
    );
  }

  static associate(db) {
    db.Cart.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
      as: "user",
      onDelete: "cascade",
    });

    db.Cart.belongsTo(db.Product, {
      foreignKey: "productId",
      targetKey: "id",
      as: "product",
      onDelete: "cascade",
      hooks: true,
    });
  }
}

module.exports = Cart;
