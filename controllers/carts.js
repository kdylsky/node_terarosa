const { Cart, Product } = require("../models");

module.exports.listCarts = async (req, res) => {
  const user = res.locals.currentUser;
  const carts = await Cart.findAll({
    where: { userId: user.id },
  });
  res.status(200).json(carts);
};

module.exports.createCarts = async (req, res) => {
  const { product_id } = req.params;
  const product = await Product.findByPk(product_id);
  for (item of req.body.items) {
    const size = await product.getSizes({ where: { size: item.size } });
    if (size.length <= 0) {
      return res.status(400).json({ message: "잘못된 사이즈입니다." });
    }
    const grinding = await product.getGrindings({
      where: { name: item.grinding },
    });
    if (grinding.length <= 0) {
      return res.status(400).json({ message: "잘못된 grinding입니다." });
    }
    const [carts, cartCreated] = await Cart.findOrCreate({
      where: {
        userId: res.locals.currentUser.id,
        productId: product_id,
        grinding: item.grinding,
        size: item.size,
      },
      defaults: {
        quantity: item.quantity,
      },
    });

    if (!cartCreated) {
      carts.quantity += item.quantity;
    }
  }
  res.status(201).json({ message: "카트에 상품이 추가되었습니다." });
};

module.exports.editCarts = async (req, res) => {
  const { productId, size, quantity } = req.query;
  const cart = await Cart.findOne({
    where: {
      userId: res.locals.currentUser.id,
      size: size,
      productId: productId,
    },
  });
  cart.quantity += parseInt(quantity);
  if (cart.quantity <= 0) {
    cart.quantity = 1;
  }
  await cart.save();
  res.json(cart);
};

module.exports.deleteCarts = async (req, res) => {
  const { productId } = req.query;

  for (let id of productId) {
    Cart.destroy({
      where: { userId: res.locals.currentUser.id, productId: id },
    });
  }
  res.status(200).json({ message: "Delete Cart" });
};
