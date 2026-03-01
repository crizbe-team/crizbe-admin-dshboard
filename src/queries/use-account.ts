import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAddresses, getAddress, createAddress } from '../services/account';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_ADDRESSES } = API_ENDPOINTS;

export const useFetchAddresses = () => {
    return useQuery({
        queryKey: [GET_ADDRESSES],
        queryFn: () => getAddresses(),
    });
};

export const useFetchAddress = (id: string) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.GET_ADDRESS, id],
        queryFn: () => getAddress(id),
        enabled: !!id, // Only run query if id is provided
    });
};

export const useCreateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => createAddress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADDRESSES] });
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => getAddress(id, 'put', data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [GET_ADDRESSES] });
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.GET_ADDRESS, variables.id] });
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => getAddress(id, 'delete'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADDRESSES] });
        },
    });
};
