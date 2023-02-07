const { Order, Product, Size } = require("../models");

module.exports.listOrder = async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: res.locals.currentUser.id },
  });
  res.json(orders);
};

module.exports.retriveOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByPk(id);
  console.log(order);
  const product = await order.getProducts({
    include: [
      {
        model: Size,
        as: "sizes",
      },
    ],
  });
  res.json(product);
};

module.exports.createOrder = async (req, res) => {
  const order = await Order.create({
    userId: res.locals.currentUser.id,
  });
  for (item of req.body.orderItems) {
    const product = await Product.findByPk(item.product_id);
    const size = await product.getSizes({ where: { size: item.size } });
    const grinding = await product.getGrindings({
      where: { name: item.grinding },
    });
    order.addProduct(product, {
      through: {
        size: size[0].id,
        grinding: grinding[0].id,
        quantity: item.quantity,
      },
    });
  }
  res.status(200).json({ message: "주문이 완료 됬습니다." });
};
