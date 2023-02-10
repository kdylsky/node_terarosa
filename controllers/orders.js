const { Order, Product, sequelize, Size } = require("../models");
const ExpressError = require("../utils/ExpressError");

module.exports.listOrder = async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: res.locals.currentUser.id },
  });
  res.json(orders);
};

module.exports.retriveOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: { id: id, userId: res.locals.currentUser.id },
  });
  if (!order) {
    throw new ExpressError("주문 정보가 없습니다.", 400);
  }
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
  return res.json(items);
};

module.exports.createOrder = async (req, res) => {
  try {
    result = await sequelize.transaction(async () => {
      const order = await Order.create({
        userId: res.locals.currentUser.id,
      });
      for (item of req.body.orderItems) {
        const product = await Product.findByPk(item.product_id);
        if (!product) {
          throw new ExpressError("[주문]상품이 존재하지 않습니다.", 400);
        }
        const size = await product.sizeOption(item.size);
        const grinding = await product.grindingOption(item.grinding);
        await order.addProduct(product, {
          through: {
            sizeId: size.id,
            grindingId: grinding.id,
            quantity: item.quantity,
          },
        });
      }
      return res.status(200).json({ message: "주문이 완료 됬습니다." });
    });
  } catch (error) {
    throw new ExpressError(error.message, 400);
  }
};
