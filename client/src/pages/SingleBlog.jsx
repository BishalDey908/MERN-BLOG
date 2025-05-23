import axios from 'axios';
import React, { useEffect, useState } from 'react'

const SingleBlog = () => {
    const[blog,setBlog]=useState([]);
    const[username,SetUserName]=useState();
    const[userImg,SetUserImg]=useState();

    useEffect(()=>{
       const _id = localStorage.getItem('_id');
       SetUserName(localStorage.getItem("username"))
       SetUserImg(localStorage.getItem("userImg"))
       axios.post(`${import.meta.env.VITE_KEY}/get-single-blog`,{_id})
       .then((blogData)=>{
             setBlog(blogData.data.data[0]);
       })
       .catch((err)=>{
             console.log(err);
       })
    },[])

    console.log(blog);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 lg:px-8">
  {/* Featured Image with subtle hover effect */}
  <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
    <img
      src={blog.image || 'https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013353/blog_img/hj4csla0yvu3iduibbbd.png'}
      alt={blog.title}
      className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
    />
  </div>

  {/* Category Tag */}
  <div className="mb-4">
    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
      {blog.category}
    </span>
  </div>

  {/* Blog Title */}
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
    {blog.title}
  </h1>

  {/* Author and Date */}
  <div className="flex items-center mb-8">
    <img
      src={userImg || 'https://via.placeholder.com/50'}
      alt={username || 'Author'}
      className="w-10 h-10 rounded-full object-cover mr-3"
    />
    <div>
      <p className="text-sm font-medium text-gray-900">
        {username || 'Unknown Author'}
      </p>
      <p className="text-xs text-gray-500">
        {new Date(blog.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    </div>
  </div>

  {/* Short Description */}
  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
    {blog.description}
  </p>

  {/* Main Content */}
  <div className="prose max-w-none text-gray-800 mb-8">
    {blog.blog}
  </div>

  {/* Tags (if available) */}
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

  {/* Social Sharing */}
  <div className="border-t border-gray-200 pt-6">
    <h3 className="text-sm font-semibold text-gray-500 mb-3">SHARE THIS POST</h3>
    <div className="flex space-x-4">
      <button className="text-gray-500 hover:text-blue-600 transition-colors">
        {/* <TwitterIcon className="w-5 h-5" /> */}
      </button>
      <button className="text-gray-500 hover:text-blue-800 transition-colors">
        {/* <FacebookIcon className="w-5 h-5" /> */}
      </button>
      <button className="text-gray-500 hover:text-red-600 transition-colors">
        {/* <LinkedInIcon className="w-5 h-5" /> */}
      </button>
    </div>
  </div>
</div>
  )
}

export default SingleBlog
