const {userSignUpSchema} = require("../joiSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.signupValidation = (req,res,next)=>{
    const {error} = userSignUpSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(",")        
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
