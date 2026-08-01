import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPublicBlogs,
    getPublicBlogDetail,
    getAdminBlogs,
    getAdminBlogDetail,
    createAdminBlog,
    updateAdminBlog,
    toggleBlogStatus,
    deleteAdminBlog,
} from '@/services/blog';
import { BlogFilterParams } from '@/types/blog';

export const QUERY_KEYS = {
    PUBLIC_BLOGS: 'public-blogs',
    PUBLIC_BLOG_DETAIL: 'public-blog-detail',
    ADMIN_BLOGS: 'admin-blogs',
    ADMIN_BLOG_DETAIL: 'admin-blog-detail',
} as const;

export const useFetchPublicBlogs = (params?: BlogFilterParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.PUBLIC_BLOGS, params],
        queryFn: () => getPublicBlogs(params),
        staleTime: 60 * 1000,
    });
};

export const useFetchPublicBlogDetail = (slug: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.PUBLIC_BLOG_DETAIL, slug],
        queryFn: () => getPublicBlogDetail(slug),
        enabled: Boolean(slug),
        staleTime: 60 * 1000,
    });
};

export const useFetchAdminBlogs = (params?: BlogFilterParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ADMIN_BLOGS, params],
        queryFn: () => getAdminBlogs(params),
        staleTime: 10 * 1000,
    });
};

export const useFetchAdminBlogDetail = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ADMIN_BLOG_DETAIL, id],
        queryFn: () => getAdminBlogDetail(id),
        enabled: Boolean(id),
    });
};

export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => createAdminBlog(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BLOGS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PUBLIC_BLOGS] });
        },
    });
};

export const useUpdateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateAdminBlog(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BLOGS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PUBLIC_BLOGS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PUBLIC_BLOG_DETAIL] });
        },
    });
};

export const useToggleBlogStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status?: 'draft' | 'published' }) => toggleBlogStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BLOGS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PUBLIC_BLOGS] });
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAdminBlog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BLOGS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PUBLIC_BLOGS] });
        },
    });
};
