import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCategories, getCategory } from '../services/categories';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { toast } from '@/components/ui/Toast';

const { GET_CATEGORIES, GET_CATEGORY } = API_ENDPOINTS;

export const useFetchCategories = (filters: any = {}) => {
    return useQuery<any>({
        queryKey: [GET_CATEGORIES, filters],
        queryFn: () => getCategories(filters, 'get'),
    });
};

export const useFetchSingleCategory = (id: string) => {
    return useQuery<any>({
        queryKey: [GET_CATEGORY, id],
        queryFn: () => getCategory(id, 'get'),
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<any, any, any>({
        mutationFn: (data: any) => getCategories(data, 'post'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES] });
            toast.success('Category created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create category');
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<any> }) =>
            getCategory(id, 'put', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES] });
            toast.success('Category updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update category');
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (id: string | number) => getCategory(id, 'delete'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES] });
            toast.success('Category deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to delete category');
        },
    });
};
