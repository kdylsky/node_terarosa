const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(),
          allowNull: false,
        },
        username: {
          type: Sequelize.STRING(),
          unique: true,
          allowNull: false,
          validate: {
            async customValidator(value) {
              const user = await User.findOne({ where: { username: value } });
              if (user) {
                throw new Error("이미 존재하는 유저이름입니다.");
              }
            },
          },
        },
        password: {
          type: Sequelize.STRING(),
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(),
          unique: true,
          allowNull: false,
          validate: {
            async customValidator(value) {
              const user = await User.findOne({ where: { email: value } });
              if (user) {
                throw new Error("이미 존재하는 이메일 주소입니다.");
              }
            },
          },
        },
        phone_number: {
          type: Sequelize.STRING(),
          unique: true,
          allowNull: false,
          validate: {
            async customValidator(value) {
              const user = await User.findOne({
                where: { phone_number: value },
              });
              if (user) {
                throw new Error("이미 존재하는 핸드폰 번호입니다.");
              }
            },
          },
        },
      },
      // 여기까지가 필드에 대한 설정
      {
        sequelize,
        tableName: "users",
        modelName: "User",
        indexes: [
          { unique: true, fields: ["username", "email", "phone_number"] },
        ],
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
        // charset: "utf8" /* 인코딩 */,
        // collate: "utf8_general_ci",

        hooks: {
          beforeCreate: async (user, options) => {
            const hashedPw = await bcrypt.hash(user.password, 12);
            return (user.password = hashedPw);
          },
        },
      }
    );
  }
  // 인스턴스메서드 정의
  makeToken() {
    const token = jwt.sign(this.username, process.env.JWT_SECRET_KEY);
    return token;
  }

  // 정적메서드 정의
  static async findUserAndVaildate(username, password) {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return false;
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return false;
    }
    return user;
  }

  // 다른 모델과의 관계 설정
  static associate(db) {
    // 인자로 index.js에서 만든 여러 테이블이 저장되어있는 db객체를 받을 것이다.
    // 양쪽에 cascade를 넣고 hooks을 걸어주면 무한 루프에 빠질 수 있다.
    db.User.hasMany(db.Product, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "products",
      // 유저 쪽은 cascade가 없어도 될거 같다.
      // onDelete: "CASCADE",
      // onUpdate: "CASCADE",
      hooks: true,
    });
    db.User.hasMany(db.Cart, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "carts",
      hooks: true,
    });
  }
}

User.prototype.testMethod = function () {
  const token = jwt.sign(this.username, process.env.JWT_SECRET_KEY);
  return token;
};

module.exports = User;
