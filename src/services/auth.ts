import axios from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';

export interface AuthApiResponse {
    status_code: number;
    message: string | { body: string };
    data: any;
    access?: string;
    refresh?: string;
}

export const login = async (userData: any): Promise<AuthApiResponse> => {
    const { LOGIN } = API_ENDPOINTS;
    const response = await axios.post(LOGIN, userData);
    const { status_code, message, data } = response?.data;
    if (status_code !== 200 && status_code !== 6000) {
        const errorText = typeof message === 'string' ? message : message?.body || 'Login failed';
        throw { message: errorText, errors: data };
    }
    return response?.data;
};

export const signup = async (userData: any): Promise<AuthApiResponse> => {
    const { SIGN_UP } = API_ENDPOINTS;
    const response = await axios.post(SIGN_UP, userData);
    const { status_code, message, data } = response?.data;
    if (status_code !== 200 && status_code !== 6000) {
        const errorText = typeof message === 'string' ? message : message?.body || 'Signup failed';
        throw { message: errorText, errors: data };
    }
    return response?.data;
};

export const logout = async (): Promise<AuthApiResponse> => {
    const { LOGOUT } = API_ENDPOINTS;
    const response = await axios.post(LOGOUT);
    const { status_code, message, data } = response?.data;
    if (status_code !== 200 && status_code !== 6000) {
        const errorText = typeof message === 'string' ? message : message?.body || 'Logout failed';
        throw { message: errorText, errors: data };
    }
    return response?.data;
};
