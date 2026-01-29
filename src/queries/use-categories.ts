import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCategories, getCategory } from '../services/categories';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_CATEGORIES, GET_CATEGORY } = API_ENDPOINTS;

export const useFetchCategories = (filters: any = {}) => {
    return useQuery({
        queryKey: [GET_CATEGORIES, filters],
        queryFn: () => getCategories(filters, 'get'),
    });
};

export const useFetchSingleCategory = (id: string) => {
    return useQuery({
        queryKey: [GET_CATEGORY, id],
        queryFn: () => getCategory(id, 'get'),
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => getCategories(data, 'post'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<any> }) =>
            getCategory(id, 'put', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => getCategory(id, 'delete'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES] });
        },
    });
};
