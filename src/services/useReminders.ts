import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";
import { message } from "antd";

const userReminderService = () => {
    const { callApi, loading, setIsLoading } = useApiService();
    const router = useNavigate();
    const dispatch = useDispatch();

    const createReminderByDoctor = useCallback(
        async (values: any) => {
            try {
                console.log(values);
                const response = await callApi("post", `reminders`, {
                    ...values
                });
                console.log(response);
                return response;
            } catch (e: any) {
                message.error(e?.response?.data?.message || "CreateReminderssByDoctor failed");
                throw e;
            }
        },
        [callApi]
    );


    return { createReminderByDoctor, setIsLoading };
};

export default userReminderService;
