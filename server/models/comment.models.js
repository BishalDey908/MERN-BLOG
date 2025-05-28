const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    userImg:{
        type:String
    },
    blogId:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    userId:{
        type:String
    }
},{ timestamps: true })

const commentModel = mongoose.model("commentModel",commentSchema);

module.exports = commentModel