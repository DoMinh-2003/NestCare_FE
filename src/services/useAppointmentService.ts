/* eslint-disable no-useless-catch */
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppointmentStatus } from "../constants/status";
import useApiService from "../hooks/useApi";

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
        async (appointmentId: string, services: { serviceId: string; notes: string }[]) => {
            try {
                const response = await callApi("put", `appointments/in-progress/${appointmentId}`, services);
                return response;
            } catch (error) {
                throw error;
            }
        }, [callApi]
    )


    return { getAppointmentsByDoctor, setIsLoading, updateAppointmentStatus, addServicesToAppointment };
};

export default userAppointmentService;
