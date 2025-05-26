const { message } = require("statuses");
const blogModel = require("../models/blog.model");
const blogCategoryModel = require("../models/blog-catagory.models");
const usermodel = require("../models/user.models");

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
//
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

//users blog
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

module.exports = {
  createBlogService,
  getBlogCategoryService,
  getBlogService,
  getSingleBlogService,
  getUsersBlogService,
  updateUsersBlogService,
  deleteUserBlogService,
  blogLikeService
};
