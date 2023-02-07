const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { orderCreateValidation } = require("../middlewares/joi_middleware");
const { isLogin } = require("../middlewares/auth_middleware");

const orders = require("../controllers/orders");

router.get("/", isLogin, wrapAsync(orders.listOrder));
router.post("/", isLogin, orderCreateValidation, wrapAsync(orders.createOrder));
router.get("/:id", isLogin, wrapAsync(orders.retriveOrder));
module.exports = router;
