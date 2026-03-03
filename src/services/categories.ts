import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export const getCategories = async (params: any = {}, method: 'get' | 'post' = 'get') => {
    const { GET_CATEGORIES } = API_ENDPOINTS;

    if (method === 'get') {
        const filters = params as any;
        const url = new ApiBuilder(GET_CATEGORIES)
            .query('page', filters.page)
            .query('q', filters.q)
            .query('sortBy', filters.sortBy)
            .query('sortOrder', filters.sortOrder)
            .query('is_active', filters.is_active)
            .build();

        const response = await api.get(url);
        return handleApiResponse(response, { errorCodes: [6001] });
    } else {
        const data = params as any;
        const url = new ApiBuilder(GET_CATEGORIES).build();
        const response = await api.post(url, data);
        return handleApiResponse(response, { errorCodes: [6001] });
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
        return handleApiResponse(response);
    }

    const response = await api[method](url);
    return handleApiResponse(response);
};
