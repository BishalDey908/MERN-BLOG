const mongoose = require("mongoose");

const blogCategoryschema = new mongoose.Schema({
    category:{
        type:String,
        required:true,
        unique:true
    }
})

const blogCategoryModel = mongoose.model("category",blogCategoryschema)

module.exports = blogCategoryModel