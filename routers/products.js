const express = require("express");
const router = express.Router();

const { isLogin } = require("../middlewares/auth_middleware");
const { productValidation } = require("../middlewares/joi_middleware");
const wrapAsync = require("../utils/wrapAsync");

const {
  Category,
  SubCategory,
  Taste,
  Size,
  Grinding,
  Product,
} = require("../models");

const is_existed = async (modelName, params) => {
  const [modelObject, created] = await modelName.findOrCreate({
    where: { name: params },
  });
  return modelObject;
};

router.post("/test", productValidation, (req, res) => {
  // console.log(res.locals.currentUser.id);
  console.log(req.body.size_price);
  const sizes = ["100g", "250g", "500g"];
  // for (let i of req.body.size_price.list) {
  //   console.log(i["size"]);
  //   console.log(i["price"]);
  // }

  res.send("it work");
});

router.post(
  "/",
  isLogin,
  wrapAsync(async (req, res) => {
    const {
      category_name,
      subcategory_name,
      size_name,
      size_price,
      taste_name,
      grinding_name,
      roastingDate,
      product_name,
    } = req.body;
    const sizes = ["100g", "250g", "500g"];
    for (let size of sizes) {
      console.log(req.body.size_price[size]);
    }
    // category, taste, grinding의 경우는 외래키가 없기 때문에 만들기만 하면된다.
    // subcategory는 categoryId를 가지기 때문에 category다음에 생성되어야 한다.
    // product는 subcategoryId를 가지기 때문에 subCategory다음에 생성되어야 한다.
    // size는 productId를 가지기 때문에 product다음에 생성되어야 한다.
    // const category = await is_existed(Category, category_name);
    // const taste = await is_existed(Taste, taste_name);
    // const grinding = await is_existed(Grinding, grinding_name);

    // const [subCategory, subcategory_created] = await SubCategory.findOrCreate({
    //   where: { name: subcategory_name, categoryId: category.id },
    // });

    // const product = await Product.create({
    //   name: product_name,
    //   roastingDate: roastingDate,
    //   subCategoryId: subCategory.id,
    //   userId: res.locals.currentUser.id,
    // });

    // const size = await Size.create({
    //   name: size_name,
    //   price: size_price,
    //   productId: product.id,
    // });

    res.json({ message: "상품이 등록되었습니다." });
  })
);

module.exports = router;
