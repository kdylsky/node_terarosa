const {
  userSignUpSchema,
  userLoginSchema,
  productCreateSchema,
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
