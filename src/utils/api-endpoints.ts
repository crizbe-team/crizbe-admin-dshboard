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
    ADMIN_BULK_ORDER_STATUS: 'orders/admin/bulk-status/',
    UPDATE_ORDER_TRACKING: 'orders/admin/:pk/tracking/',
    GET_ADMIN_SALES_OVERVIEW: 'orders/admin/sales-overview/',
    GET_ADMIN_DASHBOARD_OVERVIEW: 'orders/admin/dashboard-overview/',
    GET_ADMIN_PRODUCT_PERFORMANCE: 'orders/admin/product-performance/:pk/',
    GET_ADMIN_VARIANT_PERFORMANCE: 'orders/admin/variant-performance/:pk/',

    // Cart endpoints
    GET_CART: 'orders/cart/',
    GET_CART_SUMMARY: 'orders/cart/summary/',
    ADD_TO_CART: 'orders/cart/add/',
    UPDATE_CART_ITEM: 'orders/cart/update/',
    REMOVE_FROM_CART: 'orders/cart/remove/:id/',
    CLEAR_CART: 'orders/cart/clear/',

    // Core endpoints
    GET_COUNTRIES: 'core/countries/',
    GET_STATES: 'core/states/',
    GET_CURRENCY_RATES: 'core/currency-rates/',
    GET_ADMIN_CURRENCIES: 'core/admin/currencies/',
    CREATE_ADMIN_CURRENCY: 'core/admin/currencies/create/',
    MANAGE_ADMIN_CURRENCY: 'core/admin/currencies/:id/',
    GET_ENQUIRIES: 'enquiries/',
    GET_ENQUIRY_DETAIL: 'enquiries/:id/',

    // Account/Profile & Role endpoints
    GET_ADDRESSES: 'accounts/addresses/',
    GET_ADDRESS: 'accounts/addresses/:id/',
    GET_MINIMAL_DETAILS: 'accounts/minimal-details/',
    UPDATE_PROFILE: 'accounts/profile/update/',
    UPLOAD_PROFILE_PICTURE: 'accounts/profile/upload-picture/',
    GET_ADMIN_ROLES: 'accounts/admin/roles/',
    CREATE_ADMIN_ROLE: 'accounts/admin/roles/create/',
    MANAGE_ADMIN_ROLE: 'accounts/admin/roles/:id/',
    GET_ADMIN_USERS: 'accounts/admin/users/',
    CREATE_ADMIN_USER: 'accounts/admin/users/create/',
    MANAGE_ADMIN_USER: 'accounts/admin/users/:id/',

    // Client endpoints
    GET_CLIENTS: 'accounts/clients/',
    GET_CLIENT_DETAIL: 'accounts/clients/:pk/',

    // Payment endpoints
    GET_RAZORPAY_KEY_ID: 'payments/key-id/',
    CREATE_PAYMENT_ORDER: 'payments/create/',
    VERIFY_PAYMENT: 'payments/verify/',
    GET_PAYMENT_DETAILS: 'payments/:id/',

    // Notification endpoints
    GET_ADMIN_NOTIFICATIONS: 'core/notifications/',
    MARK_ADMIN_NOTIFICATION_READ: 'core/notifications/mark-read/',
    CLEAR_ADMIN_NOTIFICATIONS: 'core/notifications/clear/',
    SUBSCRIBE_PUSH_NOTIFICATION: 'core/notifications/push-subscribe/',

    // Blog endpoints
    GET_PUBLIC_BLOGS: 'blogs/',
    GET_PUBLIC_BLOG_DETAIL: 'blogs/:slug/',
    GET_ADMIN_BLOGS: 'blogs/admin/list/',
    CREATE_ADMIN_BLOG: 'blogs/admin/create/',
    GET_ADMIN_BLOG_DETAIL: 'blogs/admin/:id/',
    UPDATE_ADMIN_BLOG: 'blogs/admin/:id/update/',
    TOGGLE_ADMIN_BLOG_STATUS: 'blogs/admin/:id/status/',
    DELETE_ADMIN_BLOG: 'blogs/admin/:id/delete/',
} as const;
