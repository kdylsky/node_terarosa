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
  sequelize,
} = require("../models");

router.post(
  "/",
  isLogin,
  productValidation,
  wrapAsync(async (req, res, next) => {
    const {
      category_name,
      subcategory_name,
      size_price,
      taste_name,
      grinding_name,
      roastingDate,
      product_name,
    } = req.body;

    try {
      await sequelize.transaction(async (t) => {
        const is_existed = async (modelName, params) => {
          const [modelObject, created] = await modelName.findOrCreate(
            {
              where: { name: params },
            },
            { transaction: t }
          );
          return modelObject;
        };

        // category, taste, grinding의 경우는 외래키가 없기 때문에 만들기만 하면된다.
        await is_existed(Taste, taste_name);
        await is_existed(Grinding, grinding_name);
        const category = await is_existed(Category, category_name);

        // subcategory는 categoryId를 가지기 때문에 category다음에 생성되어야 한다.
        // product는 subcategoryId를 가지기 때문에 subCategory다음에 생성되어야 한다.
        // size는 productId를 가지기 때문에 product다음에 생성되어야 한다.
        const [subCategory, subcategory_created] =
          await SubCategory.findOrCreate(
            {
              where: { name: subcategory_name, categoryId: category.id },
            },
            { transaction: t }
          );

        const product = await Product.create(
          {
            name: product_name,
            roastingDate: roastingDate,
            subCategoryId: subCategory.id,
            userId: res.locals.currentUser.id,
          },
          { transaction: t }
        );

        for (let i of size_price) {
          await Size.create(
            {
              size: i["size"],
              price: i["price"],
              productId: product.id,
            },
            { transaction: t }
          );
        }
        res.json({ message: "상품이 등록되었습니다." });
      });
    } catch (error) {
      next(error);
    }
  })
);

module.exports = router;
