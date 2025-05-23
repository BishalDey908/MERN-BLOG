const { createBlogService, getBlogCategoryService, getBlogService, getSingleBlogService } = require("../services/blog.service")

const blgCreationController = async(req,res) =>{
    try{
        const responseData = await createBlogService(req.body);
        console.log(req.body)
        if(responseData.success){
            res.status(200).json({message:responseData.message,success:responseData.success,data:responseData.data});
        }else{
            res.status(400).json({message:responseData.message,success:responseData.success,data:responseData.data});
        }
    }catch(err){
        res.status(400).json({message:responseData.message,success:responseData.success,data:responseData.data});
    }
}

const getBlogController = async(req,res) =>{
    try{
        const responseData = await getBlogService(req.body);
        console.log(req.body)
        if(responseData.success){
            res.status(200).json({message:responseData.message,success:responseData.success,data:responseData.data});
        }else{
            res.status(400).json({message:responseData.message,success:responseData.success,data:responseData.data});
        }
    }catch(err){
        res.status(400).json({message:responseData.message,success:responseData.success,data:responseData.data});
    }
}

const getSingleBlogController = async(req,res) =>{
    try{
        const responseData = await getSingleBlogService(req.body);
        console.log(req.body)
        if(responseData.success){
            res.status(200).json({message:responseData.message,success:responseData.success,data:responseData.data});
        }else{
            res.status(400).json({message:responseData.message,success:responseData.success,data:responseData.data});
        }
    }catch(err){
        res.status(400).json({message:responseData.message,success:responseData.success,data:responseData.data});
    }
}

const getBlogCategoryController = async(req,res) =>{
    try{
        const responseData = await getBlogCategoryService();
        if(responseData.success){
            res.status(200).json({message:responseData.message,success:responseData.success,data:responseData.data});
        }else{
            res.status(400).json({message:responseData.message,success:responseData.success,data:responseData.data});
        }
    }catch(err){
        res.status(400).json({message:responseData.message,success:responseData.success,data:responseData.data});
    }
}

module.exports = {
 blgCreationController,
 getBlogCategoryController,
 getBlogController,
 getSingleBlogController
}