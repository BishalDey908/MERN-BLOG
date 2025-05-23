const { getProfileService, deleteUserService } = require("../services/user.service");


const getProfileController = async(req,res) =>{
    console.log(req.body)
    try{
       const responseData = await getProfileService(req.body);
       if(responseData.success){
            res.status(200).json({message:responseData.message,success:responseData.success,data:responseData.data})
       }else{
            res.status(200).json({message:responseData.message,success:responseData.success,data:responseData.data})
       }
    }catch(err){
            res.status(200).json({message:responseData.message,success:responseData.success,data:responseData.data})
    }
}

const deleteUserController = async(req,res) =>{
    console.log(req.body)
    try{
       const responseData = await deleteUserService(req.body);
       if(responseData.success){
            res.status(200).json({message:responseData.message,success:responseData.success,data:responseData.data})
       }else{
            res.status(200).json({message:responseData.message,success:responseData.success,data:responseData.data})
       }
    }catch(err){
            res.status(200).json({message:responseData.message,success:responseData.success,err:responseData.err})
    }
}

module.exports = {
    getProfileController,
    deleteUserController
}