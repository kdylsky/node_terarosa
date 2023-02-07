const wrapAsync = require("../utils/wrapAsync");
const jwt = require("jsonwebtoken");
const { User, Product, Cart } = require("../models/index");

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

module.exports.isProductAuthor = wrapAsync(async (req, res, next) => {
  const user = res.locals.currentUser;
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(401).json({ message: "상품을 다시 확인해주세요" });
  }

  if (product.userId !== user.id) {
    return res.status(401).json({ message: "허용된 사용자가 아닙니다." });
  }
  next();
});

module.exports.isCartAuthor = wrapAsync(async (req, res, next) => {
  const user = res.locals.currentUser;
  const { username } = req.params;
  const carts = await Cart.findAll({ where: { userName: username } });
  if (user.username !== username) {
    return res.status(401).json({ message: "허용된 사용자가 아닙니다." });
  }
  next();
});
