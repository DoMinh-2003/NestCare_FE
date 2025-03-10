import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";

export interface Service {
    id: string;
    name: string;
    price: string;
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
    delivery_included: number; // 0 hoặc 1
    alerts_included: number; // 0 hoặc 1
    isDeleted: number; // 0 hoặc 1
    createdAt: string;
    updatedAt: string;
    packageServices: PackageService[];
}


const usePackageService = () => {
    const { callApi, loading, setIsLoading } = useApiService();
    const router = useNavigate();

    const getPackages = useCallback(
        async () => {
            try {
                const response = await callApi("get", "packages");
                return response;
            } catch (e: any) {
                toast.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const createServices = useCallback(
        async (values: any) => {
            try {
                const response = await callApi("post", "services", {
                    ...values
                });
                return response;
            } catch (e: any) {
                toast.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const updateServices = useCallback(
        async (values: any) => {
            try {
                const response = await callApi("put", `services/${values.id}`, {
                    description: values.description,
                    price: values.price,
                    name: values.name
                });
                return response;
            } catch (e: any) {
                toast.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const deleteServices = useCallback(
        async (id: string) => {
            try {
                const response = await callApi("delete", `services/${id}`);
                return response;
            } catch (e: any) {
                toast.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    return { getPackages, deleteServices, createServices, updateServices, loading, setIsLoading };
};

export default usePackageService;
