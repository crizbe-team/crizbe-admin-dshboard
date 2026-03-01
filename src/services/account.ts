import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';

export const getAddresses = async () => {
    const { GET_ADDRESSES } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADDRESSES).build();
    const response = await api.get(url);
    const { status_code, message, data } = response?.data;

    if (status_code === 6001) {
        throw { message, errors: data };
    }
    return response.data;
};

export const getAddress = async (
    id: string,
    method: 'get' | 'delete' | 'put' = 'get',
    data?: any
) => {
    const { GET_ADDRESS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADDRESS).path('id', id).build();

    if (method === 'put') {
        const config =
            data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.put(url, data, config);
        const { status_code, message, responseData } = response?.data;

        if (status_code === 6001) {
            throw { message, errors: responseData };
        }
        return response.data;
    }

    if (method === 'delete') {
        const response = await api.delete(url);
        const { status_code, message, responseData } = response?.data;

        if (status_code === 6001) {
            throw { message, errors: responseData };
        }
        return response.data;
    }

    const response = await api.get(url);
    const { status_code, message, responseData } = response?.data;

    if (status_code === 6001) {
        throw { message, errors: responseData };
    }
    return response.data;
};

export const createAddress = async (data: any) => {
    const { GET_ADDRESSES } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADDRESSES).build();
    const response = await api.post(url, data);
    const { status_code, message, responseData } = response?.data;

    if (status_code === 6001) {
        throw { message, errors: responseData };
    }
    return response.data;
};
