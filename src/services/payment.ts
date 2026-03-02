import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';

export const getRazorpayKeyId = async () => {
    const { GET_RAZORPAY_KEY_ID } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_RAZORPAY_KEY_ID).build();
    const response = await api.get(url);
    const { status_code, message, data } = response?.data;

    if (status_code !== 200) {
        throw { message, errors: data };
    }
    return response.data;
};

export const createPaymentOrder = async (orderId: string) => {
    const { CREATE_PAYMENT_ORDER } = API_ENDPOINTS;
    const url = new ApiBuilder(CREATE_PAYMENT_ORDER).build();
    const response = await api.post(url, { order_id: orderId });
    console.log('response', response);
    const { status_code, message, data } = response?.data;

    if (status_code !== 200) {
        throw { message, errors: data };
    }
    return response.data;
};

export const verifyPayment = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
) => {
    const { VERIFY_PAYMENT } = API_ENDPOINTS;
    const url = new ApiBuilder(VERIFY_PAYMENT).build();
    const response = await api.post(url, {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
    });
    const { status_code, message, data } = response?.data;

    if (status_code !== 200) {
        throw { message, errors: data };
    }
    return response.data;
};

export const getPaymentDetails = async (paymentId: string) => {
    const { GET_PAYMENT_DETAILS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_PAYMENT_DETAILS).path('id', paymentId).build();
    const response = await api.get(url);
    const { status_code, message, data } = response?.data;

    if (status_code !== 200) {
        throw { message, errors: data };
    }
    return response.data;
};