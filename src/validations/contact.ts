import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Invalid phone number' }),
    phone_country_code: z.string().optional(),
    location: z.string().min(2, { message: 'Location must be at least 2 characters' }),
    message: z.string().min(5, { message: 'Message must be at least 5 characters' }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
