"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Grinding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Product, {
        through: "product_grinding",
        foreignKey: "grinding_id",
        as: "products",
      });
    }
  }
  Grinding.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [
              ["갈지않음", "에스프레소", "모카포트", "드립", "프렌치프레스"],
            ],
            msg: "갈지않음, 에스프레소, 모카포트, 드립, 프렌치프레스에서 고르세요!!!",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "grindings",
      modelName: "Grinding",
    }
  );
  return Grinding;
};
