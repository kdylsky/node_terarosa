const { Cart, Product, Size, sequelize } = require("../models");
const ExpressError = require("../utils/ExpressError");

module.exports.listCarts = async (req, res) => {
  const user = res.locals.currentUser;
  const { username } = req.params;
  const carts = await Cart.findAll({
    where: { userId: user.id, userName: username },
  });
  return res.status(200).json(carts);
};

module.exports.createCarts = async (req, res) => {
  try {
    result = await sequelize.transaction(async () => {
      for (item of req.body.items) {
        const size = await req.currentProduct.sizeOption(item.size);
        const grinding = await req.currentProduct.grindingOption(item.grinding);
        const [carts, cartCreated] = await Cart.findOrCreate({
          where: {
            userId: res.locals.currentUser.id,
            productId: req.currentProduct.id,
            grinding: grinding.name,
            size: size.size,
            userName: res.locals.currentUser.username,
          },
          defaults: {
            quantity: item.quantity,
          },
        });
        if (!cartCreated) {
          carts.quantity += parseInt(item.quantity);
        }
        await carts.save();
      }
      res.status(201).json({ message: "카트에 상품이 추가되었습니다." });
    });
  } catch (error) {
    throw new ExpressError(error.message, 400);
  }
};

module.exports.editCarts = async (req, res) => {
  const { size, quantity } = req.query;
  const cart = await Cart.findOne({
    where: {
      userId: res.locals.currentUser.id,
      size: size,
      productId: req.currentProduct.id,
    },
  });
  if (!cart) {
    throw new ExpressError(`해당 상품에는 ${size}사이즈가 없습니다.`, 400);
  }
  cart.quantity += parseInt(quantity);
  if (cart.quantity <= 0) {
    cart.quantity = 1;
  }
  await cart.save();
  return res
    .status(200)
    .json({ message: `${size}사이즈 상품의 수량을 업데이트 했습니다.` });
};

module.exports.deleteCarts = async (req, res) => {
  Cart.destroy({
    where: {
      userId: res.locals.currentUser.id,
      productId: req.currentProduct.id,
    },
  });
  res.status(200).json({ message: "장바구니 아이템이 삭제되었습니다." });
};
