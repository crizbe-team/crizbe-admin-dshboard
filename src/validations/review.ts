import { z } from 'zod';

export const reviewSchema = z.object({
    rating: z.number({ message: 'Please select a rating' }).min(1, 'Please select a rating').max(5),
    comment: z.string(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
