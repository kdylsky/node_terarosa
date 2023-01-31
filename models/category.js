"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.SubCategory, {
        foreignKey: "categoryId",
        as: "subcategories",
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [["커피", "식품"]],
            msg: "커피 또는 식품 둘 중 하나를 고르세요",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "categories",
      modelName: "Category",
    }
  );
  return Category;
};
