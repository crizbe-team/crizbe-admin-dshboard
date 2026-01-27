// @ts-nocheck

import axios from "axios";
import { AxiosRequestHeaders } from "axios";
import { authUtils } from "../utils/auth";
import { API_ENDPOINTS } from "../utils/api-endpoints";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const REFRESH_TOKEN = API_ENDPOINTS;

const api = axios.create({
	baseURL: baseURL,
	timeout: 30000,
	headers: { Accept: "application/json", "Content-Type": "application/json" },
});

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
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = authUtils.getRefreshToken();
				if (!refreshToken) {
					throw new Error("No refresh token available");
				}

				const response = await axios.post(
					`${baseURL + REFRESH_TOKEN}`,
					{
						refresh_token: refreshToken,
					}
				);

				const { access_token } = response.data;

				authUtils.updateAccessToken(access_token);

				originalRequest.headers.Authorization = `Bearer ${access_token}`;
				return api(originalRequest);
			} catch (refreshError) {
				authUtils.removeTokens();

				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}

				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
