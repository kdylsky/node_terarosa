const Joi = require("joi");

module.exports.userSignUpSchema = Joi.object({
  name: Joi.string().not("").required(),
  username: Joi.string().not("").required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .messages({ "string.pattern.base": `비밀번호 형식이 잘못 됬습니다.` })
    .required(),
  address: Joi.string().not("").required(),
  phone_number: Joi.string()
    .regex(/^(?:(010-\d{4})|(01[1|6|7|8|9]-\d{3,4}))-(\d{4})$/)
    .messages({ "string.pattern.base": `휴대전화 형식이 잘못 됬습니다.` })
    .required(),
}).options({ abortEarly: false });

module.exports.userLoginSchema = Joi.object({
  username: Joi.string().not("").required(),
  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .messages({ "string.pattern.base": `비밀번호 형식이 잘못 됬습니다.` })
    .required(),
}).options({ abortEarly: false });

module.exports.productCreateSchema = Joi.object({
  category_name: Joi.only().allow("커피", "식품").required(),
  subcategory_name: Joi.only()
    .allow("싱글오리진", "브렌드", "드립백", "생두")
    .required(),
  size_price: Joi.array().items(
    Joi.object({
      size: Joi.only().allow("100g", "250g", "500g").required(),
      price: Joi.number().required(),
    }).required()
  ),
  taste_name: Joi.array()
    .items(
      Joi.string()
        .only()
        .allow("Apple", "Mango", "Grape", "Banana", "Peach")
        .required()
    )
    .required(),
  grinding_name: Joi.array()
    .items(
      Joi.string()
        .only()
        .allow("갈지않음", "에스프레소", "모카포트", "드립", "프렌치프레스")
        .required()
    )
    .required(),
  product_name: Joi.string().not("").required(),
  roastingDate: Joi.date().iso().required(),
}).options({ abortEarly: false });

module.exports.productEditSchema = Joi.object({
  size_price: Joi.array().items(
    Joi.object({
      size: Joi.only().allow("100g", "250g", "500g").required(),
      price: Joi.number().required(),
    }).optional()
  ),
  taste_name: Joi.array()
    .items(
      Joi.string()
        .only()
        .allow("Apple", "Mango", "Grape", "Banana", "Peach")
        .required()
    )
    .optional(),
  grinding_name: Joi.array()
    .items(
      Joi.string()
        .only()
        .allow("갈지않음", "에스프레소", "모카포트", "드립", "프렌치프레스")
        .required()
    )
    .optional(),
}).options({ abortEarly: false });

module.exports.cartCreateSchema = Joi.object({
  items: Joi.array().items({
    quantity: Joi.number().min(1).required(),
    size: Joi.string().only().allow("100g", "250g", "500g").required(),
    grinding: Joi.string()
      .only()
      .allow("갈지않음", "에스프레소", "모카포트", "드립", "프렌치프레스")
      .required(),
  }),
}).options({ abortEarly: false });

module.exports.orderCreateSchema = Joi.object({
  orderItems: Joi.array().items({
    product_id: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
    size: Joi.string().only().allow("100g", "250g", "500g").required(),
    grinding: Joi.string()
      .only()
      .allow("갈지않음", "에스프레소", "모카포트", "드립", "프렌치프레스")
      .required(),
  }),
}).options({ abortEarly: false });
