import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export const getAddresses = async () => {
    const { GET_ADDRESSES } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADDRESSES).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const getMinimalDetails = async () => {
    const { GET_MINIMAL_DETAILS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_MINIMAL_DETAILS).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const updateProfile = async (data: any) => {
    const { UPDATE_PROFILE } = API_ENDPOINTS;
    const url = new ApiBuilder(UPDATE_PROFILE).build();
    const response = await api.patch(url, data);
    return handleApiResponse(response);
};

export const uploadProfilePicture = async (file: File) => {
    const { UPLOAD_PROFILE_PICTURE } = API_ENDPOINTS;
    const url = new ApiBuilder(UPLOAD_PROFILE_PICTURE).build();
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await api.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return handleApiResponse(response);
};

export const getAddress = async (
    id: string,
    method: 'get' | 'delete' | 'put' = 'get',
    data?: any
) => {
    const { GET_ADDRESS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADDRESS).path('id', id).build();

    if (method === 'put') {
        const config =
            data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.put(url, data, config);
        return handleApiResponse(response);
    }

    const response = await api[method](url);
    return handleApiResponse(response);
};

export const createAddress = async (data: any) => {
    const { GET_ADDRESSES } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADDRESSES).build();
    const response = await api.post(url, data);
    return handleApiResponse(response);
};

// Client services
export const getClients = async (params: any = {}, method: 'get' | 'post' = 'get') => {
    const { GET_CLIENTS } = API_ENDPOINTS;

    if (method === 'get') {
        const filters = params as any;
        const url = new ApiBuilder(GET_CLIENTS)
            .query('page', filters.page)
            .query('q', filters.q)
            .query('sortBy', filters.sortBy)
            .query('sortOrder', filters.sortOrder)
            .build();

        const response = await api.get(url);
        return handleApiResponse(response);
    } else {
        const data = params as any;
        const url = new ApiBuilder(GET_CLIENTS).build();
        const response = await api.post(url, data);
        return handleApiResponse(response);
    }
};

export const getClient = async (
    id: string,
    method: 'get' | 'delete' | 'put' = 'get',
    data?: any
) => {
    const { GET_CLIENT_DETAIL } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_CLIENT_DETAIL).path('pk', id).build();

    if (method === 'put') {
        const config =
            data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.put(url, data, config);
        return handleApiResponse(response);
    }

    const response = await api[method](url);
    return handleApiResponse(response);
};

export const createClient = async (data: any) => {
    const { GET_CLIENTS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_CLIENTS).build();
    const response = await api.post(url, data);
    return handleApiResponse(response);
};

export type RoleData = {
    id?: string;
    name: string;
    description?: string;
    permissions: string[];
    is_active?: boolean;
    user_count?: number;
};

export type AdminUserData = {
    id?: string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    assigned_role?: string | null;
    assigned_role_name?: string;
    permissions?: string[];
    phone_number?: string;
    is_active?: boolean;
};

export const getAdminRoles = async () => {
    const { GET_ADMIN_ROLES } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADMIN_ROLES).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const createAdminRole = async (data: Partial<RoleData>) => {
    const { CREATE_ADMIN_ROLE } = API_ENDPOINTS;
    const url = new ApiBuilder(CREATE_ADMIN_ROLE).build();
    const response = await api.post(url, data);
    return handleApiResponse(response);
};

export const updateAdminRole = async (id: string, data: Partial<RoleData>) => {
    const { MANAGE_ADMIN_ROLE } = API_ENDPOINTS;
    const url = new ApiBuilder(MANAGE_ADMIN_ROLE).path('id', id).build();
    const response = await api.patch(url, data);
    return handleApiResponse(response);
};

export const deleteAdminRole = async (id: string) => {
    const { MANAGE_ADMIN_ROLE } = API_ENDPOINTS;
    const url = new ApiBuilder(MANAGE_ADMIN_ROLE).path('id', id).build();
    const response = await api.delete(url);
    return handleApiResponse(response);
};

export const getAdminUsers = async () => {
    const { GET_ADMIN_USERS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADMIN_USERS).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const createAdminUser = async (data: Partial<AdminUserData>) => {
    const { CREATE_ADMIN_USER } = API_ENDPOINTS;
    const url = new ApiBuilder(CREATE_ADMIN_USER).build();
    const response = await api.post(url, data);
    return handleApiResponse(response);
};

export const updateAdminUser = async (id: string, data: Partial<AdminUserData>) => {
    const { MANAGE_ADMIN_USER } = API_ENDPOINTS;
    const url = new ApiBuilder(MANAGE_ADMIN_USER).path('id', id).build();
    const response = await api.patch(url, data);
    return handleApiResponse(response);
};

export const deleteAdminUser = async (id: string) => {
    const { MANAGE_ADMIN_USER } = API_ENDPOINTS;
    const url = new ApiBuilder(MANAGE_ADMIN_USER).path('id', id).build();
    const response = await api.delete(url);
    return handleApiResponse(response);
};
