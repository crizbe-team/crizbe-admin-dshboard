import axios from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';

export interface LoginData {
    email: string;
    first_name: string;
}

export interface LoginApiResponse {
    status_code: number;
    message: { body: string };
    data: any;
}

export const login = async (userData: LoginData): Promise<LoginApiResponse> => {
    const { SIGN_IN } = API_ENDPOINTS;
    const response = await axios.post(SIGN_IN, userData);
    const { status_code, message, data } = response?.data;
    if (status_code === 6001) {
        throw { message: message.body, errors: data };
    }
    return response?.data;
};
