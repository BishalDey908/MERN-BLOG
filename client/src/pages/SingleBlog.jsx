import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Cookies from "js-cookie";

const SingleBlog = () => {
  const [blog, setBlog] = useState({});
  const [username, setUsername] = useState("");
  const [userImg, setUserImg] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [postComment, setPostComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const userId = Cookies.get("userId");
  const blogId = localStorage.getItem("_id");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const _id = localStorage.getItem("_id");
        if (!_id) {
          throw new Error("Blog ID not found");
        }

        setUsername(localStorage.getItem("username") || "");
        setUserImg(localStorage.getItem("userImg") || "");

        const [blogResponse, commentsResponse] = await Promise.all([
          axios.post(`${import.meta.env.VITE_KEY}/get-single-blog`, { _id }),
          axios.post(`${import.meta.env.VITE_KEY}/get-comment`, {
            blogId: _id,
          }),
        ]);

        if (!blogResponse.data.data || !blogResponse.data.data[0]) {
          throw new Error("Blog data not found");
        }

        const blogData = blogResponse.data.data[0];
        setBlog(blogData);
        setLikeCount(blogData.likes?.length || 0);
        setIsLiked(userId && blogData.likes?.includes(userId));

        // Sort comments by createdAt in descending order (newest first)
        const sortedComments = commentsResponse.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [userId, blogId, trigger]);

  const handleLike = async () => {
    if (!userId) {
      alert("Please login to like this blog");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_KEY}/like-blog`,
        { blogId, userId }
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likes.length);
    } catch (error) {
      console.error("Error liking blog:", error);
      alert(error.message || "Failed to update like");
    }
  };

  const handlePostComment = async () => {
    if (!postComment.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    setIsCommenting(true);
    setCommentError(null);

    try {
      const userId = Cookies.get("userId");
      const response = await axios.post(
        `${import.meta.env.VITE_KEY}/create-comment`,
        { comment: postComment, userId, blogId }
      );

      console.log(postComment, userId, blogId);
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Add new comment to the top of the list
      setComments([response.data.data, ...comments]);
      setPostComment("");
      alert("Comment posted successfully");
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError(err.message || "Failed to post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-red-500 text-center">
        {error}
      </div>
    );
  }

 const handleDelete = async (commentId) => {
  try {
    const userId = Cookies.get("userId");
    console.log(userId,commentId)
    
    if (!userId) {
      alert("Please login to delete comments");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_KEY}/delete-comment`,
      { commentId, userId }
    );

    if (response.data.success) {
      // Update UI by filtering out the deleted comment
      setComments(prevComments => 
        prevComments.filter(comment => comment._id !== commentId)
      );
      alert("Comment deleted successfully");
    } else {
      throw new Error(response.data.message || "Failed to delete comment");
    }
  } catch (err) {
    console.error("Delete error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to delete comment");
  }
};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      {/* Like Button and Category */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-lg hover:text-red-500 transition-colors"
            aria-label={isLiked ? "Unlike this post" : "Like this post"}
          >
            {isLiked ? (
              <FaHeart className="text-red-500 text-2xl" />
            ) : (
              <FaRegHeart className="text-2xl" />
            )}
            <span className="font-medium">{likeCount}</span>
          </button>
        </div>
        {blog.category && (
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            {blog.category}
          </span>
        )}
      </div>

      {/* Featured Image */}
      <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
        <img
          src={
            blog.image ||
            "https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013353/blog_img/hj4csla0yvu3iduibbbd.png"
          }
          alt={blog.title || "Blog image"}
          className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013353/blog_img/hj4csla0yvu3iduibbbd.png";
          }}
        />
      </div>

      {/* Blog Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {blog.title || "Untitled Blog"}
      </h1>

      {/* Author and Date */}
      <div className="flex items-center mb-8">
        <img
          src={userImg || "https://via.placeholder.com/50"}
          alt={username || "Author"}
          className="w-10 h-10 rounded-full object-cover mr-3"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/50";
          }}
        />
        <div>
          <p className="text-sm font-medium text-gray-900">
            {username || "Unknown Author"}
          </p>
          {blog.createdAt && (
            <p className="text-xs text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Short Description */}
      {blog.description && (
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {blog.description}
        </p>
      )}

      {/* Main Content */}
      <div className="prose max-w-none text-gray-800 mb-8">
        {blog.blog || "No content available"}
      </div>

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">TAGS</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-12 border-t pt-8">
        <h3 className="text-xl font-semibold mb-6">
          Comments ({comments.length})
        </h3>

        {/* Comment Form */}
        <div className="mb-8">
          <div className="flex items-start gap-3">
            <img
              src={userImg || "https://via.placeholder.com/50"}
              alt={username || "User"}
              className="w-10 h-10 rounded-full object-cover mt-1"
            />
            <div className="flex-1">
              <textarea
                value={postComment}
                onChange={(e) => setPostComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
              {commentError && (
                <p className="text-red-500 text-sm mt-1">{commentError}</p>
              )}
              <button
                onClick={handlePostComment}
                disabled={isCommenting}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {isCommenting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={comment.userImg || "/default-avatar.png"}
                    alt={comment.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm font-medium text-gray-800">
                          {comment.username}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      {comment.comment}
                    </div>

                    <button
  onClick={() => handleDelete(comment._id)}
  className="text-sm text-red-500 hover:text-red-700 hover:underline focus:outline-none"
>
  Delete
</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
