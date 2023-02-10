const wrapAsync = require("../utils/wrapAsync");
const jwt = require("jsonwebtoken");
const { User, Product, Cart } = require("../models/index");
const ExpressError = require("../utils/ExpressError");

module.exports.isLogin = wrapAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new ExpressError("로그인 후 이용 가능 합니다.", 401);
  }
  const username = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findOne({ where: { username: username } });
  if (!user) {
    throw new ExpressError("로그인 후 이용 가능 합니다.", 401);
  }
  res.locals.currentUser = user;
  next();
});

module.exports.isProductAuthor = wrapAsync(async (req, res, next) => {
  const user = res.locals.currentUser;
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    throw new ExpressError("카테고리 또는 상품을 다시 확인해주세요", 400);
  }
  if (product.userId !== user.id) {
    throw new ExpressError("허용된 사용자가 아닙니다.", 401);
  }
  next();
});

module.exports.isCartAuthor = wrapAsync(async (req, res, next) => {
  const user = res.locals.currentUser;
  const { username } = req.params;
  const carts = await Cart.findAll({ where: { userName: username } });
  if (user.username !== username) {
    throw new ExpressError("허용된 사용자가 아닙니다.", 401);
  }
  next();
});
