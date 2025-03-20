import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";

const userAppointmentService = () => {
    const { callApi, loading, setIsLoading } = useApiService();
    const router = useNavigate();
    const dispatch = useDispatch();

    const getAppointmentsByDoctor = useCallback(
        async (doctorId: string) => {
            try {
                const response = await callApi("get", `appointments/by-doctor/${doctorId}`);
                return response;
            } catch (e: any) {
                toast.error(e?.response?.data?.message || "GetAppointmentsByDoctor failed");
                throw e;
            }
        },
        [callApi]
    );


    return { getAppointmentsByDoctor, setIsLoading };
};

export default userAppointmentService;
