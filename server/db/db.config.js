const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONNECTION_STRING)
.then(()=>{
    console.log("DB Connected Success");
})
.catch((err)=>{
    console.log("DB Connection unsuccessFul",err);
})