"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product_grinding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product_grinding.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.Product,
          key: "id",
        },
      },
      grinding_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.Grinding,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "product_grinding",
    }
  );
  product_grinding.beforeBulkDestroy(() => {
    console.log("product_grinding has been destroyed");
  });
  return product_grinding;
};
