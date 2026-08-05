import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
    getAddresses,
    getAddress,
    createAddress,
    getClients,
    getClient,
    getMinimalDetails,
    updateProfile,
    uploadProfilePicture,
    getAdminRoles,
    createAdminRole,
    updateAdminRole,
    deleteAdminRole,
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    RoleData,
    AdminUserData,
} from '../services/account';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_ADDRESSES, GET_CLIENTS, GET_MINIMAL_DETAILS, GET_ADMIN_ROLES, GET_ADMIN_USERS } =
    API_ENDPOINTS;

export const useFetchMinimalDetails = (enabled: boolean = false) => {
    return useQuery<any>({
        queryKey: [GET_MINIMAL_DETAILS],
        queryFn: () => getMinimalDetails(),
        enabled: enabled,
        staleTime: 15 * 60 * 1000, // Cache user details for 5 minutes
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, any>({
        mutationFn: (data: any) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_MINIMAL_DETAILS] });
        },
    });
};

export const useUploadProfilePicture = () => {
    const queryClient = useQueryClient();
    return useMutation<any, any, File>({
        mutationFn: (file: File) => uploadProfilePicture(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_MINIMAL_DETAILS] });
        },
    });
};

export const useFetchAddresses = () => {
    return useQuery<any>({
        queryKey: [GET_ADDRESSES],
        queryFn: () => getAddresses(),
    });
};

export const useFetchInfiniteAddresses = (params?: any) => {
    return useInfiniteQuery<any>({
        queryKey: [GET_ADDRESSES, 'infinite', params],
        queryFn: ({ pageParam = 1 }) =>
            getAddresses({ ...params, page: pageParam }),
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
        queryKey: [API_ENDPOINTS.GET_CLIENT_DETAIL, id],
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

// Admin Role Queries & Mutations
export const useFetchAdminRoles = (params: any = {}) => {
    return useQuery({
        queryKey: [GET_ADMIN_ROLES, params],
        queryFn: () => getAdminRoles(params),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateRoleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<RoleData>) => createAdminRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_ROLES] });
        },
    });
};

export const useUpdateRoleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<RoleData> }) =>
            updateAdminRole(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_ROLES] });
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_USERS] });
        },
    });
};

export const useDeleteRoleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAdminRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_ROLES] });
        },
    });
};

// Admin Sub-User Queries & Mutations
export const useFetchAdminUsers = (params: any = {}) => {
    return useQuery({
        queryKey: [GET_ADMIN_USERS, params],
        queryFn: () => getAdminUsers(params),
        staleTime: 1000 * 60 * 2,
    });
};

export const useCreateAdminUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<AdminUserData>) => createAdminUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_USERS] });
        },
    });
};

export const useUpdateAdminUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<AdminUserData> }) =>
            updateAdminUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_USERS] });
        },
    });
};

export const useDeleteAdminUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAdminUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_USERS] });
        },
    });
};
