const { types } = require("mime-types");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true
    },
    otp:{
        type:String,
    },
    img:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{ timestamps: true })

const usermodel = mongoose.model("user",userSchema);

module.exports = usermodel;