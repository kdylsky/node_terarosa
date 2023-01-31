const express = require("express");
const router = express.Router()
const { User } = require("../models");
const { signupValidation } = require("../middlewares/middleware_joi")
const wraoAsync = require("../utils/wrapAsync")

router.get("/", (req,res)=>{
    res.send("it work")
})

router.post("/signup", signupValidation, wraoAsync(async(req,res)=>{
    const user = await User.create({...req.body})
    res.send("it work")
}))

module.exports = router;