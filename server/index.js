require("dotenv").config();
require("./db/db.config");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 2000;

const userReg = require("./routes/auth.routes");
const otp = require("./routes/auth.routes");
const logIn = require("./routes/auth.routes");

app.use(express.json());
app.use("/api",userReg);
app.use("/api",otp);
app.use("/login",logIn);

app.get("/",(req,res)=>{
    res.send("ALL OK");
})

app.listen(PORT,()=>{
    console.log("Server Is running On",PORT)
})