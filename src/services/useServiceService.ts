import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  isDeleted: number; // 0: chưa xóa, 1: đã xóa
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

const useServiceService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const dispatch = useDispatch();

  const getServices = useCallback(
    async () => {
      try {
        const response = await callApi("get", "services");
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
        const response = await callApi("post", "services",{
          ...values
        });
        return response;
      } catch (e: any) {
        toast.error(e?.response?.data);
      }
    },
    [callApi, router]
  );
  return { getServices,createServices, loading, setIsLoading };
};

export default useServiceService;
