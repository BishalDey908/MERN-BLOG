const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    userId:{
        require:true,
        unique:true,
        type: mongoose.Schema.ObjectId
    },
    otp:{
        type:String,
        require:true,
    }
}) 

const otpModel = new mongoose.model("otp",otpSchema)

module.exports = {
    otpModel
}