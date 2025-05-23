require("dotenv").config();
require("./db/db.config");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 2000;

//auth router import
const userReg = require("./routes/auth.routes");
const otp = require("./routes/auth.routes");
const logIn = require("./routes/auth.routes");
const userFetch = require("./routes/user.routes");
const deleteUser = require("./routes/user.routes");

//blog router import
const createBlog = require("./routes/blog.routes");


//auth router
app.use("/api",userReg);
app.use("/api",otp);
app.use("/api",logIn);
app.use("/api",userFetch);
app.use("/api",deleteUser);

//blog router
app.use("/api",createBlog)

app.get("/",(req,res)=>{
    res.send("ALL OK");
})

app.listen(PORT,()=>{
    console.log("Server Is running On",PORT)
})