import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";

const useFetalService = () => {

  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const dispatch = useDispatch();


  const createFetal = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "fetal-records", {
          ...values
        });
        console.log("createFetal: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const updateFetal = useCallback(
    async (values: any, id: string) => {
      try {
        const response = await callApi("put", `fetal-records/${id}`, {
          ...values
        });
        console.log("updateFetal: ", response)
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

  const getFetailAndMotherDetail = useCallback(
    async (id: string) => {
      try {
        const response = await callApi("get", `fetal-records/${id}`);
        console.log("getOrderByUserId: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  )

  const deleteFetal = useCallback(
    async (id: any) => {
      try {
        const response = await callApi("delete", `fetal-records/${id}`, {
          isDeleted: true
        });
        console.log("deleteFetal: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const getFetalsRecords = useCallback(
    async (id: string) => {
      try {
        const response = await callApi("get", `fetal-records/${id}`);
        return response;
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
      }
    },
    [callApi, router, dispatch]
  );


  return { loading, getFetalsRecords, getFetalsByMotherId, deleteFetal, createFetal, setIsLoading, updateFetal, getFetailAndMotherDetail };
};

export default useFetalService;
