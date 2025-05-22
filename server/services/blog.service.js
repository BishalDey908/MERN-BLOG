const  blogModel  = require("../models/blog.model");

const createBlogService = async(data) =>{
    try{
        const{userId,catagoryId,title,description,blog} = data;
        const createdData = await blogModel.create({userId,catagoryId,title,description,blog});
        if(createdData){
            return {success:true,message:"Blog created Success",data:createdData};
        }else{
            return {success:false,message:"Blog creation failed",data:createdData};
        }
    }catch(err){
            return {success:false,message:"Something went wrong",error:err};
    }
}

module.exports = {
     createBlogService
}