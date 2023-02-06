const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const carts = require("../controllers/carts");
const { isLogin, isAuthor } = require("../middlewares/auth_middleware");
const { cartCreateValidation } = require("../middlewares/joi_middleware");

router.get("/", isLogin, wrapAsync(carts.listCarts));
router.post(
  "/:product_id",
  cartCreateValidation,
  isLogin,
  wrapAsync(carts.createCarts)
);
module.exports = router;
