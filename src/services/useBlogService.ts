import { useCallback } from "react";
import { toast } from "react-toastify";
import useApiService from "../hooks/useApi";

const useBlogService = () => {
    const { callApi, loading, setIsLoading } = useApiService();

    const getBlogs = useCallback(
        async ({
            categoryId = "",
            isPublished = 1,
            pageNum = 1,
            pageSize = 100,
        }: {
            categoryId?: string;
            isPublished?: number;
            pageNum?: number;
            pageSize?: number;
        }) => {
            try {
                const body = {
                    searchCondition: {
                        categoryId,
                        isPublished,
                    },
                    pageInfo: {
                        pageNum,
                        pageSize,
                    },
                };

                const response = await callApi("post", "blogs/search", body);
                return response;
            } catch (e: any) {
                toast.error(e?.response?.data?.message || "Lấy danh sách blog thất bại");
            }
        },
        [callApi]
    );

    return { getBlogs, loading, setIsLoading };
};

export default useBlogService;
