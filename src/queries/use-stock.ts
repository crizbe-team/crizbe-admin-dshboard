import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getStockList,
    getProductStock,
    getVariantStock,
    getStockHistory,
    createStock,
    getStockHistoryList,
    deleteStockHistory,
} from '../services/stock';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { toast } from '@/components/ui/Toast';

const {
    GET_STOCK_LIST,
    GET_PRODUCT_STOCK,
    GET_VARIANT_STOCK,
    GET_STOCK_HISTORY,
    GET_STOCK_HISTORY_LIST,
} = API_ENDPOINTS;

export const useFetchStockList = (filters: any = {}) => {
    return useQuery<any>({
        queryKey: [GET_STOCK_LIST, filters],
        queryFn: () => getStockList(filters),
    });
};

export const useFetchStockHistoryList = (filters: any = {}) => {
    return useQuery<any>({
        queryKey: [GET_STOCK_HISTORY_LIST, filters],
        queryFn: () => getStockHistoryList(filters),
    });
};

export const useDeleteStockHistory = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (id: string | number) => deleteStockHistory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_STOCK_LIST] });
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCT_STOCK] });
            queryClient.invalidateQueries({ queryKey: [GET_VARIANT_STOCK] });
            queryClient.invalidateQueries({ queryKey: [GET_STOCK_HISTORY] });
            queryClient.invalidateQueries({ queryKey: [GET_STOCK_HISTORY_LIST] });
            toast.success('Stock history deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to delete stock history');
        },
    });
};

export const useCreateStock = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (data: any) => createStock(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_STOCK_LIST] });
            toast.success('Stock added successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to add stock');
        },
    });
};

export const useFetchProductStock = (id: string) => {
    return useQuery<any>({
        queryKey: [GET_PRODUCT_STOCK, id],
        queryFn: () => getProductStock(id),
        enabled: !!id,
    });
};

export const useFetchVariantStock = (id: string) => {
    return useQuery<any>({
        queryKey: [GET_VARIANT_STOCK, id],
        queryFn: () => getVariantStock(id),
        enabled: !!id,
    });
};

export const useFetchStockHistory = (id: string) => {
    return useQuery<any>({
        queryKey: [GET_STOCK_HISTORY, id],
        queryFn: () => getStockHistory(id),
        enabled: !!id,
    });
};
