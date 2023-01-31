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
    }
  }
  Size.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [["100g", "500g", "1kg"]],
            msg: "100g, 500g, 1kg 중 하나를 고르세요",
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
