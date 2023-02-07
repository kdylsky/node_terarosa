const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {
  productValidation,
  productEditValidation,
} = require("../middlewares/joi_middleware");
const { isLogin } = require("../middlewares/auth_middleware");

const orders = require("../controllers/orders");

router.get("/", isLogin, wrapAsync(orders.listOrder));
module.exports = router;
