"use strict";
const { Model, SequelizeScopeError } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, {
        foreignKey: "productID",
        as: "_size",
      });
    }
  }
  Size.init(
    {
      size: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [["100g", "250g", "500g"]],
            msg: "100g, 250g, 500g 중 하나를 고르세요",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "sizes",
      modelName: "Size",
    }
  );
  return Size;
};
