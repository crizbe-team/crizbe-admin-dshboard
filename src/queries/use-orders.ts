import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createOrder,
    getOrderList,
    getOrderDetail,
    getAdminOrderList,
    updateOrderStatus,
    getAdminOrderDetail,
    updateOrderTracking,
    getUserOrdersAdmin,
} from '../services/orders';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { ORDER_LIST, ADMIN_ORDER_LIST, ORDER_DETAIL, ADMIN_ORDER_DETAIL, GET_USER_ORDERS_ADMIN } =
    API_ENDPOINTS;

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (data: any) => createOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ORDER_LIST] });
        },
    });
};

export const useFetchOrders = (params?: any) => {
    return useQuery<any>({
        queryKey: [ORDER_LIST, params],
        queryFn: () => getOrderList(params),
    });
};

export const useFetchOrderDetail = (id: string) => {
    return useQuery<any>({
        queryKey: [ORDER_DETAIL, id],
        queryFn: () => getOrderDetail(id),
        enabled: !!id,
    });
};

export const useFetchAdminOrders = (params?: any) => {
    return useQuery<any>({
        queryKey: [ADMIN_ORDER_LIST, params],
        queryFn: () => getAdminOrderList(params),
    });
};

export const useFetchAdminOrderDetail = (id: string) => {
    return useQuery<any>({
        queryKey: [ADMIN_ORDER_DETAIL, id],
        queryFn: () => getAdminOrderDetail(id),
        enabled: !!id,
    });
};

export const useFetchUserOrdersAdmin = (userId: string, params?: any) => {
    return useQuery<any>({
        queryKey: [GET_USER_ORDERS_ADMIN, userId, params],
        queryFn: () => getUserOrdersAdmin(userId, params),
        enabled: !!userId,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, { id: string; status: string }>({
        mutationFn: ({ id, status }) => updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_ORDER_LIST] });
            queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_ORDER_DETAIL] });
        },
    });
};

export const useUpdateOrderTracking = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, { id: string; tracking_number: string }>({
        mutationFn: ({ id, tracking_number }) => updateOrderTracking(id, tracking_number),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_ORDER_LIST] });
            queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_ORDER_DETAIL] });
        },
    });
};
