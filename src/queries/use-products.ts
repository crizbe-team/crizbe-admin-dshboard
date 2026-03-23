import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getProducts,
    getProduct,
    getRelatedProducts,
    createProductReview,
} from '../services/products';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { toast } from '@/components/ui/Toast';

const { GET_PRODUCTS, GET_PRODUCT } = API_ENDPOINTS;

export const useFetchProducts = (filters: any = {}) => {
    return useQuery<any>({
        queryKey: [GET_PRODUCTS, filters],
        queryFn: () => getProducts(filters, 'get'),
    });
};

export const useFetchSingleProduct = (id: string) => {
    return useQuery<any>({
        queryKey: [GET_PRODUCT, id],
        queryFn: () => getProduct(id, 'get'),
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<any, any, any>({
        mutationFn: (data: any) => getProducts(data, 'post'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
            toast.success('Product created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create product');
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
            toast.success('Product updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update product');
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (id: string | number) => getProduct(id, 'delete'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
            toast.success('Product deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to delete product');
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

export const useCreateProductReview = (productSlug: string) => {
    const queryClient = useQueryClient();

    return useMutation<any, any, FormData | Record<string, any>>({
        mutationFn: (data) => createProductReview(productSlug, data),
        onSuccess: () => {
            toast.success('Review submitted successfully!');
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.GET_PRODUCT] });
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to submit review. Please try again.');
        },
    });
};
