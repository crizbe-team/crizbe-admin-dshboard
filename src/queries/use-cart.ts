import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../services/cart';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_CART } = API_ENDPOINTS;

export const useFetchCart = () => {
    return useQuery({
        queryKey: [GET_CART],
        queryFn: () => getCart(),
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => addToCart(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CART] });
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => updateCartItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CART] });
        },
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => removeFromCart(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CART] });
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => clearCart(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CART] });
        },
    });
};
