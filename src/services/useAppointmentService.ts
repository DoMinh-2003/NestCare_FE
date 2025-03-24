import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";
import { AppointmentStatus } from "../constants/status";

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
                console.error(e?.response?.data?.message || "GetAppointmentsByDoctor failed");
                // throw e;
            }
        },
        [callApi]
    );

    const updateAppointmentStatus = useCallback(
        async (appointmentId: string, status: AppointmentStatus) => {

            const response = await callApi("put", `appointments/${appointmentId}/${status}`);
            return response;
        },
        [callApi]
    );

    const addServicesToAppointment = useCallback(
        async (appointmentId: string, serviceIds: []) => {
            try {
                const response = await callApi("post", `appointments/in-progress/${appointmentId}`, {
                    serviceIds,
                });
                return response;
            } catch (error) {
                throw error;
            }
        }, [callApi]
    )


    return { getAppointmentsByDoctor, setIsLoading, updateAppointmentStatus, addServicesToAppointment };
};

export default userAppointmentService;
