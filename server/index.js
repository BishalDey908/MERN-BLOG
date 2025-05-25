require("dotenv").config();
require("./db/db.config");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 2000;

//auth router import
const userRegRoute = require("./routes/auth.routes");
const otpRoute = require("./routes/auth.routes");
const logInRoute = require("./routes/auth.routes");
const userFetchRoute = require("./routes/user.routes");
const deleteUserRoute = require("./routes/user.routes");


//blog router import
const createBlogRoute = require("./routes/blog.routes");
const getBlogCategoryRoute = require("./routes/blog.routes");
const getBlogRoute = require("./routes/blog.routes");
const getSingleBlogRoute = require("./routes/blog.routes");
const getUserBlogRoute = require("./routes/blog.routes");
const updateUserBlogRoute = require("./routes/blog.routes");
const deleteUserBlogRoute = require("./routes/blog.routes");


//auth router
app.use("/api",userRegRoute);
app.use("/api",otpRoute);
app.use("/api",logInRoute);
app.use("/api",userFetchRoute);
app.use("/api",deleteUserRoute);

//blog router
app.use("/api",createBlogRoute)
app.use("/api",getBlogCategoryRoute)
app.use("/api",getBlogRoute)
app.use("/api",getSingleBlogRoute)
app.use("/api",getUserBlogRoute)
app.use("/api",updateUserBlogRoute)
app.use("/api",deleteUserBlogRoute)

app.get("/",(req,res)=>{
    res.send("ALL OK");
})

app.listen(PORT,()=>{
    console.log("Server Is running On",PORT)
})