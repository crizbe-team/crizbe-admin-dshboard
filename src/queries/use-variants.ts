import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getVariants, getVariant } from '../services/variants';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_VARIANTS, GET_VARIANT } = API_ENDPOINTS;

export const useFetchVariants = (filters: any = {}) => {
    return useQuery({
        queryKey: [GET_VARIANTS, filters],
        queryFn: () => getVariants(filters, 'get'),
    });
};

export const useFetchSingleVariant = (id: string) => {
    return useQuery({
        queryKey: [GET_VARIANT, id],
        queryFn: () => getVariant(id, 'get'),
    });
};

export const useCreateVariant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => getVariants(data, 'post'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_VARIANTS] });
        },
    });
};

export const useUpdateVariant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<any> }) =>
            getVariant(id, 'put', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_VARIANTS] });
        },
    });
};

export const useDeleteVariant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => getVariant(id, 'delete'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_VARIANTS] });
        },
    });
};
