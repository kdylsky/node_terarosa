const Sequelize = require("sequelize");

class Category extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(),
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
        // 두번째 객체 인수는 테이블 자체에 대한 설정
        sequelize /* static init 메서드의 매개변수와 연결되는 옵션으로, db.sequelize 객체를 넣어야 한다. */,
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        modelName: "Category" /* 모델 이름을 설정. */,
        tableName: "categories" /* 데이터베이스의 테이블 이름. */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
        // charset: "utf8" /* 인코딩 */,
        // collate: "utf8_general_ci",
      }
    );
  }

  // 다른 모델과의 관계
  static associate(db) {
    // 인자로 index.js에서 만든 여러 테이블이 저장되어있는 db객체를 받을 것이다.
    // 양쪽에 cascade를 넣고 hooks을 걸어주면 무한 루프에 빠질 수 있다.
    db.Category.hasMany(db.SubCategory, {
      foreignKey: "categoryId",
      sourceKey: "id",
      as: "subcategories",
      // 유저 쪽은 cascade가 없어도 될거 같다.
      // onDelete: "CASCADE",
      // onUpdate: "CASCADE",
      // hooks: true,
    });
  }
}

module.exports = Category;
