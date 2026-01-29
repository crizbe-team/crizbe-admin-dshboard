export const API_ENDPOINTS = {
    // Auth endpoints
    SIGN_IN: '/users/admin-login/',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',

    // Category endpoints
    GET_CATEGORIES: 'products/category/',
    GET_CATEGORY: 'products/category/:id/',

    // Product endpoints
    GET_PRODUCTS: 'products/products/',
    GET_PRODUCT: 'products/products/:id/',

    // Variant endpoints
    GET_VARIANTS: 'products/variants/',
    GET_VARIANT: 'products/variants/:id/',

    // Stock endpoints
    GET_STOCK_LIST: 'stocks/',
    GET_PRODUCT_STOCK: 'stocks/product/:id/',
    GET_VARIANT_STOCK: 'stocks/variant/:id/',
    GET_STOCK_HISTORY: 'stocks/history/:id/',
    GET_STOCK_HISTORY_LIST: 'stocks/history/',
} as const;
