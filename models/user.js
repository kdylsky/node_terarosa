const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
    static async findUserAndVaildate(username, password){
      const user = await User.findOne({where:{username:username}})
      if (!user){
        return false
      }
      const result = await bcrypt.compare(password, user.password);
      if(!result){
        return false
      }
      return user
    };
  
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          async customValidator(value) {
            const user = await User.findOne({ where: { phone_number: value } });
            if (user) {
              throw new Error("이미 존재하는 핸드폰 번호입니다.");
            }
          },
        },
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  User.beforeCreate(async function (user, options) {
    const hashedPw = await bcrypt.hash(user.password, 12);
    return (user.password = hashedPw);
  });

  User.prototype.testMethod = function () {
    const token = jwt.sign(this.username, process.env.JWT_SECRET_KEY) 
    return token
  };
  
  return User;
};
