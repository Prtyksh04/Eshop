import { CustomAxiosRequestConfig } from "./axiosInstance.types";

export const isProtected: CustomAxiosRequestConfig = {
    requireAuth: true,
}