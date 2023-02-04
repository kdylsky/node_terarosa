const Sequelize = require("sequelize");

class SubCategory extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(),
          allowNull: false,
          validate: {
            isIn: {
              args: [["싱글오리진", "브렌드", "드립백", "생두"]],
              msg: "싱글오리진, 브렌드, 드립백, 생두에서 고르세요!!!",
            },
          },
        },
        categoryId: {
          type: Sequelize.INTEGER(),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "subcategories",
        modelName: "SubCategory",
        // 두번째 객체 인수는 테이블 자체에 대한 설정
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
      }
    );
  }

  // 다른 모델과의 관계
  static associate(db) {
    // 인자로 index.js에서 만든 여러 테이블이 저장되어있는 db객체를 받을 것이다.
    // 양쪽에 cascade를 넣고 hooks을 걸어주면 무한 루프에 빠질 수 있다.
    db.SubCategory.belongsTo(db.Category, {
      foreignKey: "categoryId",
      targetKey: "id",
      as: "category",
      // 유저 쪽은 cascade가 없어도 될거 같다.
      // onDelete: "CASCADE",
      // onUpdate: "CASCADE",
      // hooks: true,
    });
    db.SubCategory.hasMany(db.Product, {
      foreignKey: "subCategoryId",
      sourceKey: "id",
      as: "products",
    });
  }
}

module.exports = SubCategory;
