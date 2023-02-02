"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      this.belongsTo(models.SubCategory, {
        foreignKey: "subCategoryId",
        as: "subcategory",
      });
      this.hasMany(models.Size, {
        foreignKey: "productId",
        as: "sizes",
      });
      this.belongsToMany(models.Taste, {
        through: "product_taste",
        foreignKey: "product_id",
        as: "tastes",
      });
      this.belongsToMany(models.Grinding, {
        through: "product_grinding",
        foreignKey: "product_id",
        as: "grindings",
      });
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roastingDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "products",
      modelName: "Product",
    }
  );
  return Product;
};
