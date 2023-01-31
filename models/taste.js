"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Taste extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Taste.init(
    {
      name: {
        type: DataTypes.STRING,
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
    }
  );
  return Taste;
};
