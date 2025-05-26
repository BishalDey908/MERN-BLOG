import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Cookies from 'js-cookie';

const SingleBlog = () => {
    const [blog, setBlog] = useState({});
    const [username, setUsername] = useState('');
    const [userImg, setUserImg] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const _id = localStorage.getItem('_id');
                if (!_id) {
                    throw new Error('Blog ID not found');
                }

                setUsername(localStorage.getItem("username") || '');
                setUserImg(localStorage.getItem("userImg") || '');

                const response = await axios.post(
                    `${import.meta.env.VITE_KEY}/get-single-blog`,
                    { _id }
                );

                if (!response.data.data || !response.data.data[0]) {
                    throw new Error('Blog data not found');
                }

                const blogData = response.data.data[0];
                setBlog(blogData);
                setLikeCount(blogData.likes?.length || 0);

                // Check if current user liked this blog
                if (userId && blogData.likes?.includes(userId)) {
                    setIsLiked(true);
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError(err.message || 'Failed to load blog');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [userId]);

    const handleLike = async () => {
        if (!userId) {
            alert('Please login to like this blog');
            return;
        }

        if (!blog._id) {
            console.error('Blog ID is missing');
            return;
        }

        try {
          const _id = localStorage.getItem('_id');
            const response = await axios.post(
                `${import.meta.env.VITE_KEY}/like-blog`,
                {
                    blogId: _id,
                    userId
                }
            );

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            setIsLiked(response.data.isLiked);
            setLikeCount(response.data.likes.length);
        } catch (error) {
            console.error('Error liking blog:', error);
            alert(error.message || 'Failed to update like');
        }
    };

    if (loading) {
        return <div className="max-w-4xl mx-auto px-4 py-8 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="max-w-4xl mx-auto px-4 py-8 text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 lg:px-8">
            {/* Like Button - Moved to more prominent position */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <button 
                        onClick={handleLike}
                        className="flex items-center gap-2 text-lg hover:text-red-500 transition-colors"
                        aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
                    >
                        {isLiked ? (
                            <FaHeart className="text-red-500 text-2xl" />
                        ) : (
                            <FaRegHeart className="text-2xl" />
                        )}
                        <span className="font-medium">{likeCount}</span>
                    </button>
                </div>
                {/* Category Tag - Moved here */}
                {blog.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {blog.category}
                    </span>
                )}
            </div>

            {/* Featured Image */}
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                    src={blog.image || 'https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013353/blog_img/hj4csla0yvu3iduibbbd.png'}
                    alt={blog.title || 'Blog image'}
                    className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                        e.target.src = 'https://res.cloudinary.com/dzk2q7sk2/image/upload/v1748013353/blog_img/hj4csla0yvu3iduibbbd.png';
                    }}
                />
            </div>

            {/* Blog Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title || 'Untitled Blog'}
            </h1>

            {/* Author and Date */}
            <div className="flex items-center mb-8">
                <img
                    src={userImg || 'https://via.placeholder.com/50'}
                    alt={username || 'Author'}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50';
                    }}
                />
                <div>
                    <p className="text-sm font-medium text-gray-900">
                        {username || 'Unknown Author'}
                    </p>
                    {blog.createdAt && (
                        <p className="text-xs text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
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
                {blog.blog || 'No content available'}
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
        </div>
    );
};

export default SingleBlog;