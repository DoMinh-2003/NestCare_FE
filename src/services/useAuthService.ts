import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";

const useAuthService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const dispatch = useDispatch();

  const register = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "auth/register", {
          ...values,
          avt: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
        });
        toast.success("Sign Up Successfully, Please Check Your Mail");
        router("/auth/login");
        return response;
      } catch (e: any) {
        toast.error(e?.response?.data || "Registration failed");
      }
    },
    [callApi, router]
  );

  const login = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "auth/login", values);
        console.log("login: ", response)
        localStorage.setItem("token", response?.token);
        toast.success("Login Successfully");
        router("/");
        // dispatch(loginRedux(response?.data));
        return response?.data;
      } catch (e: any) {
        toast.error(e?.response?.data || "Login failed");
      }
    },
    [callApi, dispatch, router]
  );

//   const loginGoogle = useCallback(async () => {
//     try {
//       const result = await signInWithPopup(auth, ggProvider);
//       const token = await result.user?.getIdToken();
//       if (token) {
//         const res = await callApi("post", "/login-google", { token });
//         localStorage.setItem("token", res?.data?.token);
//         router.push("/");
//         dispatch(loginRedux(res?.data));
//       }
//     } catch (e: any) {
//       console.error("Error during Google sign-in or API request:", e);
//     }
//   }, [callApi, dispatch, router]);

  return { register, login, loading, setIsLoading };
};

export default useAuthService;
