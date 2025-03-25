import React from 'react'
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatDate';

const BlogCard = ({ blogs, currentPage, pageSize, selectedCategory }) => {
    const filteredBlogs = blogs
        .filter((blogs) => !selectedCategory || blogs.category === selectedCategory)
        .slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return (
        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
            {
                filteredBlogs.map(blog => <Link to={`/blog/${blog.id}`} key={blog.id} className='p-5 shadow-lg rounded cursor-pointer'>
                    <div>
                        <img src="https://picsum.photos/id/237/200/300" alt="" className='w-full h-64' />
                    </div>
                    <h3 className='mt-4 mb-2 font-bold hover:text-blue-600 cursor-pointer'>{blog.title}</h3>
                    <p className='mb-2 text-sm text-gray-600'><FaUser className='inline-flex items-center mr-2' />Admin</p>
                    <p className='text-sm text-gray-500'>Tạo vào: {formatDate(blog.createdAt)}</p>
                </Link>)
            }
        </div>
    )
}

export default BlogCard