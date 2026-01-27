import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';

export const getCategories = async (params: any = {}, method: 'get' | 'post' = 'get') => {
    const { GET_CATEGORIES } = API_ENDPOINTS;

    if (method === 'get') {
        const filters = params as any;
        const url = new ApiBuilder(GET_CATEGORIES)
            .query('page', filters.page)
            .query('q', filters.q)
            .query('sortBy', filters.sortBy)
            .query('sortOrder', filters.sortOrder)
            .build();

        const response = await api.get(url);
        const { status_code, message, data } = response?.data;

        if (status_code === 6001) {
            throw { message, errors: data };
        }
        return response.data;
    } else {
        const data = params as any;
        const url = new ApiBuilder(GET_CATEGORIES).build();
        const response = await api.post(url, data);
        const { status_code, message, data: responseData } = response?.data;

        if (status_code === 6001) {
            throw { message, errors: responseData };
        }
        return response.data;
    }
};

export const getCategory = async (
    id: string | number,
    method: 'get' | 'delete' | 'put' = 'get',
    data?: Partial<any>
) => {
    const { GET_CATEGORY } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_CATEGORY).path('id', id).build();

    if (method === 'put') {
        const response = await api.put(url, data);
        return response.data;
    }

    const response = await api[method](url);
    return response.data;
};
