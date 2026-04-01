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

export const googleLogin = async (access_token: string): Promise<AuthApiResponse> => {
    const { GOOGLE_LOGIN } = API_ENDPOINTS;
    const response = await axios.post(GOOGLE_LOGIN, { access_token });
    return handleApiResponse(response);
};

export const signupInitiate = async (userData: any): Promise<AuthApiResponse> => {
    const { SIGNUP_INITIATE } = API_ENDPOINTS;
    const response = await axios.post(SIGNUP_INITIATE, userData);
    return handleApiResponse(response);
};

export const forgotPassword = async (userData: any): Promise<AuthApiResponse> => {
    const { FORGOT_PASSWORD } = API_ENDPOINTS;
    const response = await axios.post(FORGOT_PASSWORD, userData);
    return handleApiResponse(response);
};

export const verifyOtp = async (otpData: any): Promise<AuthApiResponse> => {
    const { VERIFY_OTP } = API_ENDPOINTS;
    const response = await axios.post(VERIFY_OTP, otpData);
    return handleApiResponse(response);
};

export const signupResendOtp = async (resendData: any): Promise<AuthApiResponse> => {
    const { RESEND_OTP } = API_ENDPOINTS;
    const response = await axios.post(RESEND_OTP, resendData);
    return handleApiResponse(response);
};

export const setPassword = async (passwordData: any): Promise<AuthApiResponse> => {
    const { SET_PASSWORD } = API_ENDPOINTS;
    const response = await axios.post(SET_PASSWORD, passwordData);
    return handleApiResponse(response);
};

export const logout = async (): Promise<AuthApiResponse> => {
    const { LOGOUT } = API_ENDPOINTS;
    const response = await axios.post(LOGOUT);
    return handleApiResponse(response);
};
