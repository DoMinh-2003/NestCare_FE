import React from 'react'

const CategorySelection = ({ onSelectedCategory, selectedCategory, activeCategory }) => {
    const categories = ["Bác sĩ", "Khám bệnh", "Vô sinh", "Hiếm muộn", "Dinh dưỡng"]
    return (
        <div className='px-4 mb-10 lg:space-x-16 flex flex-wrap items-center border-b-2 py-5 text-gray-900'>
            <button onClick={() => onSelectedCategory(null)} className={`lg:ml-12 ${activeCategory ? "" : "text-[#fc3c1a]"}`}>Tất cả</button>
            {
                categories.map((category) => (
                    <button onClick={() => onSelectedCategory(category)} className={`mr-2 space-x-16 ${activeCategory === category ? "text-[#fc3c1a]" : ""}`} key={category}>{category}</button>
                ))
            }
        </div>
    )
}

export default CategorySelection