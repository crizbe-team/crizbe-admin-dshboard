// @ts-nocheck

import axios from 'axios';
import { AxiosRequestHeaders } from 'axios';
import { authUtils } from '../utils/auth';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const REFRESH_TOKEN = API_ENDPOINTS.REFRESH_TOKEN;

const api = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

// Single token refresh queue state to prevent duplicate parallel refresh calls
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token!);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config: any) => {
        const accessToken = authUtils.getAccessToken();
        if (accessToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`,
            } as AxiosRequestHeaders;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue parallel 401 requests while a single refresh token call is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject: (err: any) => {
                            reject(err);
                        },
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = authUtils.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${baseURL + REFRESH_TOKEN}`, {
                    refresh: refreshToken,
                });

                const access = response?.data?.data?.access || response?.data?.access;

                if (!access) {
                    throw new Error('Invalid refresh response token format');
                }

                authUtils.updateAccessToken(access);
                processQueue(null, access);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                authUtils.removeTokens();

                if (typeof window !== 'undefined') {
                    const isAdmin = window.location.pathname.startsWith('/bd6b-6ced');
                    window.location.href = isAdmin ? '/bd6b-6ced/dashboard/login' : '/login';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
