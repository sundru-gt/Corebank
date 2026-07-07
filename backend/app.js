const express= require('express');
const cookieParser=require('cookie-parser')
const authRouter=require("./routes/auth.routes")
const app= express();

//to use the req.body
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter)
module.exports=app;