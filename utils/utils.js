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
