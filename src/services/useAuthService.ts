import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApiService from "../hooks/useApi";
import { message } from "antd";

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
        message.success("Đăng kí thành công. Vui lòng kiểm tra email!");
        router("/auth/login");
        return response;
      } catch (e: any) {
        message.error(e?.response?.data || "Registration failed");
      }
    },
    [callApi, router]
  );

  const login = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "auth/login", values);
        console.log("login: ", response);

        if (response?.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("USER", JSON.stringify(response));
          message.success("Đăng nhập thành công");

          // Điều hướng dựa trên role
          switch (response?.role) {
            case "doctor":
              router("/doctor");
              break;
            case "nurse":
              router("/nurse");
              break;
            case "admin":
              router("/admin");
              break;
            default:
              router("/");
              break;
          }
          return response?.data;
        } else {
          // Nếu không có token, coi như thất bại
          message.error(response?.message || "Mật khẩu hoặc tài khoản không đúng");
        }
      } catch (e: any) {
        // Xử lý lỗi khi API gặp exception (ví dụ: mạng lỗi)
        message.error(e?.response?.data || "Đăng nhập thất bại");
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
