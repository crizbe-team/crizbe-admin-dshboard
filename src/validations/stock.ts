import { z } from 'zod';

export const stockSchema = z.object({
    product: z.string().min(1, 'Please select a product'),
    quantity: z
        .string()
        .min(1, 'Quantity is required')
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: 'Quantity must be a positive number',
        }),
    type: z.enum(['Addition', 'Removal']), // I'll assume Removal but user only said Addition. I will stick to what's likely.
    notes: z.string().optional(),
});

export const variantStockSchema = z.object({
    variantId: z.string().min(1, 'Please select a variant'),
    quantity: z
        .string()
        .min(1, 'Quantity is required')
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: 'Quantity must be a positive number',
        }),
    purchase_price: z.string().optional(),
    notes: z.string().optional(),
});

export type StockFormData = z.infer<typeof stockSchema>;
export type VariantStockFormData = z.infer<typeof variantStockSchema>;
