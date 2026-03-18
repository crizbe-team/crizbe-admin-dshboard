import { z } from 'zod';

export const variantItemSchema = z.object({
    id: z.string().optional(),
    size: z.string().min(1, 'Size is required'),
    price: z.string().min(1, 'Price is required'),
    weight_per_unit: z.string().min(1, 'Weight is required'),
});

export const variantSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    variants: z.array(variantItemSchema).min(1, 'At least one variant is required'),
});

export type VariantFieldValues = z.infer<typeof variantSchema>;
export type VariantItemValues = z.infer<typeof variantItemSchema>;
