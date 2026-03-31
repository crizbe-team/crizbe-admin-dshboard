import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().trim().min(1, 'Category name is required').max(100, 'Name is too long'),
    description: z.string().trim().optional().or(z.literal('')),
    is_active: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
