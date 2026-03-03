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

export const signupInitiate = async (userData: any): Promise<AuthApiResponse> => {
    const { SIGNUP_INITIATE } = API_ENDPOINTS;
    const response = await axios.post(SIGNUP_INITIATE, userData);
    const { status_code, message, data } = response?.data;
    if (status_code !== 200 && status_code !== 6000) {
        const errorText = typeof message === 'string' ? message : message?.body || 'Signup initiation failed';
        throw { message: errorText, errors: data };
    }
    return response?.data;
};

export const signupVerifyOtp = async (otpData: any): Promise<AuthApiResponse> => {
    const { SIGNUP_VERIFY_OTP } = API_ENDPOINTS;
    const response = await axios.post(SIGNUP_VERIFY_OTP, otpData);
    const { status_code, message, data } = response?.data;
    if (status_code !== 200 && status_code !== 6000) {
        const errorText = typeof message === 'string' ? message : message?.body || 'OTP verification failed';
        throw { message: errorText, errors: data };
    }
    return response?.data;
};

export const signupSetPassword = async (passwordData: any): Promise<AuthApiResponse> => {
    const { SIGNUP_SET_PASSWORD } = API_ENDPOINTS;
    const response = await axios.post(SIGNUP_SET_PASSWORD, passwordData);
    const { status_code, message, data } = response?.data;
    if (status_code !== 200 && status_code !== 6000) {
        const errorText = typeof message === 'string' ? message : message?.body || 'Password setup failed';
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
