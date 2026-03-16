import axios from "axios";
import type {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
} from "axios";
import type { ApiError, ApiConfig } from "../types/api.types";

const API_CONFIG: ApiConfig = {
    baseUrl: "https://dummyjson.com",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
};

class ApiClient {
    private instance: AxiosInstance;

    constructor(config: ApiConfig) {
        this.instance = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout,
            headers: config.headers,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = this.getAuthToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: AxiosError<ApiError>) => Promise.reject(error),
        );

        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError<ApiError>) => {
                const apiError: ApiError = {
                    status: error.response?.status || 500,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "An unexpected error occurred",
                    code: error.response?.data?.code,
                    details: error.response?.data?.details,
                };
                return Promise.reject(apiError);
            },
        );
    }

    private getAuthToken(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem("authToken");
        }
        return null;
    }

    getInstance(): AxiosInstance {
        return this.instance;
    }
}

export const apiClient = new ApiClient(API_CONFIG);
export default apiClient.getInstance();
