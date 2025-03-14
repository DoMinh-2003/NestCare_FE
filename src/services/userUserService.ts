import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";
import { UserData } from "../components/organisms/modal-create-update-user/ModalCreateUpdateUser";
import { message } from "antd";

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

  const createUser = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "users/register",{
          ...values
        });
        console.log("createUser: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  return { getUsers, loading, createUser, setIsLoading };
};

export default userUserService;
