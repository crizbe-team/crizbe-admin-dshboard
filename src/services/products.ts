import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export const getProducts = async (params: any = {}, method: 'get' | 'post' = 'get') => {
    const { GET_PRODUCTS } = API_ENDPOINTS;

    if (method === 'get') {
        const filters = params as any;
        const url = new ApiBuilder(GET_PRODUCTS)
            .query('page', filters.page)
            .query('q', filters.q)
            .query('category', filters.category)
            .query('sortBy', filters.sortBy)
            .query('sortOrder', filters.sortOrder)
            .build();

        const response = await api.get(url);
        return handleApiResponse(response);
    } else {
        const data = params as any;
        const url = new ApiBuilder(GET_PRODUCTS).build();
        const config =
            data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.post(url, data, config);
        return handleApiResponse(response);
    }
};

export const getProduct = async (
    id: string | number,
    method: 'get' | 'delete' | 'put' = 'get',
    data?: Partial<any>
) => {
    const { GET_PRODUCT } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_PRODUCT).path('id', id).build();

    if (method === 'put') {
        const config =
            data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.put(url, data, config);
        return handleApiResponse(response);
    }

    const response = await api[method](url);
    return handleApiResponse(response);
};

export const getRelatedProducts = async (id: string | number) => {
    const { GET_RELATED_PRODUCTS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_RELATED_PRODUCTS).path('id', id).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};
