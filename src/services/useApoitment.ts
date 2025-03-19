
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";

export interface Service {
	id: string;
	name: string;
	price: number;
	description: string;
	isDeleted: number;
	createdAt: string;
	updatedAt: string;
}

export interface PackageService {
	id: string;
	slot: number;
	service: Service;
}

export interface Package {
	id: string;
	name: string;
	price: string;
	description: string;
	period: string;
	delivery_included: number;
	alerts_included: number;
	isDeleted: number;
	createdAt: string;
	updatedAt: string;
	packageServices: PackageService[];
}


const useAppointmentService = () => {
	const { callApi, loading, setIsLoading } = useApiService();
	const router = useNavigate();

	const userCreateAppointments = useCallback(
		async (values: any) => {
			try {
				const response = await callApi("post", "appointments", {
					...values
				});
				return response;
			} catch (e: any) {
				toast.error(e?.response?.data);
			}
		},
		[callApi, router]
	);

	const getHistoryFetal = useCallback(
		async (id: string) => {
			try {
				const response = await callApi("get", `appointments/${id}/history`);
				return response;
			} catch (e: any) {
				toast.error(e?.response?.data);
			}
		},
		[callApi, router]
	);

	const getAppointments = useCallback(
		async (appointmentId: string) => {
			try {
				const response = await callApi("get", `appointments/${appointmentId}`);
				return response;
			} catch (e: any) {
				toast.error(e?.response?.data);
			}
		},
		[callApi, router]
	)

	return { getAppointments, getHistoryFetal, userCreateAppointments, loading, setIsLoading };
};

export default useAppointmentService;
