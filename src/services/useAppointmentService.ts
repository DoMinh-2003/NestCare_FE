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
        async (doctorId: string, date: string, status: string) => {
            try {
                const response = await callApi("get", `appointments/doctor-date/${doctorId}/${date}/${status}`);
                return response;
            } catch (e: any) {
                console.error(e?.response?.data?.message || "GetAppointmentsByDoctor failed");
                // throw e;
            }
        },
        [callApi]
    );

    const getAppointmentDetail = useCallback(
        async (id: any) => {
            try {
                const response = await callApi("get", `appointments/${id}`);
                return response;
            } catch (error: any) {
                console.error(error?.response?.data?.message || "getAppointmentDetail failed");
            }
        },
        [callApi]
    );

    const createAppointment = useCallback(

        async (values: any) => {
            try {
                const response = await callApi("post", `appointments`, values);
                return response;
            } catch (error: any) {
                console.error(error?.response?.data?.message || "createAppointment failed");
            }
        },
        [callApi]
    );

    const updateMotherHeal = useCallback(

        async (values: any, id: string) => {
            try {
                const response = await callApi("put", `appointments/mother-health/${id}`, values);
                return response;
            } catch (error: any) {
                console.error(error?.response?.data?.message || "updateMotherHeal failed");
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


    return {updateMotherHeal, getAppointmentDetail, getAppointmentsByDoctor, setIsLoading, updateAppointmentStatus, addServicesToAppointment, createAppointment };
};

export default userAppointmentService;
