const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    img:{
        type:String,
        require:true
    }
})

const avatarModel = mongoose.model("avatar",avatarSchema);

module.exports = avatarModel