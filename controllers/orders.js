const { Order, Product, sequelize } = require("../models");

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
    const size = await product.OrderItem.getSize();
    const grinding = await product.OrderItem.getGrinding();
    let item = {
      orderId: product.OrderItem.orderId,
      size: size.size,
      price: size.price,
      grinding: grinding.name,
      quantity: product.OrderItem.quantity,
    };
    items.push(item);
  }
  res.json(items);
};

module.exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.create(
      {
        userId: res.locals.currentUser.id,
      },
      {
        transaction: transaction,
      }
    );
    for (item of req.body.orderItems) {
      const product = await Product.findByPk(item.product_id);
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
      order.addProduct(
        product,
        {
          through: {
            sizeId: size[0].id,
            grindingId: grinding[0].id,
            quantity: item.quantity,
          },
        },
        { transaction: transaction }
      );
    }
    transaction.commit();
    res.status(200).json({ message: "주문이 완료 됬습니다." });
  } catch (error) {
    transaction.rollback();
    return res.status(400).json(error.message);
  }
};
