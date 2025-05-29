import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
    withCredentials: true,
})

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];


// Handle logout and prevent infinite loops
const handleLogout = () => {
    if (window.location.pathname !== '/login') {
        window.location.href = "/login";
    }
}

//Handle adding a new access token to queued requests
const subscribeTokenRefresh = (callback: () => void) => {
    refreshSubscribers.push(callback);
}

//Execute queued request after refresh
const onRefreshSuccess = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
}

// Handle API requests
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
)

// Handle expired token and refresh logic
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        //Prevent infinite retry loop
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
                })
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/refresh-token`,
                    {},
                    { withCredentials: true }
                )

                isRefreshing = false;
                onRefreshSuccess();

                return axiosInstance(originalRequest);
            } catch (error) {
                isRefreshing = false;
                refreshSubscribers = [];
                handleLogout();
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;