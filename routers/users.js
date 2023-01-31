const express = require("express");
const router = express.Router()
const { User } = require("../models");
const { signupValidation, loginValidation } = require("../middlewares/middleware_joi")
const wrapAsync = require("../utils/wrapAsync")


router.post("/signup", signupValidation, wrapAsync(async(req,res)=>{
    const user = await User.create({...req.body})
    res.status(200).json({message:"유저가 생성되었습니다", data:user})
}))

router.post("/login", loginValidation, wrapAsync(async(req,res)=>{
    const {username, password} = req.body;
    const is_user = await User.findUserAndVaildate(username, password)
    if (!is_user){
        return console.log("username과 비밀번호를 다시 확인해 주세요!!")
    }
    res.status(200).json({message:"로그인에 성공했습니다."})
}) )

module.exports = router;