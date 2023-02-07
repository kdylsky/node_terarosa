const { Order } = require("../models");

module.exports.listOrder = async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: res.locals.currentUser.id },
  });
  res.send(orders);
};
