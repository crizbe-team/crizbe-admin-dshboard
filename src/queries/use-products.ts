import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProduct } from '../services/products';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_PRODUCTS, GET_PRODUCT } = API_ENDPOINTS;

export const useFetchProducts = (filters: any = {}) => {
    return useQuery({
        queryKey: [GET_PRODUCTS, filters],
        queryFn: () => getProducts(filters, 'get'),
    });
};

export const useFetchSingleProduct = (id: string) => {
    return useQuery({
        queryKey: [GET_PRODUCT, id],
        queryFn: () => getProduct(id, 'get'),
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => getProducts(data, 'post'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<any> }) =>
            getProduct(id, 'put', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => getProduct(id, 'delete'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
        },
    });
};
