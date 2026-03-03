import { z } from 'zod';

// Signup validation schema
export const signupSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .optional()
        .or(z.literal('')),
    phone: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must not exceed 15 digits')
        .regex(/^\+?\d+$/, 'Phone number must contain only digits and may start with +')
        .optional()
        .or(z.literal('')),
}).refine(
    (data) => {
        // Either email or phone must be provided
        return (data.email && data.email.length > 0) || (data.phone && data.phone.length > 0);
    },
    {
        message: 'Please provide either email or phone number',
        path: ['email'],
    }
);

// OTP validation schema
export const otpSchema = z.object({
    otp: z.string()
        .length(4, 'OTP must be 4 digits')
        .regex(/^\d+$/, 'OTP must contain only digits'),
});

// Password setup validation schema
export const passwordSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
});

// Type exports
export type SignupFormData = z.infer<typeof signupSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
