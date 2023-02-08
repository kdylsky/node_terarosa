const express = require("express");
const app = express();
const { sequelize } = require("./models");
const userRouter = require("./routers/users");
const productRouter = require("./routers/products");
const cartRouter = require("./routers/carts");
const orderRouter = require("./routers/orders");
const ExpressError = require("./utils/ExpressError");

app.use(express.json());

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/carts/:username", cartRouter);
app.use("/orders", orderRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = "Default Error Message";
  }
  res.status(status).json({ name: err.name, message: err.message });
});

app.listen(3000, async () => {
  console.log("Server Starting");
});

sequelize
  .sync({ force: false }) //alter: true 기존데이터는 유지하면서 업데이트 not null인 속성이 있으면 에러처리해주어야 한다.
  .then(() => {
    console.log("데이터베이스 연결됨.");
  })
  .catch((err) => {
    console.error(err);
  });
