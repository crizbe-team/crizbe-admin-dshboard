import { z } from 'zod';

export const faqItemSchema = z.object({
    question: z.string().trim().min(1, 'Question is required'),
    answer: z.string().trim().min(1, 'Answer is required'),
});

export const productSchema = z.object({
    name: z.string().trim().min(1, 'Product name is required').max(100, 'Name is too long'),
    category: z.string().trim().min(1, 'Category is required'),
    description: z.string().trim().min(1, 'Description is required'),
    ingredients: z.string().trim().optional().or(z.literal('')),
    meta_title: z.string().trim().optional().or(z.literal('')),
    meta_description: z.string().trim().optional().or(z.literal('')),
    meta_keywords: z.string().trim().optional().or(z.literal('')),
    faqs: z.array(faqItemSchema).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
