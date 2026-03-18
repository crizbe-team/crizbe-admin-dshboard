import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getVariants, getVariant } from '../services/variants';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { toast } from '@/components/ui/Toast';

const { GET_VARIANTS, GET_VARIANT } = API_ENDPOINTS;

export const useFetchVariants = (filters: any = {}) => {
    return useQuery<any>({
        queryKey: [GET_VARIANTS, filters],
        queryFn: () => getVariants(filters, 'get'),
    });
};

export const useFetchSingleVariant = (id: string) => {
    return useQuery<any>({
        queryKey: [GET_VARIANT, id],
        queryFn: () => getVariant(id, 'get'),
    });
};

export const useCreateVariant = () => {
    const queryClient = useQueryClient();

    return useMutation<any, any, any>({
        mutationFn: (data: any) => getVariants(data, 'post'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_VARIANTS] });
            toast.success('Variants created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create variants');
        },
    });
};

export const useUpdateVariant = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<any> }) =>
            getVariant(id, 'put', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_VARIANTS] });
            toast.success('Variant updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update variant');
        },
    });
};

export const useDeleteVariant = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (id: string | number) => getVariant(id, 'delete'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_VARIANTS] });
            toast.success('Variant deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to delete variant');
        },
    });
};
