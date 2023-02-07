const Sequelize = require("sequelize");

class Status extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "결제 전",
          validate: {
            isIn: [
              ["결제 전", "결제 완료", "배송 준비 중", "배송 중", "배송 완료"],
            ],
          },
        },
      },
      {
        sequelize,
        tableName: "statuses",
        modelName: "Status",
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
      }
    );
  }

  static associate(db) {
    db.Status.hasMany(db.Order, {
      foreignKey: "statusId",
      sourceKey: "id",
      as: "orders",
      hooks: true,
    });
  }
}

module.exports = Status;
