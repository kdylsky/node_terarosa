const bcrypt = require('bcrypt');

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
    */
   
   static associate(models) {
     // define association here
    }
  }
  // sequelize.define("users", { indexes: [{unique: true, fields: ["username"]}]});
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          async customValidator(value){
            const user = await User.findOne({where:{username:value}})
            if (user){
              throw new Error("이미 존재하는 유저이름입니다.")
            }
          }
        }
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
        validate:{
          async customValidator(value){
            const user = await User.findOne({where:{email:value}})
            if (user){
              throw new Error("이미 존재하는 이메일 주소입니다.")
            }
          }
        }
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          async customValidator(value){
            const user = await User.findOne({where:{phone_number:value}})
            if (user){
              throw new Error("이미 존재하는 핸드폰 번호입니다.")
            }
          }
        }
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );

  return User;
};
