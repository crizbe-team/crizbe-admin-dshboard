import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, 'Product name is required').max(100, 'Name is too long'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().min(1, 'Description is required'),
    ingredients: z.string().optional().or(z.literal('')),
});

export type ProductFormData = z.infer<typeof productSchema>;
