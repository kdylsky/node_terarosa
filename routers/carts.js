const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const carts = require("../controllers/carts");
const { isLogin, isCartAuthor } = require("../middlewares/auth_middleware");
const { cartCreateValidation } = require("../middlewares/joi_middleware");

router.get("/", isLogin, isCartAuthor, wrapAsync(carts.listCarts));
router.post(
  "/:product_id",
  cartCreateValidation,
  isLogin,
  isCartAuthor,
  wrapAsync(carts.createCarts)
);
router.patch("/", isLogin, isCartAuthor, wrapAsync(carts.editCarts));
router.delete("/", isLogin, isCartAuthor, wrapAsync(carts.deleteCarts));

module.exports = router;
