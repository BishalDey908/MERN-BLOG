require("dotenv").config();
require("./db/db.config");
const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 2000;

//auth router import
const userReg = require("./routes/auth.routes");
const otp = require("./routes/auth.routes");
const logIn = require("./routes/auth.routes");

//blog router import
const createBlog = require("./routes/blog.routes");


//auth router
app.use("/api",userReg);
app.use("/api",otp);
app.use("/login",logIn);

//blog router
app.use("/api",createBlog)

app.get("/",(req,res)=>{
    res.send("ALL OK");
})

app.listen(PORT,()=>{
    console.log("Server Is running On",PORT)
})