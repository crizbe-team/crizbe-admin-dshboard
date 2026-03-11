import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProduct, getRelatedProducts } from '../services/products';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_PRODUCTS, GET_PRODUCT } = API_ENDPOINTS;

export const useFetchProducts = (filters: any = {}) => {
    return useQuery<any>({
        queryKey: [GET_PRODUCTS, filters],
        queryFn: () => getProducts(filters, 'get'),
        select: (data) => data?.data,
    });
};

export const useFetchSingleProduct = (id: string) => {
    return useQuery<any>({
        queryKey: [GET_PRODUCT, id],
        queryFn: () => getProduct(id, 'get'),
        select: (data) => data?.data,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<any, any, any>({
        mutationFn: (data: any) => getProducts(data, 'post'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<any> }) =>
            getProduct(id, 'put', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (id: string | number) => getProduct(id, 'delete'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
        },
    });
};

export const useFetchRelatedProducts = (id: string | number) => {
    return useQuery<any>({
        queryKey: [API_ENDPOINTS.GET_RELATED_PRODUCTS, id],
        queryFn: () => getRelatedProducts(id),
        enabled: !!id,
    });
};
