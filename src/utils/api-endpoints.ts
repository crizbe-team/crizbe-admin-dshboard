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

    // Variant endpoints
    GET_VARIANTS: 'products/variants/',
    GET_VARIANT: 'products/variants/:id/',

    // Stock endpoints
    GET_STOCK_LIST: 'stocks/',
    GET_PRODUCT_STOCK: 'stocks/product/:id/',
    GET_VARIANT_STOCK: 'stocks/variant/:id/',
    GET_STOCK_HISTORY: 'stocks/history/:id/',
    GET_STOCK_HISTORY_LIST: 'stocks/history/',

    // Cart endpoints
    GET_CART: 'orders/cart/',
    ADD_TO_CART: 'orders/cart/add/',
    UPDATE_CART_ITEM: 'orders/cart/update/',
    REMOVE_FROM_CART: 'orders/cart/remove/:id/',
    CLEAR_CART: 'orders/cart/clear/',
} as const;
