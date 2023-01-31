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
