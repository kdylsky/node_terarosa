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
} = require("../models");

router.post(
  "/",
  isLogin,
  productValidation,
  wrapAsync(async (req, res) => {
    const {
      category_name,
      subcategory_name,
      size_price,
      taste_name,
      grinding_name,
      roastingDate,
      product_name,
    } = req.body;

    const transaction = await sequelize.transaction();

    try {
      const is_existed = async (modelName, params) => {
        const [modelObject, created] = await modelName.findOrCreate({
          where: { name: params },
          transaction: transaction,
        });
        return modelObject;
      };
      const category = await is_existed(Category, category_name);

      const [subCategory, subcategory_created] = await SubCategory.findOrCreate(
        {
          where: { name: subcategory_name, categoryId: category.id },
          transaction: transaction,
        }
      );

      const product = await Product.create(
        {
          name: product_name,
          roastingDate: roastingDate,
          subCategoryId: subCategory.id,
          userId: res.locals.currentUser.id,
        },
        { transaction: transaction }
      );

      for (let i of size_price) {
        await Size.create(
          {
            size: i["size"],
            price: i["price"],
            productId: product.id,
          },
          { transaction: transaction }
        );
      }

      for (let taste of taste_name) {
        let [taste_obj, taste_flag] = await Taste.findOrCreate({
          where: { name: taste },
          transaction: transaction,
        });
        await product_taste.create(
          {
            product_id: product.id,
            taste_id: taste_obj.id,
          },
          { transaction: transaction }
        );
      }

      for (let grinding of grinding_name) {
        let [grinding_obj, grinding_flag] = await Grinding.findOrCreate({
          where: { name: grinding },
          transaction: transaction,
        });
        await product_grinding.create(
          {
            product_id: product.id,
            grinding_id: grinding_obj.id,
          },
          { transaction: transaction }
        );
      }

      await transaction.commit();
      res.json({ message: "상품이 등록되었습니다." });
    } catch (error) {
      await transaction.rollback();
      throw new ExpressError("DB Rollback", 401);
    }
  })
);

module.exports = router;
