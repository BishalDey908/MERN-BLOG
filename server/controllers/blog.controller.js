const { createBlogService, getBlogCategoryService, getBlogService, getSingleBlogService, usersBlogService, getUsersBlogService, updateUsersBlogService, deleteUserBlogService, blogLikeService } = require("../services/blog.service")

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

const getUserBlogController =async(req,res)=>{
    try{
        const responseData = await getUsersBlogService(req.body);
        if(responseData.success){
            res.status(200).json({message:responseData.message,success:responseData.success,data:responseData.data})
        }else{
            res.status(400).json({message:responseData.message,success:responseData.success,data:responseData.data})
        }
    }catch(err){
            res.status(400).json({message:responseData.message,success:responseData.success,error:responseData.data})
    }
}

const updateUserBlogController = async (req, res) => {
    try {
        const { _id } = req.params;
        const responseData = await updateUsersBlogService({ _id }, req.body);
        
        if (responseData.success) {
            res.status(200).json({
                message: responseData.message,
                success: responseData.success,
                data: responseData.data
            });
        } else {
            res.status(400).json({
                message: responseData.message,
                success: responseData.success,
                data: responseData.data
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const deleteUserBlogController = async (req, res) => {
    try {
       
        const responseData = await deleteUserBlogService(req.params);
        
        if (responseData.success) {
            res.status(200).json({
                message: responseData.message,
                success: responseData.success,
                data: responseData.data
            });
        } else {
            res.status(400).json({
                message: responseData.message,
                success: responseData.success,
                data: responseData.data
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const likeBlogService = async (req, res) => {
  const result = await blogLikeService(req.body);
  
  if (result.error) {
    return res.status(result.status || 400).json(result);
  }
  
  res.json(result);
};

module.exports = {
 blgCreationController,
 getBlogCategoryController,
 getBlogController,
 getSingleBlogController,
 getUserBlogController,
 updateUserBlogController,
 deleteUserBlogController,
 likeBlogService
}