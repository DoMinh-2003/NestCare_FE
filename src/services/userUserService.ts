import { useDispatch } from "react-redux";
import { useCallback } from "react";
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

  const getUsersSearch = useCallback(
    async (name: string, role: string) => {
      try {
        let url = ""; // Khởi tạo biến url với giá trị mặc định là chuỗi rỗng

        if (name !== "" && role !== "") {
          url = `?query=${name}&role=${role}`; // Sử dụng toán tử gán
        } else if (name !== "") {
          url = `?query=${name}`; // Sử dụng toán tử gán
        } else if (role !== "") {
          url = `?role=${role}`; // Sử dụng toán tử gán
        } else {
          url = ""; // Sử dụng toán tử gán
        }

        // Gọi API với URL đã được tạo
        const response = await callApi("get", `users/search/1/100${url}`);
        return response;
      } catch (e: any) {
        toast.error(e?.response?.data || "getUsersSearch failed");
      }
    },
    [callApi, dispatch, router]
  );

  const createUser = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "users/register", {
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

  const updateUser = useCallback(
    async (values: any) => {
      console.log("id: ", values.id)
      try {
        const response = await callApi("put", `users/${values.id}`, {
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

  const getUserByRole = useCallback(
    async (role: "user" | "doctor" | "nurse") => {
      try {
        const response = await callApi("get", `users/role/${role}`);
        return response;
      } catch (e: any) {
        toast.error(e?.response?.data || "GetUsers failed");
      }
    }, [callApi]);

  const getUserById = useCallback(
    async (id: any) => {
      try {
        const response = await callApi("get", `users/${id}`);
        return response;
      } catch (e: any) {
        toast.error(e?.response?.data || "GetUsers failed");
      }
    }, [callApi],
  )

  return { getUserById, getUsers, getUserByRole, loading, updateUser, deleteUser, createUser, setIsLoading, getUsersSearch };
};

export default userUserService;
