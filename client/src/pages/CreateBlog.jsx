import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

const CreateBlog = () => {
  const [formData, setFormData] = useState({ title: "", description: "", blog: "" });
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [fetchBlogCatagory, setFetchBlogCatagory] = useState([]);
  const [selectedBlogCategory, setSelectedBlogCategory] = useState();
  const[newBlogTrigger,setNewBlogTrigger] = useState(false)

  console.log(selectedBlogCategory)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_KEY}/get-blog-category`)
      .then((response) => setFetchBlogCatagory(response.data.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
      let imgUrl = null;
      if (img) imgUrl = await uploadFile();

      const blogData = {
        ...formData,
        imageUrl: imgUrl,
        category: selectedBlogCategory,
      };

      if (!formData.title || !formData.blog || !blogData.imageUrl || !blogData.category) {
        throw new Error("Title, Featured Img, Blog Category and Blog Content are required.");
      }
       const userId = Cookies.get("userId")
      const res = await axios.post(`${import.meta.env.VITE_KEY}/create-blog`, {
        userId:userId,
        title: blogData.title,
        description: blogData.description,
        image: blogData.imageUrl,
        blog: blogData.blog,
        category: blogData.category,
      });

      if (res) {
        setMessage({ text: res.data.message, type: "success" });
        setFormData({ title: "", description: "", blog: "" });
        setImg(null);
        setPreview("");
        setNewBlogTrigger(!newBlogTrigger)
        localStorage.setItem("newBlogTrigger",newBlogTrigger)
      }
    } catch (err) {
      setMessage({ text: err.message || "Failed to create blog", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* App Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          MyBlogSpace
        </h1>
        <p className="text-sm text-gray-500 mt-1">Create and share your thoughts with the world</p>
      </header>

      {/* Status Message */}
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

      {/* Blog Form */}
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
            Featured Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full file:px-4 file:py-2 file:border-0 file:rounded-lg file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-40 object-cover rounded-lg border border-gray-200"
            />
          )}
        </div>

        {/* Category Selection */}
        <div>
          <p className="font-medium text-gray-700 mb-2">Select Blog Category</p>
          <div className="flex flex-wrap gap-2">
            {fetchBlogCatagory.map((data, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedBlogCategory(data.category)}
                className={`px-4 py-1.5 text-sm rounded-full font-medium border ${
                  selectedBlogCategory === data.category
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
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-block px-6 py-2 text-white font-medium rounded-lg transition ${
              isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
