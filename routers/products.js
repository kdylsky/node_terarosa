const express = require("express");
const router = express.Router();
const { isLogin, isAuthor } = require("../middlewares/auth_middleware");
const {
  productValidation,
  productEditValidation,
} = require("../middlewares/joi_middleware");
const wrapAsync = require("../utils/wrapAsync");

const products = require("../controllers/products");

router.post("/", isLogin, productValidation, wrapAsync(products.CreateProduct));
router.get("/", wrapAsync(products.AllProduct));
router.get("/:id", wrapAsync(products.RetriveProduct));
router.delete("/:id", isLogin, isAuthor, wrapAsync(products.DeleteProduct));
router.patch(
  "/:id/edit/add",
  isLogin,
  isAuthor,
  productEditValidation,
  wrapAsync(products.EditAddOptionProduct)
);
router.patch(
  "/:id/edit/delete",
  isLogin,
  isAuthor,
  productEditValidation,
  wrapAsync(products.EditDeleteOptionProduct)
);
module.exports = router;
