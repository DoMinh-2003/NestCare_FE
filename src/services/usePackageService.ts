
import { useCallback } from "react";
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
    delivery_included: number;
    alerts_included: number;
    isDeleted: number;
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
                return response?.data;
            } catch (e: any) {
                toast.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const createPackage = useCallback(
        async (values: any) => {
            try {
                const response = await callApi("post", "packages", {
                    ...values
                });
                return response;
            } catch (e: any) {
                toast.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const updatePackage = useCallback(
        async (values: any) => {
            try {
                const response = await callApi("put", `packages/${values.id}`, {
                    // description: values.description,
                    // price: values.price,
                    // name: values.name
                    ...values
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

    return { getPackages, deleteServices, createPackage, updatePackage, loading, setIsLoading };
};

export default usePackageService;
