import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export const getCountries = async (params: any = {}) => {
    const { GET_COUNTRIES } = API_ENDPOINTS;

    const builder = new ApiBuilder(GET_COUNTRIES);

    // Add query parameters if provided
    if (params.q) {
        builder.query('q', params.q);
    }
    if (params.page) {
        builder.query('page', params.page);
    }
    if (params.limit) {
        builder.query('limit', params.limit);
    }

    const url = builder.build();
    const response = await api.get(url);

    return handleApiResponse(response);
};

export const getStates = async (params: any = {}) => {
    const { GET_STATES } = API_ENDPOINTS;

    const builder = new ApiBuilder(GET_STATES);

    // Add query parameters if provided
    if (params.q) {
        builder.query('q', params.q);
    }
    if (params.page) {
        builder.query('page', params.page);
    }
    if (params.country) {
        builder.query('country', params.country);
    }

    const url = builder.build();
    const response = await api.get(url);

    return handleApiResponse(response);
};
