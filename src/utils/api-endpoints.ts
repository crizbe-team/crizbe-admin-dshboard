export const API_ENDPOINTS = {
    // Auth endpoints
    SIGN_IN: '/users/admin-login/',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',

    // Category endpoints
    GET_CATEGORIES: 'products/category/',
    GET_CATEGORY: 'products/category/:id/',
} as const;
