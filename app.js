const express = require("express");
const app = express()
const { sequelize } = require("./models/index")

app.get("/", (req,res)=>{
    res.send("hello world!!")
})

app.listen(3000, async()=>{
    console.log("Server Starting");
    await sequelize.authenticate();
    console.log("DB Connected");
})