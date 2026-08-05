import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartSummary } from '../services/cart';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_CART, GET_CART_SUMMARY, GET_PRODUCT, GET_PRODUCTS, GET_MINIMAL_DETAILS } = API_ENDPOINTS;

export const useFetchCart = () => {
    return useQuery<any>({
        queryKey: [GET_CART],
        queryFn: () => getCart(),
    });
};

export const useFetchInfiniteCart = (params?: any) => {
    return useInfiniteQuery<any>({
        queryKey: [GET_CART, 'infinite', params],
        queryFn: ({ pageParam = 1 }) =>
            getCart({ ...params, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => {
            const pagination = lastPage?.pagination;
            if (pagination?.has_next && pagination?.next_page_number) {
                return pagination.next_page_number;
            }
            return undefined;
        },
    });
};

export const useFetchCartSummary = (params?: { variant_id?: string; quantity?: number }) => {
    return useQuery<any>({
        queryKey: [GET_CART_SUMMARY, params?.variant_id, params?.quantity],
        queryFn: () => getCartSummary(params),
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => addToCart(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CART] });
            queryClient.invalidateQueries({ queryKey: [GET_CART_SUMMARY] });
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCT] });
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
            queryClient.invalidateQueries({ queryKey: [GET_MINIMAL_DETAILS] });
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => updateCartItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CART] });
            queryClient.invalidateQueries({ queryKey: [GET_CART_SUMMARY] });
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCT] });
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
            queryClient.invalidateQueries({ queryKey: [GET_MINIMAL_DETAILS] });
        },
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => removeFromCart(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CART] });
            queryClient.invalidateQueries({ queryKey: [GET_CART_SUMMARY] });
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCT] });
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
            queryClient.invalidateQueries({ queryKey: [GET_MINIMAL_DETAILS] });
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => clearCart(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CART] });
            queryClient.invalidateQueries({ queryKey: [GET_CART_SUMMARY] });
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCT] });
            queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS] });
            queryClient.invalidateQueries({ queryKey: [GET_MINIMAL_DETAILS] });
        },
    });
};

