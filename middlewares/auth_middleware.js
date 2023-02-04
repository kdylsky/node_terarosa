const wrapAsync = require("../utils/wrapAsync");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index");

module.exports.isLogin = wrapAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: "로그인 후 이용 가능합니다.",
    });
  }
  const username = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findOne({ where: { username: username } });
  if (!user) {
    return res.status(401).json({
      message: "로그인 후 이용 가능합니다.",
    });
  }
  res.locals.currentUser = user;
  next();
});
