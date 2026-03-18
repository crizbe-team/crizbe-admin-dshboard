export type OrderItem = {
    title?: string;
    weight?: string;
    qty?: number;
    price?: string;
    image?: string;
    id?: string;
    product_image?: string;
    product_name?: string;
    variant_size?: string;
    quantity?: number;
    subtotal?: string;
};

export type Order = {
    id: string;
    date?: string;
    created_at?: string;
    status: string;
    total?: string;
    total_amount?: string;
    items: OrderItem[];
    // Address Details
    first_name?: string;
    last_name?: string;
    address_line1?: string;
    street?: string;
    landmark?: string;
    country?: string;
    state?: string;
    city?: string;
    zip_code?: string;
    phone_number?: string;
    status_history?: { status: string; date: string }[];
};
