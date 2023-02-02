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

    const [subCategory, subcategory_created] = await SubCategory.findOrCreate({
      where: { name: subcategory_name, categoryId: category.id },
      transaction: transaction,
    });

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
};

module.exports.AllProduct = async (req, res) => {
  const products = await Product.findAll({
    attributes: ["id", "name"],
    include: [
      // product와 관련된 서브카테고리 정보 가지고 오기
      {
        model: SubCategory,
        as: "subcategory",
        attributes: ["id", "name", "categoryId"],
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  res.status(200).json(products);
};

module.exports.RetriveProduct = async (req, res) => {
  const { id } = req.params;
  const products = await Product.findByPk(id, {
    attributes: ["id", "name"],
    include: [
      // product와 관련된 유저 정보 가지고 오기
      {
        model: User,
        as: "user",
        attributes: ["name"],
      },

      // product와 관련된 서브카테고리 정보 가지고 오기
      {
        model: SubCategory,
        as: "subcategory",
        attributes: ["id", "name", "categoryId"],
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
        ],
      },

      // product와 관련된 사이즈 정보 가지고 오기
      {
        model: Size,
        as: "sizes",
        attributes: ["id", "size"],
      },

      // product와 관련된 taste 정보 가지고 오기
      {
        model: Taste,
        attributes: ["name"],
        as: "tastes",
        through: {
          attributes: [],
        },
      },

      // product와 관련된 grinding정도 정보 가지고 오기
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
  res.status(200).json(products);
};

module.exports.DeleteProduct = async (req, res) => {
  const { id } = req.params;
  //삭제하게 되면 상품과 연관된 정보 역시 함께 지워야 한다.
  //상품과 연관된 정보는 size테이블, product_taste테이블, product_grinding테이블
  const deleteProduct = await Product.destroy({
    where: { id: id },
  });
  res.status(200).json({ message: "Deleted Product" });
};
