import React, { useEffect, useState } from 'react'
import useBlogService from '../../services/useBlogService';
import BlogCard from '../../components/molecules/blog/BlogCard';
import Pagination from '../../components/molecules/blog/Pagination';

const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { getBlogs } = useBlogService();
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            const result = await getBlogs({
                categoryId: "",
                isPublished: 1,
                pageNum: currentPage,
                pageSize: pageSize,
            });
            console.log(result.data.pageData);
            setBlogs(result.data.pageData);
        }
        fetchBlogs();
    }, [currentPage, pageSize, selectedCategory])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setActiveCategory(category)
    }
    return (
        <div className='p-8'>
            <div>Category section</div>

            <div><BlogCard blogs={blogs} currentPage={currentPage} pageSize={pageSize} selectedCategory={selectedCategory} /></div>

            <div>
                <Pagination onPageChange={handlePageChange} currentPage={currentPage} pageSize={pageSize} blogs={blogs} />
            </div>
        </div>
    )
}

export default BlogPage