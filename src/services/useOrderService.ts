import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";


const useOrderService = () => {
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

  const getOrderByUserId = useCallback(
    async (userId: any) => {
      try {
        const response = await callApi("get", `order/user/${userId}`);
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

  const getOrderStatus = useCallback((
    async (status: 'PAID' | 'PENDING' | 'COMPLETED' | 'CANCELED') => {
      try {
        const response = await callApi('get', `order/status/${status}`);
        return response;
      } catch (error) {
        console.error(error);
      }
    }
  ), [callApi]);

  return { loading, getOrderByUserId, deleteUser, createOrder, getOrderStatus, setIsLoading };
};

export default useOrderService;
