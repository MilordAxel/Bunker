import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
    baseURL: SERVER_URL
});

export default axiosInstance