import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FiEdit } from "react-icons/fi"; // Import edit icon from react-icons
import {  FiTrash2 } from "react-icons/fi"; // Added trash icon

const UserBlog = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [userData, setUserData] = useState();
  const[eventHandler,setEventHandler] = useState(false)
  const [loading, setLoading] = useState({
    categories: true,
    blogs: true,
  });
  const [error, setError] = useState({
    categories: null,
    blogs: null,
  });
  

  const navigate = useNavigate();
  const userId = Cookies.get("userId");
  const currentUserId = userId; // The currently logged-in user

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_KEY}/get-blog-category`
        );
        setCategories(response.data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError((prev) => ({
          ...prev,
          categories: "Failed to load categories",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    fetchCategories();
  }, []);

  // Fetch blogs based on selected category
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading((prev) => ({ ...prev, blogs: true }));
        const response = await axios.post(
          `${import.meta.env.VITE_KEY}/get-user-blog`,
          { userId, category: selectedCategory }
        );
        setBlogs(response.data.data || []);
        setUserData(response.data.data.userData);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError((prev) => ({ ...prev, blogs: "Failed to load blogs" }));
      } finally {
        setLoading((prev) => ({ ...prev, blogs: false }));
      }
    };

    if (userId) {
      fetchBlogs();
    } else {
      setError((prev) => ({ ...prev, blogs: "User ID not found" }));
      setLoading((prev) => ({ ...prev, blogs: false }));
    }
  }, [selectedCategory, userId,eventHandler]);

  const localStorageSet = (blogData, data) => {
    localStorage.setItem("_id", blogData._id);
    localStorage.setItem("username", data.username);
    localStorage.setItem("userImg", data.img);
    navigate("/single-blog");
  };

  const handleEditBlog = (blogId) => {
    // Navigate to edit page or open edit modal
    navigate(`/edit-blog/${blogId}`);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  if (loading.categories) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error.categories) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-red-500">
        <p>{error.categories}</p>
      </div>
    );
  }

  // Add delete function
  const handleDeleteBlog = async (blogId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
      if (!confirmDelete) return;
      const _id =blogId
      const response = await axios.post(
        `${import.meta.env.VITE_KEY}/delete-user-blog/${_id}`,
        { data: { userId } } // Send userId in request body
      );

      if (response.data.success) {
        // Remove the deleted blog from state
        setBlogs(prev => ({
          ...prev,
          blogData: prev.blogData.filter(blog => blog._id !== blogId)
        }));
        window.location.reload()
        alert("Blog deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete blog");
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Browse Categories
        </h1>
        <p className="text-gray-500">Discover content by topic</p>
      </div>

      <div className="grid  grid-cols sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category.category)}
            className={`
                                p-4 rounded-xl transition-all duration-300
                                border-2 hover:border-blue-500
                                ${
                                  selectedCategory === category.category
                                    ? "bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105"
                                    : "bg-white text-gray-800 border-gray-200 hover:shadow-md"
                                }
                                flex items-center justify-center
                                h-24 sm:h-28
                                hover:transform hover:scale-105
                            `}
          >
            <span className="font-medium text-sm sm:text-base">
              {category.category}
            </span>
          </button>
        ))}
      </div>

      <div className="text-center">
        {selectedCategory && (
          <button
            onClick={clearCategoryFilter}
            className="mt-2 text-blue-500 hover:text-white hover:bg-blue-500 text-2xl bg-white border-gray-200 border-2 px-4 py-2 rounded-2xl"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Blogs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Latest Blog Posts
        </h1>

        {loading.blogs ? (
          <div className="text-center py-12">
            <p>Loading blogs...</p>
          </div>
        ) : error.blogs ? (
          <div className="text-center text-red-500 py-12">
            <p>{error.blogs}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p>
              No blogs found
              {selectedCategory ? ` in the ${selectedCategory} category` : ""}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.blogData.map((blogData) => (
              <div
                key={blogData._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full relative" // Added relative for absolute positioning
              >
                {/* Edit Icon - only shown if blog belongs to current user */}
                      {blogData.userId === currentUserId && (
        <div className="absolute top-3 right-3 z-10 flex space-x-2">
          <button
            onClick={() => handleEditBlog(blogData._id)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Edit blog"
          >
            <FiEdit className="text-gray-600 hover:text-blue-600" />
          </button>
          <button
            onClick={() => handleDeleteBlog(blogData._id)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Delete blog"
          >
            <FiTrash2 className="text-gray-600 hover:text-red-600" />
          </button>
        </div>
      )}

                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      blogData.image ||
                      "https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013353/blog_img/hj4csla0yvu3iduibbbd.png"
                    }
                    alt={blogData.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        "https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013353/blog_img/hj4csla0yvu3iduibbbd.png";
                    }}
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {blogData.category}
                    </span>

                    <div className="flex items-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-xs">
                        {blogData.createdAtHuman ||
                          new Date(blogData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {blogData.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blogData.description}
                  </p>

                  <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                    <img
                      src={
                        userData.img ||
                        "https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013622/blog_img/e21vqes5qf0epwsu3xvt.png"
                      }
                      alt={userData.username}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                      onError={(e) => {
                        e.target.src =
                          "https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013622/blog_img/e21vqes5qf0epwsu3xvt.png";
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {userData.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(blogData.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => localStorageSet(blogData, userData)}
                    className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBlog;
