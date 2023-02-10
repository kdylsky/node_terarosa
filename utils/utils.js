const { SubCategory, Category } = require("../models");
const ExpressError = require("../utils/ExpressError");

module.exports.findOrCreateReturnObject = async (
  name,
  Model,
  optional = ""
) => {
  if (optional.length === 0) {
    const [obj, obj_created] = await Model.findOrCreate({
      where: { name: name },
    });
    return obj;
  } else {
    const [obj, obj_created] = await Model.findOrCreate({
      where: { name: name, categoryId: optional },
    });
    return obj;
  }
};

module.exports.findSubCategoryByCategory = async (category_name) => {
  if (!["커피", "식품"].includes(category_name)) {
    throw new ExpressError("카테고리를 확인해주세요", 400);
  }
  const subcategory = await SubCategory.findAll({
    include: [
      {
        model: Category,
        as: "category",
        where: { name: category_name },
      },
    ],
  });
  ids = [];
  subcategory.map((element) => {
    ids.push(element.id);
  });
  return ids;
};

// const [category, category_created] = await Category.findOrCreate({
//   where: { name: category_name },
//   transaction: transaction,
// });
// const [subCategory, subcategory_created] = await SubCategory.findOrCreate({
//   where: { name: subcategory_name, categoryId: category.id },
//   transaction: transaction,
// });
// const product = await Product.create(
//     {
//       name: product_name,
//       roastingDate: roastingDate,
//       subCategoryId: subCategory.id,
//       userId: res.locals.currentUser.id,
//     },
//     { transaction: transaction }
//   );
// for (let taste of taste_name) {
//   let [taste_obj, taste_flag] = await Taste.findOrCreate({
//     where: { name: taste },
//     transaction: transaction,
//   });
//   product.addTaste(taste_obj);
// }
// for (let grinding of grinding_name) {
//   let [grinding_obj, grinding_flag] = await Grinding.findOrCreate({
//     where: { name: grinding },
//     transaction: transaction,
//   });
//   product.addGrinding(grinding_obj);
// }
// for (let i of size_price) {
//   await Size.create(
//     {
//       size: i["size"],
//       price: i["price"],
//       productId: product.id,
//     },
//     { transaction: transaction }
//   );
// }
