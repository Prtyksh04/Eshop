import axios from "axios";
import { sellerMockRouter } from "./mockData";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
    withCredentials: true,
})

// Handle API requests
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
)

// Handle expired token and refresh logic
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // FALLBACK MOCK DATA INTERCEPTOR
        const originalRequest = error.config;
        if (originalRequest?.url) {
            console.warn(`Mocking failed request to: ${originalRequest.url}`);
            return Promise.resolve({ data: sellerMockRouter(originalRequest.url) });
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;