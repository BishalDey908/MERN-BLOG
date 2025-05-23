const usermodel = require("../models/user.models")

//get user profile
const getProfileService = async(data)=>{
    const{_id}=data;
    console.log(_id)
     try{
        const getUserprofile = await usermodel.findOne({_id});
        console.log(getUserprofile);
        const filterUserData = {username:getUserprofile.username,email:getUserprofile.email,img:getUserprofile.img,isVerified:getUserprofile.isVerified}
        if(getUserprofile){
            return {message:"User fetched success",success:true,data:filterUserData};
        }else{
            return {message:"User not found",success:false,data:getUserprofile};
        }
     }catch(err){
           return {message:"Something Went Wrong",success:false,err:err};
     }
}

//delete user
const deleteUserService = async(data) =>{
    try{
        const {_id}=data;
        const responseData = await usermodel.findOneAndDelete({_id});
        if(responseData){
            return {success:true,message:"User Deleted",data:responseData};
        }else{
            return {success:false,message:"User Not Found",data:responseData};
        }
    }catch(err){
            return {success:false,message:"Something Went Wrong",err:err}
    }
}

module.exports = {getProfileService,deleteUserService};