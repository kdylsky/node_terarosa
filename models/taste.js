const Sequelize = require("sequelize");

class Taste extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isIn: {
              args: [["Apple", "Mango", "Grape", "Banana", "Peach"]],
              msg: "Apple, Mango, Grape, Banana, Peach에서 고르세요!!!",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "tastes",
        modelName: "Taste",
        timestamps: true,
        paranoid: false,
        underscored: false,
      }
    );
  }
  static associate(db) {
    db.Taste.belongsToMany(db.Product, {
      through: "ProductTaste",
      foreignKey: "tasteId",
      as: "products",
      // userDetail도 없어도 될거 같다
      // onDelete: "CASCADE",
      // onUpdate: "CASCADE",
      // hooks: true,
    });
  }
}

module.exports = Taste;
