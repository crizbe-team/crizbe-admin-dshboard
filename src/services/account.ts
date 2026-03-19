import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export const getAddresses = async () => {
    const { GET_ADDRESSES } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADDRESSES).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const getMinimalDetails = async () => {
    const { GET_MINIMAL_DETAILS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_MINIMAL_DETAILS).build();
    const response = await api.get(url);
    return handleApiResponse(response);
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
        return handleApiResponse(response);
    }

    const response = await api[method](url);
    return handleApiResponse(response);
};

export const createAddress = async (data: any) => {
    const { GET_ADDRESSES } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADDRESSES).build();
    const response = await api.post(url, data);
    return handleApiResponse(response);
};

// Client services
export const getClients = async (params: any = {}, method: 'get' | 'post' = 'get') => {
    const { GET_CLIENTS } = API_ENDPOINTS;

    if (method === 'get') {
        const filters = params as any;
        const url = new ApiBuilder(GET_CLIENTS)
            .query('page', filters.page)
            .query('q', filters.q)
            .query('sortBy', filters.sortBy)
            .query('sortOrder', filters.sortOrder)
            .build();

        const response = await api.get(url);
        return handleApiResponse(response);
    } else {
        const data = params as any;
        const url = new ApiBuilder(GET_CLIENTS).build();
        const response = await api.post(url, data);
        return handleApiResponse(response);
    }
};

export const getClient = async (
    id: string,
    method: 'get' | 'delete' | 'put' = 'get',
    data?: any
) => {
    const { GET_CLIENT_DETAIL } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_CLIENT_DETAIL).path('pk', id).build();

    if (method === 'put') {
        const config =
            data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.put(url, data, config);
        return handleApiResponse(response);
    }

    const response = await api[method](url);
    return handleApiResponse(response);
};

export const createClient = async (data: any) => {
    const { GET_CLIENTS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_CLIENTS).build();
    const response = await api.post(url, data);
    return handleApiResponse(response);
};
