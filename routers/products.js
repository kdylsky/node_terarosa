const express = require("express");
const router = express.Router();
const { isLogin, isAuthor } = require("../middlewares/auth_middleware");
const { productValidation } = require("../middlewares/joi_middleware");
const wrapAsync = require("../utils/wrapAsync");

const products = require("../controllers/products");

router.post("/", isLogin, productValidation, wrapAsync(products.CreateProduct));
router.get("/", wrapAsync(products.AllProduct));
router.get("/:id", wrapAsync(products.RetriveProduct));
router.delete("/:id", isLogin, isAuthor, wrapAsync(products.DeleteProduct));
module.exports = router;
