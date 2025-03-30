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

    const getAppointmentsByDate = useCallback(
        async (date: string, search: string, status: string) => {
            try {
                const response = await callApi("get", `appointments/date/${date}?search=${search}&status=${status}`);
                console.log("getAppointmentsByDate", response)
                return response;
            } catch (error: any) {
                console.error(error?.response?.data?.message || "getAppointmentsByDate failed");
            }
        },
        [callApi]
    );

    const getAppointmentsByDoctorDate = useCallback(
        async (doctorId: string, date: string, search: string, status: string) => {
            let url;
            if (search && status && status != '') {
                url = `/appointments/doctor-date/${doctorId}/${date}?search=${search}&status=${status}`
            } else if (search || search && status === '') {
                url = `/appointments/doctor-date/${doctorId}/${date}?search=${search}`
            } else if (status != '') {
                url = `/appointments/doctor-date/${doctorId}/${date}?status=${status}`
            } else {
                url = `/appointments/doctor-date/${doctorId}/${date}`
            }

            try {
                const response = await callApi("get", url);
                console.log("getAppointmentsByDoctorDate", response)
                return response;
            } catch (error: any) {
                console.error(error?.response?.data?.message || "getAppointmentsByDoctorDate failed");
            }
        },
        [callApi]
    );

    return {
        getAppointmentsByDate, updateMotherHeal, getAppointmentDetail, getAppointmentsByDoctor, setIsLoading,
        updateAppointmentStatus, addServicesToAppointment, createAppointment, getAppointmentsByDoctorDate
    };
};

export default userAppointmentService;
