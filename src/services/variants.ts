import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export const getVariants = async (params: any = {}, method: 'get' | 'post' = 'get') => {
    const { GET_VARIANTS } = API_ENDPOINTS;

    if (method === 'get') {
        const filters = params as any;
        const url = new ApiBuilder(GET_VARIANTS)
            .query('page', filters.page)
            .query('q', filters.q)
            .query('productId', filters.productId)
            .query('sortBy', filters.sortBy)
            .query('sortOrder', filters.sortOrder)
            .build();

        const response = await api.get(url);
        return handleApiResponse(response);
    } else {
        const data = params as any;
        const url = new ApiBuilder(GET_VARIANTS).build();
        const response = await api.post(url, data);
        return handleApiResponse(response);
    }
};

export const getVariant = async (
    id: string | number,
    method: 'get' | 'delete' | 'put' = 'get',
    data?: Partial<any>
) => {
    const { GET_VARIANT } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_VARIANT).path('id', id).build();

    if (method === 'put') {
        const response = await api.put(url, data);
        return handleApiResponse(response);
    }

    const response = await api[method](url);
    return handleApiResponse(response);
};
