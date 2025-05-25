import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [userdata, setUserData] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [totalBlogs, setTotalBlogs] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const _id = Cookies.get("userId");
        if (_id) {
            axios.post(`${import.meta.env.VITE_KEY}/user-fetch`, { _id })
                .then((responseData) => {
                    setUserData(responseData.data.data);
                })
                .catch((err) => {
                    console.log(err);
                });
                
                axios.post(`${import.meta.env.VITE_KEY}/get-user-blog`, {userId: _id })
                .then((responseData) => {
                    setTotalBlogs(responseData.data.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        Cookies.remove('userId');
        Cookies.remove('username');
        window.location.reload(); // Refresh to update auth state
    };

    return (
        <nav className="bg-white shadow-sm py-3 px-6 flex justify-between items-center sticky top-0 z-50">
            {/* Logo */}
            <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    B
                </div>
                <span className="ml-3 text-xl font-semibold text-gray-800">BlogApp</span>
            </Link>

            {/* Profile Section */}
            {userdata ? (
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <span className="hidden sm:inline text-gray-700">{userdata.username}</span>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100">
                            {userdata.img ? (
                                <img 
                                    src={userdata.img} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    {userdata.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        {userdata.img ? (
                                            <img 
                                                src={userdata.img} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl">
                                                {userdata.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {userdata.username}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {userdata.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="py-1">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Your Profile
                                </Link>
                                <Link
                                    to="/create-blog"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Create Blog
                                </Link>
                                <Link
                                    to="/user-blog"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Your Blogs <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-medium">
  {totalBlogs?.blogData?.length || 0}
</span>
                                </Link>
                            </div>
                            <div className="py-1 border-t border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-600 hover:text-white"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex space-x-4">
                    <Link
                        to="/login"
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;