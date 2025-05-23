import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ShowBlog = () => {
    const[category,setCategory]=useState([])
    const[selectCategory,setSelectCategory] = useState(null)
    const[blog,setBlog] = useState([])

    const navigate = useNavigate()

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_KEY}/get-blog-category`)
        .then((category)=>{
            setCategory(category.data.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    useEffect(()=>{
       axios.post(`${import.meta.env.VITE_KEY}/get-blog`,{category:selectCategory})
       .then((blog)=>{
            setBlog(blog.data.data)
       })
       .catch((err)=>{
            console.log(err)
       })

    },[selectCategory])

    const localStorageSet = (data) =>{
        const _id = data._id
        localStorage.setItem("_id",data._id)
        localStorage.setItem("username",data.user.username)
        localStorage.setItem("userImg",data.user.profilePic)
        console.log(data._id)
        navigate("/single-blog")
    }

    console.log(category)
    console.log("blog",blog)
    
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Categories</h1>
        <p className="text-gray-500">Discover content by topic</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {category.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectCategory(category.category)}
            className={`
              p-4 rounded-xl transition-all duration-300
              border-2 hover:border-blue-500
              ${selectCategory === category.category 
                ? 'bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105' 
                : 'bg-white text-gray-800 border-gray-200 hover:shadow-md'}
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

      {selectCategory && (
        <div className="mt-10 text-center">
          <p className="text-gray-600">
            Showing content for: <span className="font-bold text-blue-600">{selectCategory}</span>
          </p>
          <button 
            onClick={() => setSelectCategory(null)}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Blog Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {blog.map((blogData) => (
    <div 
      key={blogData._id}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Blog Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={blogData.image || 'https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013353/blog_img/hj4csla0yvu3iduibbbd.png'}
          alt={blogData.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      {/* Blog Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category and Time */}
        <div className="flex justify-between items-start mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {blogData.category}
          </span>
          
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">
              {blogData.createdAtHuman}
            </span>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {blogData.title}
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blogData.description}
        </p>
        
        {/* Author Info */}
        <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
          <img
            src={blogData.user.profilePic || 'https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013622/blog_img/e21vqes5qf0epwsu3xvt.png'}
            alt={blogData.user.username}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {blogData.user.username}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(blogData.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        {/* Read More Button */}
        <button onClick={()=>localStorageSet(blogData)} className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300">
          Read More
        </button>
      </div>
    </div>
  ))}
</div>
    </div>
    </div>
  )
}

export default ShowBlog
