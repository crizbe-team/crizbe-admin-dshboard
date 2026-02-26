import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';

export const createOrder = async (data: any) => {
    const { CREATE_ORDER } = API_ENDPOINTS;
    const url = new ApiBuilder(CREATE_ORDER).build();
    const response = await api.post(url, data);
    return response.data;
};

export const getOrderList = async (params?: any) => {
    const { ORDER_LIST } = API_ENDPOINTS;
    const builder = new ApiBuilder(ORDER_LIST);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            builder.query(key, value as any);
        });
    }
    const url = builder.build();
    const response = await api.get(url);
    return response.data;
};

export const getOrderDetail = async (id: string) => {
    const { ORDER_DETAIL } = API_ENDPOINTS;
    const url = new ApiBuilder(ORDER_DETAIL).path('id', id).build();
    const response = await api.get(url);
    return response.data;
};

export const getAdminOrderList = async (params?: any) => {
    const { ADMIN_ORDER_LIST } = API_ENDPOINTS;
    const builder = new ApiBuilder(ADMIN_ORDER_LIST);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            builder.query(key, value as any);
        });
    }
    const url = builder.build();
    const response = await api.get(url);
    return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
    const { UPDATE_ORDER_STATUS } = API_ENDPOINTS;
    const url = new ApiBuilder(UPDATE_ORDER_STATUS).path('id', id).build();
    const response = await api.patch(url, { status });
    return response.data;
};
