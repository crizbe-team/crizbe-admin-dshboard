import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export const getCart = async () => {
    const { GET_CART } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_CART).build();
    const response = await api.get(url);
    return handleApiResponse(response, { errorCodes: [6001] });
};

export const addToCart = async (data: any) => {
    const { ADD_TO_CART } = API_ENDPOINTS;
    const url = new ApiBuilder(ADD_TO_CART).build();
    const response = await api.post(url, data);
    return handleApiResponse(response, { errorCodes: [6001] });
};

export const updateCartItem = async (data: any) => {
    const { UPDATE_CART_ITEM } = API_ENDPOINTS;
    const url = new ApiBuilder(UPDATE_CART_ITEM).build();
    const response = await api.post(url, data);
    return handleApiResponse(response, { errorCodes: [6001] });
};

export const removeFromCart = async (id: string) => {
    const { REMOVE_FROM_CART } = API_ENDPOINTS;
    const url = new ApiBuilder(REMOVE_FROM_CART).path('id', id).build();
    const response = await api.delete(url);
    return handleApiResponse(response, { errorCodes: [6001] });
};

export const clearCart = async () => {
    const { CLEAR_CART } = API_ENDPOINTS;
    const url = new ApiBuilder(CLEAR_CART).build();
    const response = await api.post(url);
    return handleApiResponse(response, { errorCodes: [6001] });
};
