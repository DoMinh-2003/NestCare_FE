import React from 'react'

const Pagination = ({ onPageChange, currentPage, pageSize, blogs }) => {
    const totalPages = Math.ceil(blogs.length / pageSize);
    const renderPaginationLinks = () => {
        return Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <li className={pageNumber === currentPage ? "activePagination" : ""} key={pageNumber}>
                <a href="#" onClick={() => onPageChange(pageNumber)}>{pageNumber}</a>
            </li>
        ))
    }
    return (
        <ul className='my-8 flex-wrap gap-4 flex items-center justify-center m-0 p-0 list-none'>
            <li className='mx-0 my-[5px]'>
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Trước</button>
            </li>
            <div>{renderPaginationLinks()}</div>
            <li>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Sau</button>
            </li>
        </ul>
    )
}

export default Pagination