import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';

export const getCart = async () => {
    const { GET_CART } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_CART).build();
    const response = await api.get(url);
    const { status_code, message, data } = response?.data;

    if (status_code === 6001) {
        throw { message, errors: data };
    }
    return response.data;
};

export const addToCart = async (data: any) => {
    const { ADD_TO_CART } = API_ENDPOINTS;
    const url = new ApiBuilder(ADD_TO_CART).build();
    const response = await api.post(url, data);
    const { status_code, message, data: responseData } = response?.data;

    if (status_code === 6001) {
        throw { message, errors: responseData };
    }
    return response.data;
};

export const updateCartItem = async (data: any) => {
    const { UPDATE_CART_ITEM } = API_ENDPOINTS;
    const url = new ApiBuilder(UPDATE_CART_ITEM).build();
    const response = await api.post(url, data);
    const { status_code, message, data: responseData } = response?.data;

    if (status_code === 6001) {
        throw { message, errors: responseData };
    }
    return response.data;
};

export const removeFromCart = async (id: string) => {
    const { REMOVE_FROM_CART } = API_ENDPOINTS;
    const url = new ApiBuilder(REMOVE_FROM_CART).path('id', id).build();
    const response = await api.delete(url);
    const { status_code, message, data } = response?.data;

    if (status_code === 6001) {
        throw { message, errors: data };
    }
    return response.data;
};

export const clearCart = async () => {
    const { CLEAR_CART } = API_ENDPOINTS;
    const url = new ApiBuilder(CLEAR_CART).build();
    const response = await api.post(url);
    const { status_code, message, data } = response?.data;

    if (status_code === 6001) {
        throw { message, errors: data };
    }
    return response.data;
};
