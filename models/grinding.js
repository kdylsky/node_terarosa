const Sequelize = require("sequelize");

class Grinding extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(),
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
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
      }
    );
  }
  static associate(db) {
    db.Grinding.belongsToMany(db.Product, {
      through: "ProductGrinding",
      foreignKey: "grindingId",
      as: "products",
    });
  }
}

module.exports = Grinding;
