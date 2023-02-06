const Sequelize = require("sequelize");

class Size extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        size: {
          type: Sequelize.STRING(),
          allowNull: false,
          validate: {
            isIn: {
              args: [["100g", "250g", "500g"]],
              msg: "100g, 250g, 500g 중 하나를 고르세요",
            },
          },
        },
        price: {
          type: Sequelize.INTEGER(),
          allowNull: false,
        },
        productId: {
          type: Sequelize.INTEGER(),
          allowNull: false,
          references: {
            model: Sequelize.Product,
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "sizes",
        modelName: "Size",
        timestamps: true,
        paranoid: false,
        underscored: false,
      }
    );
  }
  static associate(db) {
    db.Size.belongsTo(db.Product, {
      foreignKey: "productId",
      targetKey: "id",
      as: "products",
      onDelete: "cascade",
      hooks: true,
    });
  }
}

module.exports = Size;
