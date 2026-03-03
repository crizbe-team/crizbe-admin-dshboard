import axios from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { handleApiResponse } from '../utils/api-handler';

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
    return handleApiResponse(response);
};

export const signupInitiate = async (userData: any): Promise<AuthApiResponse> => {
    const { SIGNUP_INITIATE } = API_ENDPOINTS;
    const response = await axios.post(SIGNUP_INITIATE, userData);
    return handleApiResponse(response);
};

export const signupVerifyOtp = async (otpData: any): Promise<AuthApiResponse> => {
    const { SIGNUP_VERIFY_OTP } = API_ENDPOINTS;
    const response = await axios.post(SIGNUP_VERIFY_OTP, otpData);
    return handleApiResponse(response);
};

export const signupSetPassword = async (passwordData: any): Promise<AuthApiResponse> => {
    const { SIGNUP_SET_PASSWORD } = API_ENDPOINTS;
    const response = await axios.post(SIGNUP_SET_PASSWORD, passwordData);
    return handleApiResponse(response);
};

export const logout = async (): Promise<AuthApiResponse> => {
    const { LOGOUT } = API_ENDPOINTS;
    const response = await axios.post(LOGOUT);
    return handleApiResponse(response);
};
