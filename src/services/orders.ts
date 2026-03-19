import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export const createOrder = async (data: any): Promise<any> => {
    const { CREATE_ORDER } = API_ENDPOINTS;
    const url = new ApiBuilder(CREATE_ORDER).build();
    const response = await api.post(url, data);
    return handleApiResponse(response);
};

export const getOrderList = async (params?: any): Promise<any> => {
    const { ORDER_LIST } = API_ENDPOINTS;
    const builder = new ApiBuilder(ORDER_LIST);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            builder.query(key, value as any);
        });
    }
    const url = builder.build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const getOrderDetail = async (id: string): Promise<any> => {
    const { ORDER_DETAIL } = API_ENDPOINTS;
    const url = new ApiBuilder(ORDER_DETAIL).path('id', id).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const getAdminOrderDetail = async (id: string): Promise<any> => {
    const { ADMIN_ORDER_DETAIL } = API_ENDPOINTS;
    const url = new ApiBuilder(ADMIN_ORDER_DETAIL).path('pk', id).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const getAdminOrderList = async (params?: any): Promise<any> => {
    const { ADMIN_ORDER_LIST } = API_ENDPOINTS;
    const builder = new ApiBuilder(ADMIN_ORDER_LIST);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            builder.query(key, value as any);
        });
    }
    const url = builder.build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const updateOrderStatus = async (id: string, status: string): Promise<any> => {
    const { UPDATE_ORDER_STATUS } = API_ENDPOINTS;
    const url = new ApiBuilder(UPDATE_ORDER_STATUS).path('pk', id).build();
    const response = await api.patch(url, { status });
    return handleApiResponse(response);
};

export const updateOrderTracking = async (id: string, tracking_number: string): Promise<any> => {
    const { UPDATE_ORDER_TRACKING } = API_ENDPOINTS;
    const url = new ApiBuilder(UPDATE_ORDER_TRACKING).path('pk', id).build();
    const response = await api.patch(url, { tracking_number });
    return handleApiResponse(response);
};
