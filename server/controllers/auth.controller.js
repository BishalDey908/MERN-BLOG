const { userRegServices, verifyOTPServices, loginService } = require("../services/auth.service")

const userRegisterController = async(req,res) =>{
    try{
      const receaveData = await userRegServices(req.body);
      if(receaveData.success){
        res.status(200).json({message:"User Register Success",success:receaveData.success,data:receaveData.data})
      }else{
        res.status(400).json({message:receaveData.message,success:receaveData.success,error:receaveData.error})
      }
    }catch(err){
        console.log(err);
         res.status(400).json({message:"Something Went Wrong",error:err})
    }
}

const verifyOtpController = async(req,res) =>{
    try{
      const receaveData = await verifyOTPServices(req.body);
      console.log(receaveData)
      if(receaveData.success){
        res.status(200).json({message:receaveData.message,success:receaveData.success,data:receaveData.data})
      }else{
        res.status(400).json({message:receaveData.message,success:receaveData.success,error:receaveData.error})
      }
    }catch(err){
        console.log(err);
         res.status(400).json({message:"Something Went Wrong",error:err})
    }
}

const loginController = async(req,res) =>{
    try{
      console.log(req.body);
      const receaveData = await loginService(req.body);
      console.log(receaveData)
      if(receaveData.success){
        res.status(200).json({message:receaveData.message,success:receaveData.success,data:receaveData.data})
      }else{
        res.status(400).json({message:receaveData.message,success:receaveData.success,error:receaveData.error})
      }
    }catch(err){
        console.log(err);
         res.status(400).json({message:"Something Went Wrong",error:err})
    }
}

module.exports = {
    userRegisterController,
    verifyOtpController,
    loginController
}