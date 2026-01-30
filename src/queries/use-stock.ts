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

const {
    GET_STOCK_LIST,
    GET_PRODUCT_STOCK,
    GET_VARIANT_STOCK,
    GET_STOCK_HISTORY,
    GET_STOCK_HISTORY_LIST,
} = API_ENDPOINTS;

export const useFetchStockList = (filters: any = {}) => {
    return useQuery({
        queryKey: [GET_STOCK_LIST, filters],
        queryFn: () => getStockList(filters),
    });
};

export const useFetchStockHistoryList = (filters: any = {}) => {
    return useQuery({
        queryKey: [GET_STOCK_HISTORY_LIST, filters],
        queryFn: () => getStockHistoryList(filters),
    });
};

export const useDeleteStockHistory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => deleteStockHistory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_STOCK_LIST] });
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCT_STOCK] });
            queryClient.invalidateQueries({ queryKey: [GET_VARIANT_STOCK] });
            queryClient.invalidateQueries({ queryKey: [GET_STOCK_HISTORY] });
            queryClient.invalidateQueries({ queryKey: [GET_STOCK_HISTORY_LIST] });
        },
    });
};

export const useCreateStock = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => createStock(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_STOCK_LIST] });
        },
    });
};

export const useFetchProductStock = (id: string) => {
    return useQuery({
        queryKey: [GET_PRODUCT_STOCK, id],
        queryFn: () => getProductStock(id),
        enabled: !!id,
    });
};

export const useFetchVariantStock = (id: string) => {
    return useQuery({
        queryKey: [GET_VARIANT_STOCK, id],
        queryFn: () => getVariantStock(id),
        enabled: !!id,
    });
};

export const useFetchStockHistory = (id: string) => {
    return useQuery({
        queryKey: [GET_STOCK_HISTORY, id],
        queryFn: () => getStockHistory(id),
        enabled: !!id,
    });
};
