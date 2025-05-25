import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    blog: "",
    category: ""
  });
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [blogCategories, setBlogCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blog data and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setMessage({ text: "", type: "" });

        // Fetch blog categories
        const categoriesResponse = await axios.get(
          `${import.meta.env.VITE_KEY}/get-blog-category`
        );
        setBlogCategories(categoriesResponse.data.data || []);

        // Fetch blog data
        const blogResponse = await axios.post(
          `${import.meta.env.VITE_KEY}/get-single-blog/`,
          { _id: id }
        );
        
        if (blogResponse.data.success && blogResponse.data.data) {
          const blogData = blogResponse.data.data;
          console.log("data.data",blogData[0].title)
          setFormData({
            title: blogData[0].title || "",
            description: blogData[0].description || "",
            blog: blogData[0].blog || "",
            img: blogData[0].img || "",
            category: blogData[0].category || ""
          });
          
          if (blogData[0].image) {
            setPreview(blogData[0].image);
          }
        } else {
          throw new Error("Blog data not found");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setMessage({ 
          text: err.response?.data?.message || "Failed to load blog data", 
          type: "error" 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log("formdata",formData)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async () => {
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "blog_preset");

    try {
      const cloudName = "dzk2q7sk2";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const res = await axios.post(api, data);
      return res.data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      let imgUrl = preview;

      if (img) {
        imgUrl = await uploadFile();
      }

      if (!formData.title || !formData.blog) {
        throw new Error("Title and Blog Content are required.");
      }

      const updateData = {
        title: formData.title,
        description: formData.description,
        blog: formData.blog,
        category: formData.category
      };

      if (imgUrl && imgUrl !== preview) {
        updateData.image = imgUrl;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_KEY}/update-user-blog/${id}`,
        updateData
      );

      if (res.data.success) {
        setMessage({ 
          text: "Blog updated successfully!", 
          type: "success" 
        });
        setTimeout(() => navigate(`/user-blog/`), 2000);
      } else {
        throw new Error(res.data.message || "Update failed");
      }
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || err.message || "Failed to update blog", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p>Loading blog data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Update Blog Post
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit and improve your existing blog post
        </p>
      </header>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium mb-1 text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter blog title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1 text-gray-700">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter a short description"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Featured Image
          </label>
          <div className="flex items-center gap-4">
            {preview && (
              <img
                src={preview}
                alt="Current featured"
                className="h-24 w-24 object-cover rounded-lg border border-gray-200"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full file:px-4 file:py-2 file:border-0 file:rounded-lg file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {img ? "New image selected" : "Leave blank to keep current image"}
          </p>
        </div>

        {/* Category Selection */}
        <div>
          <p className="font-medium text-gray-700 mb-2">Select Blog Category</p>
          <div className="flex flex-wrap gap-2">
            {blogCategories.map((data, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  category: data.category
                }))}
                className={`px-4 py-1.5 text-sm rounded-full font-medium border ${
                  formData.category === data.category
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
              >
                {data.category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Content */}
        <div>
          <label htmlFor="blog" className="block font-medium mb-1 text-gray-700">
            Blog Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="blog"
            name="blog"
            rows="8"
            value={formData.blog}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Write your blog here..."
            required
          />
        </div>

        {/* Submit and Cancel */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-block px-6 py-2 text-white font-medium rounded-lg transition ${
              isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;