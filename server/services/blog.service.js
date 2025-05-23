const { message } = require("statuses");
const  blogModel  = require("../models/blog.model");
const blogCategoryModel = require("../models/blog-catagory.models");

const createBlogService = async(data) =>{
    try{
        const{userId,category,title,description,blog,image} = data;
        console.log("category",category)
        if(!title || !description || !blog){
            return {success:false,message:"title,description,blog Content required"}
        }
        const createdData = await blogModel.create({userId,category,title,description,blog,image});
        if(createdData){
            return {success:true,message:"Blog created Success",data:createdData};
        }else{
            return {success:false,message:"Blog creation failed",data:createdData};
        }
    }catch(err){
            return {success:false,message:"Something went wrong",error:err};
    }
}

const getBlogService = async (data) => {
    try {
        // Create the initial match stage (empty if no category filter)
        const matchStage = data?.category 
            ? { $match: { category: data.category } } 
            : { $match: {} };

        const blogsWithUserData = await blogModel.aggregate([
            // First filter by category if provided
            matchStage,
            // Then join with users collection
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    createdAtHuman: {
                        $dateToString: {
                            format: "%H:%M  ",
                            date: "$createdAt",
                            timezone: "Asia/Kolkata" // Adjust timezone as needed
                        }
                    },
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    category: 1,
                    title: 1,
                    description: 1,
                    image: 1,
                    blog: 1,
                    createdAt: 1,
                    createdAtHuman: 1,
                    updatedAt: 1,
                    user: {
                        _id: "$userData._id",
                        username: "$userData.username",
                        email: "$userData.email",
                        profilePic: "$userData.img"
                    }
                }
            }
        ]);

        if (blogsWithUserData.length > 0) {
            const message = data?.category 
                ? `Blogs in category '${data.category}' fetched successfully`
                : "All blogs fetched successfully";
                
            return { 
                success: true, 
                message: message, 
                data: blogsWithUserData 
            };
        } else {
            const message = data?.category 
                ? `No blogs found in category '${data.category}'`
                : "No blogs found";
                
            return { 
                success: false, 
                message: message, 
                data: blogsWithUserData 
            };
        }
    } catch (err) {
        return { 
            success: false, 
            message: "Something went wrong", 
            error: err 
        };
    }
};

const getBlogCategoryService = async(data) =>{
    try{
        const receaveData = await blogCategoryModel.find({});
        if(receaveData){
            return {success:true,message:"Blog Category Found Successful",data:receaveData};
        }else{
            return {success:false,message:"Blog Category Not Found",data:receaveData};
        }
    }catch(err){
            return {success:false,message:"Something Went Wrong",error:err};
    }
}

const getSingleBlogService = async(data) =>{
    try{
        const{_id}=data
        const receaveData = await blogModel.find({_id});
        if(receaveData){
            return {success:true,message:"Blog Found",data:receaveData};
        }else{
            return {success:false,message:"Blog Not Found",data:receaveData};
        }
    }catch(err){
            return {success:false,message:"Something Went Wrong",error:err};
    }
}

module.exports = {
     createBlogService,
     getBlogCategoryService,
     getBlogService,
     getSingleBlogService
}