"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
    }
  }
  SubCategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [["싱글오리진", "브렌드", "드립백", "생두"]],
            msg: "싱글오리진, 브렌드, 드립백, 생두에서 고르세요!!!",
          },
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "subcategories",
      modelName: "SubCategory",
    }
  );
  return SubCategory;
};
