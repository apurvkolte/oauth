// src/utils/axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true // 👈 Required for sending cookies
});
axios.defaults.withCredentials = true;

export default axiosInstance;
