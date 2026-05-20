import axios from "axios";
import { adminMockRouter } from "./mockData";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials: true,
});

// Handle API requests
axiosInstance.interceptors.response.use(
    (config) => config,
    (error) => {
        // FALLBACK MOCK DATA INTERCEPTOR
        const originalRequest = error.config;
        if (originalRequest?.url) {
            console.warn(`Mocking failed request to: ${originalRequest.url}`);
            return Promise.resolve({ data: adminMockRouter(originalRequest.url) });
        }
        return Promise.reject(error)
    }
)

export default axiosInstance;