const ExpressError = require("../utils/ExpressError");
const {
  findOrCreateReturnObject,
  findSubCategoryByCategory,
} = require("../utils/utils");
const { Op, Sequelize } = require("sequelize");
const cls = require("cls-hooked");
const namespace = cls.createNamespace("transaction-namespace");
Sequelize.useCLS(namespace);

const {
  Category,
  SubCategory,
  Taste,
  Size,
  Grinding,
  Product,
  sequelize,
  User,
} = require("../models");

module.exports.CreateProduct = async (req, res) => {
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
    const result = await sequelize.transaction(async () => {
      const category = await findOrCreateReturnObject(category_name, Category);
      const subCategory = await findOrCreateReturnObject(
        subcategory_name,
        SubCategory,
        category.id
      );
      const product = await Product.create({
        name: product_name,
        roastingDate: roastingDate,
        subCategoryId: subCategory.id,
        userId: res.locals.currentUser.id,
      });
      for (let i of size_price) {
        await Size.create({
          size: i["size"],
          price: i["price"],
          productId: product.id,
        });
      }
      await product.findOrCreateAddOption(taste_name, Taste);
      await product.findOrCreateAddOption(grinding_name, Grinding);
      res.json({ message: "상품이 등록되었습니다." });
    });
  } catch (error) {
    throw new ExpressError(error.message, 400);
  }
};

module.exports.AllProduct = async (req, res) => {
  const products = await Product.findAll({
    attributes: ["id", "name", "roastingDate"],
    include: [
      {
        model: Size,
        as: "sizes",
        attributes: ["size", "price"],
      },
    ],
  });
  res.status(200).json(products);
};

module.exports.CategoryProduct = async (req, res) => {
  const { category_name } = req.params;
  const subCategoriesIds = await findSubCategoryByCategory(category_name);
  const products = await Product.findAll({
    where: {
      subCategoryId: subCategoriesIds,
    },
    attributes: ["id", "name", "roastingDate"],
    include: [
      {
        model: SubCategory,
        as: "subcategory",
        attributes: ["id", "name", "categoryId"],
      },
      {
        model: Size,
        as: "sizes",
        attributes: ["size", "price"],
      },
    ],
  });
  if (products.length === 0) {
    res.status(400).json({
      message: `${category_name} 카테고리에 존재하는 상품이 없습니다.`,
    });
  }
  res.status(200).json(products);
};

module.exports.RetriveProduct = async (req, res) => {
  const { id, category_name } = req.params;
  const subCategoriesIds = await findSubCategoryByCategory(category_name);
  const products = await Product.findByPk(id, {
    attributes: ["id", "name"],
    include: [
      {
        model: SubCategory,
        as: "subcategory",
        attributes: ["id", "name", "categoryId"],
        where: { categoryId: [subCategoriesIds] },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
        ],
      },
      {
        model: Size,
        as: "sizes",
        attributes: ["id", "size"],
      },
      {
        model: Taste,
        attributes: ["name"],
        as: "tastes",
        through: {
          attributes: [],
        },
      },
      {
        model: Grinding,
        attributes: ["name"],
        as: "grindings",
        through: {
          attributes: [],
        },
      },
    ],
  });
  if (products === null) {
    res.status(400).json({ message: "존재하는 상품이 없습니다." });
  }
  res.status(200).json(products);
};

module.exports.DeleteProduct = async (req, res) => {
  const { id, category_name } = req.params;
  const subCategoriesIds = await findSubCategoryByCategory(category_name);
  const transaction = await sequelize.transaction();
  try {
    const deleteProduct = await Product.destroy({
      where: { id: id, subCategoryId: { [Op.in]: subCategoriesIds } },
      transaction: transaction,
    });
    transaction.commit();
    res.status(200).json({ message: "상품을 삭제합니다." });
  } catch (error) {
    transaction.rollback();
    throw new ExpressError(error.message, 401);
  }
};

module.exports.EditAddOptionProduct = async (req, res) => {
  const { id, category_name } = req.params;
  const { size_price, taste_name, grinding_name } = req.body;
  const subCategoriesIds = await findSubCategoryByCategory(category_name);
  const product = await Product.findOne({
    id: id,
    subCategoryId: { [Op.in]: subCategoriesIds },
  });
  try {
    const result = await sequelize.transaction(async () => {
      if (size_price) {
        for (let i of size_price) {
          const [size, sizeCreated] = await Size.findOrCreate({
            where: { size: i["size"], productId: product.id },
            defaults: { price: i["price"] },
          });
          if (!sizeCreated) {
            size.price = i["price"];
          }
          await size.save();
        }
      }
      if (taste_name) {
        await product.findOrCreateAddOption(taste_name, Taste);
      }
      if (grinding_name) {
        await product.findOrCreateAddOption(grinding_name, Grinding);
      }
      res.status(200).json({ message: "상품의 옵션을 추가합니다." });
    });
  } catch (error) {
    throw new ExpressError(error.message, 400);
  }
};

module.exports.EditDeleteOptionProduct = async (req, res) => {
  const { id, category_name } = req.params;
  const { size_price, taste_name, grinding_name } = req.body;
  const subCategoriesIds = await findSubCategoryByCategory(category_name);
  const product = await Product.findOne({
    id: id,
    subCategoryId: { [Op.in]: subCategoriesIds },
  });

  try {
    result = await sequelize.transaction(async () => {
      if (size_price) {
        size_price.forEach((element) => {
          Size.destroy({
            where: { size: element.size, productId: product.id },
          });
        });
      }
      if (taste_name) {
        await product.findAndDeleteOption(taste_name, Taste);
      }
      if (grinding_name) {
        await product.findAndDeleteOption(grinding_name, Grinding);
      }
      res.status(200).json({ message: "Delete Product Option" });
    });
  } catch (error) {
    throw new ExpressError(error.message, 400);
  }
};
