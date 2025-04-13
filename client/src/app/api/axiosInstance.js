import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_MAIN_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    // always return only the .data field of ApiResponse
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Unknown error";

    const status = error.response?.status || 500;

    return Promise.reject({ status, message });
  }
);

export default axiosInstance;
