import { message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/userSlice";

const api = axios.create({
  // baseURL: "http://14.225.217.207:8081/api/",
  baseURL: import.meta.env.VITE_API_URL,
});

let isTokenExpired = false;

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { data } = error.response;
      const dispatch = useDispatch();
      console.log(error.response);
      if (data.message === null && data.errors && data.errors.length > 0) {
        data.errors.forEach((error: { field: string, message: string }) => {
          message.error(`${error.field}: ${error.message}`);
        });
      } else {
        if (!isTokenExpired) {
          isTokenExpired = true
          message.error(data.message);
          setTimeout(() => {
            window.location.href = '/'
            localStorage.clear();
            isTokenExpired = false;
            dispatch(logout())
          }, 1300);
        }
      }
    }
  })

export default api;



// import axios from "axios";
// import { refreshAuthToken } from "../utils/authUtils";

// const SERVER = import.meta.env.VITE_API_URL_SERVER;
// const LOCAL = import.meta.env.VITE_API_URL_LOCAL;

// const api = axios.create({
//   baseURL: LOCAL,
// });

// api.interceptors.request.use(
//   function (config) {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Prevent infinite retry loop

//       try {
//         const newToken = await refreshAuthToken();
//         axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


