import { z } from 'zod';

export const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z
        .string()
        .min(7, 'Phone number must be at least 7 digits')
        .max(15, 'Phone number cannot exceed 15 digits')
        .regex(/^\d+$/, 'Phone number must contain only digits'),
    phoneCountryCode: z.string().min(1, 'Country code is required'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
