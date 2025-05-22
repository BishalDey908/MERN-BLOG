const mongoose = require("mongoose");

const blogCategoryschema = new mongoose.Schema({
    category:{
        type:String,
        require:true,
        unique:true
    }
})

const blogCategoryModel = mongoose.model("category",blogCategoryschema)

module.exports = blogCategoryModel