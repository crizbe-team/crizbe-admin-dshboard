import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';

export const getStockList = async (params: any = {}) => {
    const { GET_STOCK_LIST } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_STOCK_LIST)
        .query('page', params.page)
        .query('q', params.q)
        .query('sortBy', params.sortBy)
        .query('sortOrder', params.sortOrder)
        .build();

    const response = await api.get(url);
    return response.data;
};

export const createStock = async (data: any) => {
    const { GET_STOCK_LIST } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_STOCK_LIST).build();
    const response = await api.post(url, data);
    return response.data;
};

export const getProductStock = async (id: string | number) => {
    const { GET_PRODUCT_STOCK } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_PRODUCT_STOCK).path('id', id).build();
    const response = await api.get(url);
    return response.data;
};

export const getVariantStock = async (id: string | number) => {
    const { GET_VARIANT_STOCK } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_VARIANT_STOCK).path('id', id).build();
    const response = await api.get(url);
    return response.data;
};

export const getStockHistory = async (id: string | number) => {
    const { GET_STOCK_HISTORY } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_STOCK_HISTORY).path('id', id).build();
    const response = await api.get(url);
    return response.data;
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
    return response.data;
};

export const deleteStockHistory = async (id: string | number) => {
    const { GET_STOCK_HISTORY } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_STOCK_HISTORY).path('id', id).build();
    const response = await api.delete(url);
    return response.data;
};
