import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/utils/api-endpoints';
import { ApiBuilder } from '@/utils/api-builder';
import { handleApiResponse } from '@/utils/api-handler';
import { BlogItem, BlogApiResponse, BlogFilterParams } from '@/types/blog';

export type { BlogItem, BlogApiResponse, BlogFilterParams };

// Public API Services (Published articles only)
export const getPublicBlogs = async (params?: BlogFilterParams) => {
    const { GET_PUBLIC_BLOGS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_PUBLIC_BLOGS)
        .query('category', params?.category)
        .query('q', params?.q)
        .build();

    const response = await api.get(url);
    return handleApiResponse(response);
};

export const getPublicBlogDetail = async (slug: string) => {
    const { GET_PUBLIC_BLOG_DETAIL } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_PUBLIC_BLOG_DETAIL).path('slug', slug).build();

    const response = await api.get(url);
    return handleApiResponse(response);
};

// Admin API Services (Draft + Published)
export const getAdminBlogs = async (params?: BlogFilterParams) => {
    const { GET_ADMIN_BLOGS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADMIN_BLOGS)
        .query('status', params?.status)
        .query('category', params?.category)
        .query('q', params?.q)
        .build();

    const response = await api.get(url);
    return handleApiResponse(response);
};

export const getAdminBlogDetail = async (id: string) => {
    const { GET_ADMIN_BLOG_DETAIL } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADMIN_BLOG_DETAIL).path('id', id).build();

    const response = await api.get(url);
    return handleApiResponse(response);
};

export const createAdminBlog = async (formData: FormData) => {
    const { CREATE_ADMIN_BLOG } = API_ENDPOINTS;
    const url = new ApiBuilder(CREATE_ADMIN_BLOG).build();

    const response = await api.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return handleApiResponse(response);
};

export const updateAdminBlog = async (id: string, formData: FormData) => {
    const { UPDATE_ADMIN_BLOG } = API_ENDPOINTS;
    const url = new ApiBuilder(UPDATE_ADMIN_BLOG).path('id', id).build();

    const response = await api.put(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return handleApiResponse(response);
};

export const toggleBlogStatus = async (id: string, status?: 'draft' | 'published') => {
    const { TOGGLE_ADMIN_BLOG_STATUS } = API_ENDPOINTS;
    const url = new ApiBuilder(TOGGLE_ADMIN_BLOG_STATUS).path('id', id).build();

    const response = await api.post(url, { status });
    return handleApiResponse(response);
};

export const deleteAdminBlog = async (id: string) => {
    const { DELETE_ADMIN_BLOG } = API_ENDPOINTS;
    const url = new ApiBuilder(DELETE_ADMIN_BLOG).path('id', id).build();

    const response = await api.delete(url);
    return handleApiResponse(response);
};
