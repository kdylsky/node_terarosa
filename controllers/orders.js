const { Order, Product, Size, Grinding } = require("../models");

module.exports.listOrder = async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: res.locals.currentUser.id },
  });
  res.json(orders);
};

module.exports.retriveOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByPk(id);
  const products = await order.getProducts({});
  let items = [];
  for (let product of products) {
    const size = await Size.findByPk(product.OrderItem.size);
    const grinding = await Grinding.findByPk(product.OrderItem.grinding);
    let item = {
      orderId: product.OrderItem.orderId,
      size: size.size,
      price: size.price,
      grinding: grinding.name,
      quantity: product.OrderItem.quantity,
    };
    items.push(item);
  }
  res.send(items);
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
