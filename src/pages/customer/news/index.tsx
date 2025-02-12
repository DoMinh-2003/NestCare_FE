import React, { useState } from "react";
import NewsContainer from "../../../components/organisms/news-container/NewsContainer";
import NewsMenu from "../../../components/molecules/news-menu/NewsMenu";

const News = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <div className="mx-5">
            <div className="container mx-auto">
                <div className="grid grid-cols-12">
                    <div className="col-span-9">
                        <NewsContainer selectedCategory={selectedCategory} />
                    </div>
                    <div className="col-span-3 mt-10">
                        <NewsMenu selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
