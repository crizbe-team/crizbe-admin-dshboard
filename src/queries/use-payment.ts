import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getRazorpayKeyId,
    createPaymentOrder,
    verifyPayment,
    getPaymentDetails,
} from '../services/payment';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_RAZORPAY_KEY_ID, CREATE_PAYMENT_ORDER, VERIFY_PAYMENT, GET_PAYMENT_DETAILS } =
    API_ENDPOINTS;

export const useRazorpayKeyId = () => {
    return useQuery<any>({
        queryKey: [GET_RAZORPAY_KEY_ID],
        queryFn: () => getRazorpayKeyId(),
    });
};

export const useCreatePaymentOrder = () => {
    const queryClient = useQueryClient();
    return useMutation<
        any,
        any,
        { orderId?: string; currency?: string; variantId?: string; quantity?: number } | undefined
    >({
        mutationFn: (data) => createPaymentOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CREATE_PAYMENT_ORDER] });
        },
    });
};

export const useVerifyPayment = () => {
    const queryClient = useQueryClient();
    return useMutation<
        any,
        any,
        {
            razorpayOrderId: string;
            razorpayPaymentId: string;
            razorpaySignature: string;
            addressId?: string;
            variantId?: string;
            quantity?: number;
        }
    >({
        mutationFn: (payload) => verifyPayment(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [VERIFY_PAYMENT] });
        },
    });
};

export const usePaymentDetails = (paymentId: string) => {
    return useQuery<any>({
        queryKey: [GET_PAYMENT_DETAILS, paymentId],
        queryFn: () => getPaymentDetails(paymentId),
        enabled: !!paymentId,
    });
};
