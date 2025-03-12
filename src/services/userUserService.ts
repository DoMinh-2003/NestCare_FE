import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";

const userUserService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const dispatch = useDispatch();

  const getUsers = useCallback(
    async () => {
      try {
        const response = await callApi("get", "users");
        return response;
      } catch (e: any) {
        toast.error(e?.response?.data || "GetUsers failed");
      }
    },
    [callApi, dispatch, router]
  );

  return { getUsers, loading, setIsLoading };
};

export default userUserService;
