export const API_ENDPOINTS = {
    // Auth endpoints
    SIGNUP_INITIATE: 'accounts/signup/initiate/',
    VERIFY_OTP: 'accounts/verify-otp/',
    RESEND_OTP: 'accounts/resend-otp/',
    SET_PASSWORD: 'accounts/set-password/',
    FORGOT_PASSWORD: 'accounts/forgot-password/',
    LOGIN: 'accounts/login/',
    GOOGLE_LOGIN: 'accounts/google/login/',
    REFRESH_TOKEN: 'accounts/token/refresh/',
    LOGOUT: 'accounts/logout/',

    // Category endpoints
    GET_CATEGORIES: 'products/category/',
    GET_CATEGORY: 'products/category/:id/',

    // Product endpoints
    GET_PRODUCTS: 'products/products/',
    GET_PRODUCT: 'products/products/:id/',
    GET_RELATED_PRODUCTS: 'products/products/:id/related/',
    GET_PRODUCT_REVIEWS: 'products/products/:slug/reviews/',
    GET_LANDING_PAGE_REVIEWS: 'products/landing-page/reviews/',

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
    ADMIN_ORDER_DETAIL: 'orders/admin/:pk/',
    GET_USER_ORDERS_ADMIN: 'orders/admin/user/:pk/',
    UPDATE_ORDER_STATUS: 'orders/admin/:pk/status/',
    UPDATE_ORDER_TRACKING: 'orders/admin/:pk/tracking/',
    GET_ADMIN_SALES_OVERVIEW: 'orders/admin/sales-overview/',
    GET_ADMIN_PRODUCT_PERFORMANCE: 'orders/admin/product-performance/:pk/',
    GET_ADMIN_VARIANT_PERFORMANCE: 'orders/admin/variant-performance/:pk/',

    // Cart endpoints
    GET_CART: 'orders/cart/',
    ADD_TO_CART: 'orders/cart/add/',
    UPDATE_CART_ITEM: 'orders/cart/update/',
    REMOVE_FROM_CART: 'orders/cart/remove/:id/',
    CLEAR_CART: 'orders/cart/clear/',

    // Core endpoints
    GET_COUNTRIES: 'core/countries/',
    GET_STATES: 'core/states/',

    // Account/Profile endpoints
    GET_ADDRESSES: 'accounts/addresses/',
    GET_ADDRESS: 'accounts/addresses/:id/',
    GET_MINIMAL_DETAILS: 'accounts/minimal-details/',

    // Client endpoints
    GET_CLIENTS: 'accounts/clients/',
    GET_CLIENT_DETAIL: 'accounts/clients/:pk/',

    // Payment endpoints
    GET_RAZORPAY_KEY_ID: 'payments/key-id/',
    CREATE_PAYMENT_ORDER: 'payments/create/',
    VERIFY_PAYMENT: 'payments/verify/',
    GET_PAYMENT_DETAILS: 'payments/:id/',
} as const;
