import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone_number: z.string().min(10, { message: 'Invalid phone number' }),
    phone_country_code: z.string().optional(),
    location: z.string().min(2, { message: 'Location must be at least 2 characters' }),
    message: z.string().min(5, { message: 'Message must be at least 5 characters' }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const preOrderSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    phoneNumber: z
        .string()
        .min(7, { message: 'Phone number must be at least 7 digits' })
        .max(15, { message: 'Phone number cannot exceed 15 digits' })
        .regex(/^\d+$/, { message: 'Phone number must contain only digits' }),
    phoneCountryCode: z.string().min(1, { message: 'Country code is required' }),
    email: z
        .string()
        .email({ message: 'Invalid email address' })
        .or(z.literal(''))
        .optional(),
    targetDate: z.string().optional(),
    message: z.string().optional(),
});

export type PreOrderFormData = z.infer<typeof preOrderSchema>;
