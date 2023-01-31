const express = require("express");
const app = express()
const { sequelize } = require("./models")
const userRouter = require("./routers/users");

app.use(express.json());

app.use("/users", userRouter);

app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message){
        err.message = "Default Error Message"
    }
    res.status(status).json({message:err.message})
})

app.listen(3000, async()=>{
    console.log("Server Starting");
    await sequelize.authenticate();
    console.log("DB Connected");
})