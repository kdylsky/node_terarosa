const express = require("express");
const router = express.Router();

const {isLogin} = require("../middlewares/auth_middleware")
const {Category, SubCategory, Taste, Size, Grinding, Product } = require("../models")
const wrapAsync = require("../utils/wrapAsync");

const is_existed = async(modelName, params)=>{
    const [modelObject, created] = await modelName.findOrCreate({where:{name:params}})
    return modelObject
}

router.get("/", isLogin, (req,res)=>{
    console.log(res.locals.currentUser.id)
    res.send("it work")
})

router.post("/", isLogin, wrapAsync(async(req,res)=>{
    const { category_name, 
            subcategory_name, 
            size_name, 
            size_price, 
            taste_name, 
            grinding_name, 
            roastingDate, 
            product_name} = req.body;
    
    const category = await is_existed(Category, category_name);
    const taste = await is_existed(Taste, taste_name);
    const grinding = await is_existed(Grinding, grinding_name);
    const [subCategory, subcategory_created]  = await SubCategory.findOrCreate({where:{name:subcategory_name, categoryId:category.id},})
    const product = await Product.create({name:product_name,roastingDate:roastingDate, subCategoryId:subCategory.id, userId: res.locals.currentUser.id})
    const size = await Size.create({name:size_name, price:size_price, productId:product.id});
    res.json({message:"상품이 등록되었습니다.", data:product})
}))

module.exports = router;