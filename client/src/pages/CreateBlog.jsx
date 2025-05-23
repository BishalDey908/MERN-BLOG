import React, { useState } from "react";
import axios from "axios";

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    blog: "",
  });
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async () => {
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "blog_preset");

    try {
      const cloudName = "dzk2q7sk2";
      const resourceType = "image";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      console.log(secure_url)
      return secure_url;
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
      if (img) {
        imgUrl = await uploadFile();
      }

      // Here you would typically send all data to your backend
      const blogData = {
        ...formData,
        imageUrl: imgUrl,
      };

      // Validate required fields
      if (!formData.title || !formData.blog ||!blogData.imageUrl ) {
        throw new Error("Title,Featured Img,Blog Content are required");
      }

      console.log(blogData);
      if (imgUrl) {
         axios.post(`${import.meta.env.VITE_KEY}/create-blog`, { title:blogData.title,description:blogData.description,image:blogData.imageUrl,blog:blogData.blog })
          .then((data) => {
            console.log(data)
            if(data){
                setMessage({ text: data.data.message, type: "success" });
                // Reset form after successful submission
                setFormData({
                  title: "",
                  description: "",
                  blog: "",
                });
                setImg(null);
                setPreview("");
            }else{
                setMessage({ text: data.data.message, type: "failed" });
            }
          })
          .catch((err)=>{
               console.log(err);
          })
      }
    } catch (err) {
      console.error("Submission error:", err);
      setMessage({
        text: err.message || "Failed to create blog",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Blog</h1>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
          />
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter short description"
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label
            htmlFor="img"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Featured Image*
          </label>
          <input
            type="file"
            id="img"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
          />
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="h-40 object-cover rounded-md border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Blog Content Field */}
        <div>
          <label
            htmlFor="blog"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Blog Content*
          </label>
          <textarea
            id="blog"
            name="blog"
            value={formData.blog}
            onChange={handleChange}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your blog content here..."
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isSubmitting ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
