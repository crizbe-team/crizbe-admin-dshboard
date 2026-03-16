import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAddresses,
    getAddress,
    createAddress,
    getClients,
    getClient,
    createClient,
    getMinimalDetails,
} from '../services/account';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_ADDRESSES, GET_CLIENTS, GET_MINIMAL_DETAILS } = API_ENDPOINTS;

export const useFetchMinimalDetails = (enabled: boolean = false) => {
    return useQuery<any>({
        queryKey: [GET_MINIMAL_DETAILS],
        queryFn: () => getMinimalDetails(),
        enabled: enabled,
    });
};

export const useFetchAddresses = () => {
    return useQuery<any>({
        queryKey: [GET_ADDRESSES],
        queryFn: () => getAddresses(),
    });
};

export const useFetchAddress = (id: string) => {
    return useQuery<any>({
        queryKey: [API_ENDPOINTS.GET_ADDRESS, id],
        queryFn: () => getAddress(id),
        enabled: !!id, // Only run query if id is provided
    });
};

export const useCreateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (data: any) => createAddress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADDRESSES] });
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: ({ id, data }: { id: string; data: any }) => getAddress(id, 'put', data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [GET_ADDRESSES] });
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.GET_ADDRESS, variables.id] });
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (id: string) => getAddress(id, 'delete'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADDRESSES] });
        },
    });
};

// Client queries
export const useFetchClients = (filters: any = {}) => {
    return useQuery<any>({
        queryKey: [GET_CLIENTS, filters],
        queryFn: () => getClients(filters, 'get'),
    });
};

export const useFetchClient = (id: string) => {
    return useQuery<any>({
        queryKey: [API_ENDPOINTS.GET_CLIENTS, id],
        queryFn: () => getClient(id),
        enabled: !!id, // Only run query if id is provided
    });
};

export const useCreateClient = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (data: any) => getClients(data, 'post'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CLIENTS] });
        },
    });
};

export const useUpdateClient = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: ({ id, data }: { id: string; data: any }) => getClient(id, 'put', data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [GET_CLIENTS] });
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.GET_CLIENTS, variables.id] });
        },
    });
};

export const useDeleteClient = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (id: string) => getClient(id, 'delete'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_CLIENTS] });
        },
    });
};
