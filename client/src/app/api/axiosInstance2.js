import axios from "axios";

const axiosInstance2 = axios.create({
  baseURL: import.meta.env.VITE_FLASK_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance2;
