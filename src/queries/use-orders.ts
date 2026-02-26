import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createOrder,
    getOrderList,
    getOrderDetail,
    getAdminOrderList,
    updateOrderStatus,
} from '../services/orders';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { ORDER_LIST, ADMIN_ORDER_LIST, ORDER_DETAIL } = API_ENDPOINTS;

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => createOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ORDER_LIST] });
        },
    });
};

export const useFetchOrders = (params?: any) => {
    return useQuery({
        queryKey: [ORDER_LIST, params],
        queryFn: () => getOrderList(params),
    });
};

export const useFetchOrderDetail = (id: string) => {
    return useQuery({
        queryKey: [ORDER_DETAIL, id],
        queryFn: () => getOrderDetail(id),
        enabled: !!id,
    });
};

export const useFetchAdminOrders = (params?: any) => {
    return useQuery({
        queryKey: [ADMIN_ORDER_LIST, params],
        queryFn: () => getAdminOrderList(params),
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_ORDER_LIST] });
            queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL] });
        },
    });
};
