import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";

const useFetalService = () => {

  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const dispatch = useDispatch();


  const createOrder = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "order", {
          ...values
        });
        console.log("createOrder: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const getFetalsByMotherId = useCallback(
    async (motherId: any) => {
      try {
        const response = await callApi("get", `fetal-records/user/${motherId}`);
        console.log("getOrderByUserId: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const deleteUser = useCallback(
    async (id: any) => {
      try {
        const response = await callApi("put", `users/${id}/toggle-delete`, {
          isDeleted: true
        });
        console.log("createUser: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  return { loading, getFetalsByMotherId, deleteUser, createOrder, setIsLoading };
};

export default useFetalService;
