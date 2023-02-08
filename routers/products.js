const express = require("express");
const router = express.Router();
const { isLogin, isProductAuthor } = require("../middlewares/auth_middleware");
const {
  productValidation,
  productEditValidation,
} = require("../middlewares/joi_middleware");
const wrapAsync = require("../utils/wrapAsync");
const products = require("../controllers/products");

router.post("/", isLogin, productValidation, wrapAsync(products.CreateProduct));
router.get("/", wrapAsync(products.AllProduct));
router.get("/:category_name", wrapAsync(products.CategoryProduct));
router.get("/:category_name/:id", wrapAsync(products.RetriveProduct));
router.delete(
  "/:category_name/:id",
  isLogin,
  isProductAuthor,
  wrapAsync(products.DeleteProduct)
);
router.patch(
  "/:category_name/:id/edit/add",
  isLogin,
  isProductAuthor,
  productEditValidation,
  wrapAsync(products.EditAddOptionProduct)
);
router.patch(
  "/:category_name/:id/edit/delete",
  isLogin,
  isProductAuthor,
  productEditValidation,
  wrapAsync(products.EditDeleteOptionProduct)
);
module.exports = router;
