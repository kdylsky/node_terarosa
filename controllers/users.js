const { User } = require("../models");

module.exports.signupUser = async (req, res) => {
  const user = await User.create({ ...req.body });
  res.status(200).json({ message: "유저가 생성되었습니다", data: user });
};

module.exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findUserAndVaildate(username, password);
  if (!user) {
    return console.log("username과 password를 다시 확인해 주세요!!");
  }
  const token = user.testMethod();
  res.status(200).json({ message: "로그인에 성공했습니다.", token: token });
};
