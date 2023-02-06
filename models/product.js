const Sequelize = require("sequelize");
const Taste = require("./taste");
const Grinding = require("./grinding");

class Product extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(),
          allowNull: false,
        },
        roastingDate: {
          type: Sequelize.STRING(),
          allowNull: false,
        },
        subCategoryId: {
          type: Sequelize.INTEGER(),
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER(),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "products",
        modelName: "Product",
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
      }
    );
  }

  async findAndDelete(req_lists, Model) {
    for (let item of req_lists) {
      let item_obj = await Model.findOne({
        where: { name: item },
      });
      if (Model === Grinding) {
        this.removeGrinding(item_obj);
      } else if (Model === Taste) {
        this.removeTastes(item_obj);
      }
    }
  }

  static associate(db) {
    db.Product.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
      as: "user",
    });

    db.Product.belongsTo(db.SubCategory, {
      foreignKey: "subCategoryId",
      targetKey: "id",
      as: "subcategory",
    });

    db.Product.hasMany(db.Size, {
      foreignKey: "productId",
      sourceKey: "id",
      as: "sizes",
      //onDelete:"cascade",
      //hooks:true
    });

    db.Product.hasMany(db.Cart, {
      foreignKey: "productId",
      sourceKey: "id",
      as: "carts",
    });

    db.Product.belongsToMany(db.Taste, {
      through: "ProductTaste",
      foreignKey: "productId",
      as: "tastes",
    });

    db.Product.belongsToMany(db.Grinding, {
      through: "ProductGrinding",
      foreignKey: "productId",
      as: "grindings",
    });
  }
}

module.exports = Product;
