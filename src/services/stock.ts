import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export const getStockList = async (params: any = {}) => {
    const { GET_STOCK_LIST } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_STOCK_LIST)
        .query('page', params.page)
        .query('q', params.q)
        .query('category', params.category)
        .query('status', params.status)
        .build();

    const response = await api.get(url);
    return handleApiResponse(response);
};

export const createStock = async (data: any) => {
    const { GET_STOCK_LIST } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_STOCK_LIST).build();
    const response = await api.post(url, data);
    return handleApiResponse(response);
};

export const getProductStock = async (id: string | number) => {
    const { GET_PRODUCT_STOCK } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_PRODUCT_STOCK).path('id', id).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const getVariantStock = async (id: string | number, params: any = {}) => {
    const { GET_VARIANT_STOCK } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_VARIANT_STOCK)
        .path('id', id)
        .query('page', params.page)
        .query('type', params.type)
        .build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const getStockHistory = async (id: string | number) => {
    const { GET_STOCK_HISTORY } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_STOCK_HISTORY).path('id', id).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const getStockHistoryList = async (params: any = {}) => {
    const { GET_STOCK_HISTORY_LIST } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_STOCK_HISTORY_LIST)
        .query('page', params.page)
        .query('q', params.q)
        .query('variant', params.variant)
        .query('product', params.product)
        .query('type', params.type)
        .build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const deleteStockHistory = async (id: string | number) => {
    const { GET_STOCK_HISTORY } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_STOCK_HISTORY).path('id', id).build();
    const response = await api.delete(url);
    return handleApiResponse(response);
};
