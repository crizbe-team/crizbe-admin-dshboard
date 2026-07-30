import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export const getRazorpayKeyId = async () => {
    const { GET_RAZORPAY_KEY_ID } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_RAZORPAY_KEY_ID).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const createPaymentOrder = async (data?: { orderId?: string; currency?: string }) => {
    const { CREATE_PAYMENT_ORDER } = API_ENDPOINTS;
    const url = new ApiBuilder(CREATE_PAYMENT_ORDER).build();
    const response = await api.post(url, {
        order_id: data?.orderId,
        currency: data?.currency || 'INR',
    });
    return handleApiResponse(response);
};

export const verifyPayment = async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    addressId?: string;
}) => {
    const { VERIFY_PAYMENT } = API_ENDPOINTS;
    const url = new ApiBuilder(VERIFY_PAYMENT).build();
    const response = await api.post(url, {
        razorpay_order_id: data.razorpayOrderId,
        razorpay_payment_id: data.razorpayPaymentId,
        razorpay_signature: data.razorpaySignature,
        address_id: data.addressId,
    });
    return handleApiResponse(response);
};

export const getPaymentDetails = async (paymentId: string) => {
    const { GET_PAYMENT_DETAILS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_PAYMENT_DETAILS).path('id', paymentId).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};