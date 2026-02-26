export const API_ENDPOINTS = {
    // Auth endpoints
    SIGN_UP: 'accounts/signup/',
    LOGIN: 'accounts/login/',
    REFRESH_TOKEN: 'accounts/token/refresh/',
    LOGOUT: 'accounts/logout/',

    // Category endpoints
    GET_CATEGORIES: 'products/category/',
    GET_CATEGORY: 'products/category/:id/',

    // Product endpoints
    GET_PRODUCTS: 'products/products/',
    GET_PRODUCT: 'products/products/:id/',
    GET_RELATED_PRODUCTS: 'products/products/:id/related/',

    // Variant endpoints
    GET_VARIANTS: 'products/variants/',
    GET_VARIANT: 'products/variants/:id/',

    // Stock endpoints
    GET_STOCK_LIST: 'stocks/',
    GET_PRODUCT_STOCK: 'stocks/product/:id/',
    GET_VARIANT_STOCK: 'stocks/variant/:id/',
    GET_STOCK_HISTORY: 'stocks/history/:id/',
    GET_STOCK_HISTORY_LIST: 'stocks/history/',

    // Order endpoints
    CREATE_ORDER: 'orders/checkout/',
    ORDER_LIST: 'orders/list/',
    ORDER_DETAIL: 'orders/orders/:id/',
    ADMIN_ORDER_LIST: 'orders/admin/list/',
    UPDATE_ORDER_STATUS: 'orders/admin/:id/status/',
} as const;
