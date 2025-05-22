const mongoose = require("mongoose");


const blogSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    catagoryId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    image:{
        type:String,
        // require:true
    },
    blog:{
        type:String,
        require:true,
    }
},{timestamps:true})

const blogModel = mongoose.model("blog",blogSchema);

module.exports=blogModel;
