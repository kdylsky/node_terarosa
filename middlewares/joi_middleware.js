const {
  userSignUpSchema,
  userLoginSchema,
  productCreateSchema,
  productEditSchema,
  cartCreateSchema,
  orderCreateSchema,
} = require("../joiSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.signupValidation = (req, res, next) => {
  const { error } = userSignUpSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.loginValidation = (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.productValidation = (req, res, next) => {
  const { error } = productCreateSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.productEditValidation = (req, res, next) => {
  const { error } = productEditSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.cartCreateValidation = (req, res, next) => {
  const { error } = cartCreateSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.orderCreateValidation = (req, res, next) => {
  const { error } = orderCreateSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
