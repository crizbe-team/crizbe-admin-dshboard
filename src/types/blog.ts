export interface BlogItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    cover_image?: string | null;
    cover_image_url?: string | null;
    author_name: string;
    author_role: string;
    author_avatar?: string | null;
    author_avatar_url?: string | null;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    read_time: string;
    tags: string[];
    keywords: string[];
    status: 'draft' | 'published';
    published_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface BlogApiResponse<T> {
    status_code: number;
    message: string;
    data: T;
    errors?: Record<string, any>;
}

export interface BlogFilterParams {
    category?: string;
    status?: string;
    q?: string;
}
