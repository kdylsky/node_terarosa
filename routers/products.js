const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/auth_middleware");
const { productValidation } = require("../middlewares/joi_middleware");
const wrapAsync = require("../utils/wrapAsync");

const ExpressError = require("../utils/ExpressError");

const {
  Category,
  SubCategory,
  Taste,
  Size,
  Grinding,
  Product,
  sequelize,
  product_grinding,
  product_taste,
  User,
} = require("../models");

const products = require("../controllers/products");

router.post("/", isLogin, productValidation, wrapAsync(products.CreateProduct));
router.get("/", wrapAsync(products.AllProduct));
router.get("/:id", wrapAsync(products.RetriveProduct));
router.patch("/:id", wrapAsync(products.EditProduct));
module.exports = router;
