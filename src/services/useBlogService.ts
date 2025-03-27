import { useCallback } from "react";
import { toast } from "react-toastify";
import useApiService from "../hooks/useApi";
import { message } from "antd";

const useBlogService = () => {
    const { callApi, loading, setIsLoading } = useApiService();

    const getBlogs = useCallback(
        async ({
            categoryId = "",
            authorId = "",
            isPublished = 1,
            pageNum = 1,
            pageSize = 100,
        }: {
            categoryId?: string;
            authorId?: "";
            isPublished?: number;
            pageNum?: number;
            pageSize?: number;
        }) => {
            try {
                const body = {
                    searchCondition: {
                        categoryId,
                        authorId,
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
                message.error(e?.response?.data?.message || "Lấy danh sách blog thất bại");
            }
        },
        [callApi]
    );

    const getBlog = useCallback(async (id: string) => {
        try {


            const response = await callApi("get", `blogs/${id}`);
            return response;
        } catch (e: any) {
            message.error(e?.response?.data?.message || "Lấy danh sách blog thất bại");
        }
    },
        [callApi]
    );

    const createBlog = useCallback(async (values) => {
        try {


            const response = await callApi("post", `blogs/create`, values);
            return response;
        } catch (e: any) {
            message.error(e?.response?.data?.message || "Lấy danh sách blog thất bại");
        }
    },
        [callApi]
    );


    const updateBlog = useCallback(async (id: string, values) => {
        try {


            const response = await callApi("put", `blogs/${id}`, values);
            return response;
        } catch (e: any) {
            message.error(e?.response?.data?.message || "Lấy danh sách blog thất bại");
        }
    },
        [callApi]
    );

    const deleteBlog = useCallback(async (id: string) => {
        try {


            const response = await callApi("delete", `blogs/${id}`);
            return response;
        } catch (e: any) {
            message.error(e?.response?.data?.message || "Lấy danh sách blog thất bại");
        }
    },
        [callApi]
    );
    return { getBlogs, loading, setIsLoading, getBlog, createBlog, updateBlog, deleteBlog };
};

export default useBlogService;
