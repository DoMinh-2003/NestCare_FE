import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";


const useTransaction = () => {
	const { callApi, loading, setIsLoading } = useApiService();
	const router = useNavigate();
	const dispatch = useDispatch();

	const getTransaction = useCallback(
		async (userId: string) => {
			try {
				const response = await callApi("get", `transactions/user/${userId}`);
				console.log("getOrders: ", response)
				return response;
			} catch (e: any) {
				console.log("e: ", e)
			}
		},
		[callApi, dispatch, router]
	);

	return { getTransaction, loading };
};

export default useTransaction