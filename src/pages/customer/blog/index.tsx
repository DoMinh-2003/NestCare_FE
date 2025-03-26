import React, { useEffect, useState } from 'react'
import useBlogService from '../../../services/useBlogService';
import BlogCard from '../../../components/molecules/blog/BlogCard';
import Pagination from '../../../components/molecules/blog/Pagination';
import CategorySelection from '../../../components/molecules/blog/CategorySelection';
import Sidebar from '../../../components/molecules/blog/Sidebar';

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

    const handleCategorySelected = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setActiveCategory(category)
    }
    return (
        <div className='p-8 max-w-7xl mx-auto'>
            <div><CategorySelection onSelectedCategory={handleCategorySelected} selectedCategory={selectedCategory} activeCategory={activeCategory} /></div>

            <div className="flex flex-col gap-12 md:flex-row">
                <div className="md:w-3/4 lg:w-4/5 w-full">
                    <BlogCard blogs={blogs} currentPage={currentPage} pageSize={pageSize} selectedCategory={selectedCategory} />
                </div>
                <div className="md:w-1/4 lg:w-1/5 w-full">
                    <Sidebar blogs={blogs} />
                </div>
            </div>


            <div>
                <Pagination onPageChange={handlePageChange} currentPage={currentPage} pageSize={pageSize} blogs={blogs} />
            </div>
        </div>
    )
}

export default BlogPage