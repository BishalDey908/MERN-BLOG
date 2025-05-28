const { message } = require("statuses");
const blogModel = require("../models/blog.model");
const blogCategoryModel = require("../models/blog-catagory.models");
const usermodel = require("../models/user.models");
const commentModel = require("../models/comment.models");

//create blog
const createBlogService = async (data) => {
  try {
    const { userId, category, title, description, blog, image } = data;
    console.log("category", category);
    if (!title || !description || !blog) {
      return {
        success: false,
        message: "title,description,blog Content required",
      };
    }
    const createdData = await blogModel.create({
      userId,
      category,
      title,
      description,
      blog,
      image,
    });
    if (createdData) {
      return {
        success: true,
        message: "Blog created Success",
        data: createdData,
      };
    } else {
      return {
        success: false,
        message: "Blog creation failed",
        data: createdData,
      };
    }
  } catch (err) {
    return { success: false, message: "Something went wrong", error: err };
  }
};

//Get all blogs
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
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          createdAtHuman: {
            $dateToString: {
              format: "%H:%M  ",
              date: "$createdAt",
              timezone: "Asia/Kolkata", // Adjust timezone as needed
            },
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
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
            profilePic: "$userData.img",
          },
        },
      },
    ]);

    if (blogsWithUserData.length > 0) {
      const message = data?.category
        ? `Blogs in category '${data.category}' fetched successfully`
        : "All blogs fetched successfully";

      return {
        success: true,
        message: message,
        data: blogsWithUserData,
      };
    } else {
      const message = data?.category
        ? `No blogs found in category '${data.category}'`
        : "No blogs found";

      return {
        success: false,
        message: message,
        data: blogsWithUserData,
      };
    }
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong",
      error: err,
    };
  }
};

//Get all Blog's Category
const getBlogCategoryService = async (data) => {
  try {
    const receaveData = await blogCategoryModel.find({});
    if (receaveData) {
      return {
        success: true,
        message: "Blog Category Found Successful",
        data: receaveData,
      };
    } else {
      return {
        success: false,
        message: "Blog Category Not Found",
        data: receaveData,
      };
    }
  } catch (err) {
    return { success: false, message: "Something Went Wrong", error: err };
  }
};

//Get single blog
const getSingleBlogService = async (data) => {
  try {
    const { _id } = data;
    const receaveData = await blogModel.find({ _id });
    if (receaveData) {
      return { success: true, message: "Blog Found", data: receaveData };
    } else {
      return { success: false, message: "Blog Not Found", data: receaveData };
    }
  } catch (err) {
    return { success: false, message: "Something Went Wrong", error: err };
  }
};

//user's blog
const getUsersBlogService = async (data) => {
  try {
    const { userId, category } = data;

    var userInfo;
    if (!userId) {
      return { success: false, message: "User ID is required" };
    } else {
      const userData = await usermodel.findOne({ _id: userId });
      userInfo = userData;
    }

    let query = { userId };
    if (category) {
      query.category = category;
    }

    const fetchedData = await blogModel.find(query);

    if (!fetchedData || fetchedData.length === 0) {
      return {
        success: false,
        message: category
          ? "No blogs found in this category"
          : "No blogs found for this user",
      };
    }

    return {
      success: true,
      message: "Blogs fetched successfully",
      data: { blogData: fetchedData, userData: userInfo },
    };
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return {
      success: false,
      message: "Something went wrong",
      error: err.message,
    };
  }
};

//update user's blog
const updateUsersBlogService = async (data, updateData) => {
  try {
    // Validate inputs
    if (!data || !data._id) {
      return {
        success: false,
        message: "Blog ID is required",
        data: null,
      };
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return {
        success: false,
        message: "No update data provided",
        data: null,
      };
    }

    const { _id } = data;

    // Perform the update
    const updatedDataResult = await blogModel.findOneAndUpdate(
      { _id },
      { $set: updateData }, // Use $set operator for safer updates
      {
        new: true,
        runValidators: true, // Ensure validations are run on update
      }
    );

    if (!updatedDataResult) {
      return {
        success: false,
        message: "Blog not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Blog updated successfully",
      data: updatedDataResult,
    };
  } catch (err) {
    console.error("Error updating blog:", err);
    return {
      success: false,
      message: err.message.includes("validation")
        ? "Validation failed: " + err.message
        : "Failed to update blog",
      error: err.message,
      data: null,
    };
  }
};

//delete user's blog
const deleteUserBlogService = async (userData) => {
  try {
    const { _id } = userData;
    console.log(_id);
    const data = await blogModel.findOneAndDelete({ _id });
    if (data) {
      return { success: true, message: "Blog deleted Success", data: data };
    } else {
      return { success: false, message: "Blog deleted Success", data: data };
    }
  } catch (err) {
    return { success: false, message: "Something went wrong", errror: err };
  }
};

//blog like 
const blogLikeService = async (data) => {
  try {
    const { blogId, userId } = data;
    
    // Validate input
    if (!blogId || !userId) {
      return { error: "Both blogId and userId are required" };
    }

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return { error: "Blog not found", status: 404 };
    }

    // Check if user already liked
    const alreadyLiked = blog.likes.some(id => id.toString() === userId.toString());

    if (alreadyLiked) {
      // Unlike
      blog.likes = blog.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      blog.likes.push(userId);
    }

    await blog.save();
    return { 
      success: true,
      likes: blog.likes, 
      isLiked: !alreadyLiked,
      likeCount: blog.likes.length 
    };
    
  } catch (err) {
    console.error("Error in blogLikeService:", err);
    return { 
      error: "Server error", 
      status: 500,
      message: err.message 
    };
  }
};

//Create Comment
const createCommentService = async (data) => {
  try {
    const {blogId, userId, comment } = data;
    console.log(data)
    
    // Validate required fields
    if (!blogId || !userId || !comment) {
      return {
        success: false,
        message: "Missing required fields userId and comment"
      };
    }
    
    let userData
    await usermodel.findOne({_id:userId})
    .then((data)=>{
      userData = data     
    })
    .catch((err)=>{
      console.log(err)
    })

    const newComment = await commentModel.create({
      username:userData.username,
      userId,
      userImg:userData.img,
      blogId,
      comment
    });

    return {
      success: true,
      message: "Comment posted successfully",
      data: newComment
    };

  } catch (err) {
    console.error("Error creating comment:", err);
    return {
      success: false,
      message: err.message || "Failed to create comment",
      error: process.env.NODE_ENV === 'development' ? err : undefined
    };
  }
};

//Delete Comment
const deleteCommentService = async (data) => {
  try {
    const { commentId, userId } = data;
    
    // Validate required fields
    if (!commentId || !userId) {
      return {
        success: false,
        message: "Missing required fields: commentId and userId"
      };
    }

    // Find and delete the comment if it belongs to the user
    const deletedComment = await commentModel.findOneAndDelete({
      _id: commentId,
      userId
    });

    if (!deletedComment) {
      return {
        success: false,
        message: "Comment not found or you don't have permission to delete it"
      };
    }

    return {
      success: true,
      message: "Comment deleted successfully",
      data: deletedComment
    };

  } catch (err) {
    console.error("Error deleting comment:", err);
    return {
      success: false,
      message: err.message || "Failed to delete comment",
      error: process.env.NODE_ENV === 'development' ? err : undefined
    };
  }
};

//get user comment
const getUserCommentService = async(data) =>{
     const{blogId} = data
     try{
     const response = await commentModel.find({ blogId }).sort({ createdAt: -1 });
     if(response){
      return {success:true,message:"comment get successful",data:response}
     }else{
       return {success:false,message:"comment get failed",data:response}
     }
     }catch(err){
        return {success:false,message:"Something went wrong",data:err}
     }
}

module.exports = {
  createBlogService,
  getBlogCategoryService,
  getBlogService,
  getSingleBlogService,
  getUsersBlogService,
  updateUsersBlogService,
  deleteUserBlogService,
  blogLikeService,
  createCommentService,
  getUserCommentService,
  deleteCommentService
};
